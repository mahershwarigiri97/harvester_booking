import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface NavigationMapProps {
  navigationStarted: boolean;
  farmerCoords?: { latitude: number; longitude: number };
  ownerCoords?: { latitude: number; longitude: number };
}

export function NavigationMapView({ navigationStarted, farmerCoords, ownerCoords }: NavigationMapProps) {
  const lat = farmerCoords?.latitude || 20.61;
  const lng = farmerCoords?.longitude || 78.98;
  const fromLat = ownerCoords?.latitude || 20.59;
  const fromLng = ownerCoords?.longitude || 78.96;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(fromLng, lng) - 0.02},${Math.min(fromLat, lat) - 0.02},${Math.max(fromLng, lng) + 0.02},${Math.max(fromLat, lat) + 0.02}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <iframe
        src={mapUrl}
        style={{ width: '100%', height: '100%', border: 'none' } as any}
        title="Navigation Map"
        loading="lazy"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.3)', 'transparent', 'transparent', 'rgba(26,28,25,0.5)']}
        locations={[0, 0.2, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <View style={styles.routeBadge}>
        <View style={[styles.dot, { backgroundColor: navigationStarted ? '#0d631b' : '#fcab28' }]} />
        <Text style={styles.routeText}>{navigationStarted ? 'En Route' : 'Route Planned'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  routeBadge: {
    position: 'absolute',
    top: 80,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1c19',
  },
});
