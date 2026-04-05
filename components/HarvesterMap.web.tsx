import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DistanceBadgeProps {
  ownerLocation?: { current_latitude: number; current_longitude: number } | null;
  farmerLocation?: { latitude: number; longitude: number } | null;
  className?: string;
  textSize?: string;
  staticDistance?: string;
}

function WebDistanceBadge({ staticDistance }: DistanceBadgeProps) {
  if (!staticDistance) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <MaterialIcons name="near-me" size={14} color="#0d631b" />
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#0d631b' }}>{staticDistance}</Text>
    </View>
  );
}

export function HarvesterMap({
  ownerLocation,
  farmerLocation,
}: {
  ownerLocation?: { current_latitude: number; current_longitude: number } | null;
  farmerLocation?: { latitude: number; longitude: number } | null;
}) {
  const lat = ownerLocation?.current_latitude || farmerLocation?.latitude || 20.5937;
  const lng = ownerLocation?.current_longitude || farmerLocation?.longitude || 78.9629;

  // Build OpenStreetMap embed URL centered between both points
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <View style={styles.wrapper}>
      {/* Section header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialIcons name="location-on" size={24} color="#0d631b" />
          <Text style={styles.headerText}>Location</Text>
        </View>
      </View>

      {/* Map iframe */}
      <View style={styles.mapContainer}>
        <iframe
          src={mapUrl}
          style={{ width: '100%', height: '100%', border: 'none' } as any}
          title="Harvester Location Map"
          loading="lazy"
        />

        {/* View on Map button overlay */}
        <TouchableOpacity style={styles.mapBtn} activeOpacity={0.85}>
          <MaterialIcons name="map" size={18} color="#0d631b" />
          <Text style={styles.mapBtnText}>View on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d631b',
  },
  mapContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 240,
    backgroundColor: '#e3e3de',
    position: 'relative',
  },
  mapBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  mapBtnText: {
    fontWeight: 'bold',
    color: '#0d631b',
    fontSize: 14,
  },
});
