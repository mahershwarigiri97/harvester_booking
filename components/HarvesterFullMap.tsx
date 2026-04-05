import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

interface Harvester {
  id: string;
  name: string;
  price: string;
  rating: string;
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

export function HarvesterFullMap({ harvesters, userLocation, onPressMarker }: HarvesterFullMapProps) {
  const initialRegion = {
    latitude: userLocation?.latitude || 20.5937,
    longitude: userLocation?.longitude || 78.9629,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        mapType="none"
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            description="Your current location"
            pinColor="blue"
          />
        )}
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
                />
            );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 110,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  map: {
    flex: 1,
  },
});
