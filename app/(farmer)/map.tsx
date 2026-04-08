import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { HarvesterFullMap } from '../../components/HarvesterFullMap';
import { authApi } from '../../utils/api';
import { HARVESTERS } from '../../constants/harvesterData';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { getLastJobDuration } from '../../utils/bookingUtils';

export default function MapScreen() {
  const router = useRouter();
  const { currentLocation } = useCurrentLocation();

  const { data: harvesters = [] } = useQuery({
    queryKey: ['harvesters-map', currentLocation?.coords.latitude, currentLocation?.coords.longitude],
    queryFn: async () => {
      try {
        const res = await authApi.getHarvesters();
        const dbData = res.data.data;
        if (dbData && dbData.length > 0) {
          return dbData.map((item: any) => ({
            id: String(item.id),
            name: `${item.brand} ${item.model}`,
            price: `₹${item.price_per_acre || item.price_per_hour || '0'}`,
            rating: item.owner?.rating?.toFixed(1) || '0.0',
            image: item.images?.[0] || null,
            lastJobDuration: getLastJobDuration(item.bookings),
            ownerLocation: item.owner,
          }));
        }
        return HARVESTERS.filter(h => !h.isNew).map(h => ({
          id: h.id,
          name: h.name,
          price: h.price,
          rating: h.rating,
          image: h.image || null,
        }));
      } catch {
        return HARVESTERS.filter(h => !h.isNew).map(h => ({
          id: h.id,
          name: h.name,
          price: h.price,
          rating: h.rating,
          image: h.image || null,
        }));
      }
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fafaf5' }}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <HarvesterFullMap
        harvesters={harvesters}
        userLocation={
          currentLocation
            ? { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude }
            : null
        }
        onPressMarker={(id) => router.push({ pathname: '/details/[id]', params: { id } })}
      />
    </View>
  );
}
