import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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

export function HarvesterFullMap({ harvesters, userLocation }: HarvesterFullMapProps) {
  const lat = userLocation?.latitude || 20.5937;
  const lng = userLocation?.longitude || 78.9629;

  // Build OpenStreetMap embed URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <View style={styles.container}>
      {/* Map iframe for web */}
      <iframe
        src={mapUrl}
        style={{ width: '100%', height: '100%', border: 'none' } as any}
        title="Harvester Map"
        loading="lazy"
      />
      {/* Overlay badge */}
      <View style={styles.badge}>
        <MaterialIcons name="location-on" size={14} color="#0d631b" />
        <Text style={styles.badgeText}>Map • {harvesters.length} harvesters</Text>
      </View>
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
    minHeight: 400,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d631b',
  },
});
