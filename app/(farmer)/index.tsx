import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeHeader } from '../../components/HomeHeader';
import { SearchBar } from '../../components/SearchBar';
import { ListMapToggle } from '../../components/ListMapToggle';
import { ListingCard } from '../../components/ListingCard';
import { SmallListingCard } from '../../components/SmallListingCard';
import { HARVESTERS } from '../../constants/harvesterData';
import { authApi } from '../../utils/api';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';

export default function HomeScreen() {
  const { locationName, locationData } = useCurrentLocation();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [harvesters, setHarvesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHarvesters = async () => {
      try {
        const res = await authApi.getHarvesters();
        const dbData = res.data.data;
        
        if (dbData && dbData.length > 0) {
          // Map DB data to match ListingCard props
          const mappedData = dbData.map((item: any) => ({
            id: String(item.id),
            name: `${item.brand} ${item.model}`,
            distance: (Math.random() * 5 + 1).toFixed(1) + ' km', // Random mock distance
            price: `₹${item.price_per_acre || item.price_per_hour || '0'}`,
            rating: item.owner?.rating?.toFixed(1) || '0.0',
            jobs: (item.bookings?.length || 0).toString(),
            image: item.images[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLGvKSPRqo9QcOGgXchxQD_30CplkCQx8qPUdl1bxd9vA0beMT33oRij4EJJumWtMxMDR54FcYQ44CzO7NErxWKdTKXjl6uEHtsyTZNhBuy--gzwBMCou-sQZ8yyT7dbiS60NA412n383OSOboZDfVsxgFrve48F5MypV0KP5k2fxdEbu4rmPbyAIx_xF01MV0bxglqZwoxKXbiDml3ub_m4F5wdaJ_du2T-PXzJhSXLgx8sZxEnoXeudlgTBCu4efMnw0yK9AdEuZ'
          }));
          setHarvesters(mappedData);
        } else {
          // If no data in DB, use mock data as fallback
          const defaultData = HARVESTERS.filter(h => !h.isNew).map(h => ({
            id: h.id,
            name: h.name,
            distance: h.distance,
            price: h.price,
            rating: h.rating,
            image: h.image
          }));
          setHarvesters(defaultData);
        }
      } catch (err) {
        console.error('Failed to fetch harvesters', err);
        // Fallback on error
        const defaultData = HARVESTERS.filter(h => !h.isNew).map(h => ({
          id: h.id,
          name: h.name,
          distance: h.distance,
          price: h.price,
          rating: h.rating,
          image: h.image
        }));
        setHarvesters(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchHarvesters();
  }, []);

  const newArrival = HARVESTERS.find(h => h.isNew)!;

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <HomeHeader location={locationName} />
      
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <SearchBar />
        <ListMapToggle viewMode={viewMode} onToggle={setViewMode} />
        
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#0d631b" />
          </View>
        ) : viewMode === 'list' ? (
          <View className="pt-2">
            <View className="flex-row items-baseline justify-between mb-4">
              <Text className="text-2xl font-headline font-extrabold text-primary tracking-tight">Available Near You</Text>
              <Text className="text-sm font-bold text-secondary">{harvesters.length} Units</Text>
            </View>
            
            {harvesters.map(item => (
              <ListingCard key={item.id} {...item} />
            ))}
            
            <SmallListingCard {...newArrival} />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <MaterialIcons name="map" size={64} color="#bfcaba" />
            <Text className="text-on-surface-variant mt-4 font-bold text-lg">Map view coming soon...</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-28 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center active:scale-95 z-40"
        style={{ shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
