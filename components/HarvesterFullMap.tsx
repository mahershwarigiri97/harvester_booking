import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

interface Harvester {
  id: string;
  name: string;
  price: string;
  rating: string;
  image?: string | null;
  ownerLocation?: {
    current_latitude: number;
    current_longitude: number;
  } | null;
}

interface HarvesterFullMapProps {
  harvesters: Harvester[];
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  onPressMarker?: (id: string) => void;
}

function HarvesterMarker({ image, price }: { image?: string | null; price: string }) {
  return (
    <View style={markerStyles.wrapper}>
      {/* Pin circle */}
      <View style={markerStyles.circle}>
        {image ? (
          <Image source={{ uri: image }} style={markerStyles.image} />
        ) : (
          <View style={markerStyles.fallback}>
            <MaterialIcons name="agriculture" size={22} color="#fff" />
          </View>
        )}
      </View>
      {/* Price badge */}
      <View style={markerStyles.badge}>
        <Text style={markerStyles.badgeText}>{price}</Text>
      </View>
      {/* Pin tail */}
      <View style={markerStyles.tail} />
    </View>
  );
}

export function HarvesterFullMap({ harvesters, userLocation, onPressMarker }: HarvesterFullMapProps) {
  const mapRef = React.useRef<MapView>(null);

  React.useEffect(() => {
    if (userLocation && harvesters.length > 0 && mapRef.current) {
      const sorted = [...harvesters]
        .filter(h => h.ownerLocation?.current_latitude && h.ownerLocation?.current_longitude)
        .sort((a, b) => {
          const latA = a.ownerLocation!.current_latitude;
          const lngA = a.ownerLocation!.current_longitude;
          const latB = b.ownerLocation!.current_latitude;
          const lngB = b.ownerLocation!.current_longitude;
          const distA = Math.pow(latA - userLocation.latitude, 2) + Math.pow(lngA - userLocation.longitude, 2);
          const distB = Math.pow(latB - userLocation.latitude, 2) + Math.pow(lngB - userLocation.longitude, 2);
          return distA - distB;
        });

      const nearest = sorted.slice(0, 3);
      if (nearest.length > 0) {
        const coordsToFit = [
          userLocation,
          ...nearest.map(h => ({
            latitude: h.ownerLocation!.current_latitude,
            longitude: h.ownerLocation!.current_longitude
          }))
        ];

        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coordsToFit, {
            edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
            animated: true,
          });
        }, 500);
      }
    }
  }, [harvesters, userLocation]);

  const initialRegion = {
    latitude: userLocation?.latitude || 20.5937,
    longitude: userLocation?.longitude || 78.9629,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        mapType="none"
      >
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
          maximumZ={19}
          flipY={false}
          tileSize={512}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            description="Your current location"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={markerStyles.userMarker}>
              <MaterialIcons name="person-pin-circle" size={36} color="#1565C0" />
            </View>
          </Marker>
        )}

        {/* Harvester markers */}
        {harvesters.map((item) => {
          const lat = item.ownerLocation?.current_latitude;
          const lng = item.ownerLocation?.current_longitude;
          if (!lat || !lng) return null;

          return (
            <Marker
              key={item.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={item.name}
              description={`${item.price}  •  ⭐ ${item.rating}  •  Tap to view`}
              onPress={() => onPressMarker?.(item.id)}
              anchor={{ x: 0.5, y: 1 }}
            >
              <HarvesterMarker image={item.image} price={item.price} />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

const markerStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#2196F3',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
    borderRadius: 30
  },
  fallback: {
    width: 30,
    height: 30,
    backgroundColor: '#0d631b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
  },
  badge: {
    marginTop: 3,
    backgroundColor: '#0d631b',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  tail: {
    width: 3,
    height: 8,
    backgroundColor: '#0d631b',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  userMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
