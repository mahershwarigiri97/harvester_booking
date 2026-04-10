import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { LeafletMap } from './LeafletMap';
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
  brand?: string;
  model?: string;
  owner?: {
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
  const markers = React.useMemo(() => {
    return harvesters.map(h => ({
      id: h.id.toString(),
      latitude: h.owner?.current_latitude || h.ownerLocation?.current_latitude || 0,
      longitude: h.owner?.current_longitude || h.ownerLocation?.current_longitude || 0,
      icon: 'harvester' as any,
      title: (h.brand || h.name || '') + ' ' + (h.model || '')
    }));
  }, [harvesters]);

  const finalMarkers = React.useMemo(() => {
    const list = [...markers];
    if (userLocation) {
      list.push({
        id: 'user',
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        icon: 'farmer' as const,
        title: 'Your Location'
      });
    }
    return list;
  }, [markers, userLocation]);

  return (
    <View style={styles.container}>
      <LeafletMap
        initialRegion={{
          latitude: userLocation?.latitude || 20.5937,
          longitude: userLocation?.longitude || 78.9629,
        }}
        markers={finalMarkers}
      />
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
