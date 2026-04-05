import MapView, { Marker, UrlTile } from 'react-native-maps';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DistanceBadge } from './DistanceBadge';

// ─────────────────────────────────────────────────────
export function HarvesterMap({
  ownerLocation,
  farmerLocation
}: {
  ownerLocation?: { current_latitude: number; current_longitude: number } | null;
  farmerLocation?: { latitude: number; longitude: number } | null;
}) {
  const initialRegion = {
    latitude: ownerLocation?.current_latitude || farmerLocation?.latitude || 20.5937,
    longitude: ownerLocation?.current_longitude || farmerLocation?.longitude || 78.9629,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={{ marginBottom: 32 }}>

      {/* ── Section Header ── */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <MaterialIcons name="location-on" size={24} color="#0d631b" />
          <Text
            className="font-headline font-bold text-primary"
            style={{ fontSize: 20 }}
          >
            Location
          </Text>
        </View>

        <DistanceBadge
          ownerLocation={ownerLocation}
          farmerLocation={farmerLocation}
          className="bg-surface-container-highest px-3 py-1 rounded-lg flex-row items-center gap-1"
          textSize="text-sm font-bold"
        />
      </View>

      {/* ── Map (rounded-3xl, h-240) ── */}
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          height: 240,
          backgroundColor: '#e3e3de',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        }}
      >
        <MapView
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          mapType="none"
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {ownerLocation && (
            <Marker
              coordinate={{
                latitude: ownerLocation.current_latitude,
                longitude: ownerLocation.current_longitude,
              }}
              title="Harvester"
            />
          )}
          {farmerLocation && (
            <Marker
              coordinate={{
                latitude: farmerLocation.latitude,
                longitude: farmerLocation.longitude,
              }}
              title="You"
              pinColor="blue"
            />
          )}
        </MapView>

        {/* Subtle overlay (for non-interactive look) */}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
          pointerEvents="none"
        />

        {/* "View on Map" button — absolute bottom-right */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="absolute bottom-5 right-5 flex-row items-center bg-white px-5 py-3 rounded-xl"
          style={{
            gap: 8,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
          }}
        >
          <MaterialIcons name="map" size={18} color="#0d631b" />
          <Text className="font-bold text-primary text-sm">View on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
