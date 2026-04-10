import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HomeHeader } from '../../components/HomeHeader';
import { SearchBar } from '../../components/SearchBar';
import { ListingCard } from '../../components/ListingCard';
import { SmallListingCard } from '../../components/SmallListingCard';
import { ListingSkeletonList } from '../../components/ListingSkeleton';
import { HARVESTERS } from '../../constants/harvesterData';
import { authApi } from '../../utils/api';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { getLastJobDuration } from '../../utils/bookingUtils';

export default function HomeScreen() {
  const { locationName, currentLocation } = useCurrentLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const langs = ['en', 'hi', 'mr'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  const { data: harvesters = [], isLoading } = useQuery({
    queryKey: ['harvesters', currentLocation?.coords.latitude, currentLocation?.coords.longitude],
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
            jobs: (item.bookings?.length || 0).toString(),
            image: item.images[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLGvKSPRqo9QcOGgXchxQD_30CplkCQx8qPUdl1bxd9vA0beMT33oRij4EJJumWtMxMDR54FcYQ44CzO7NErxWKdTKXjl6uEHtsyTZNhBuy--gzwBMCou-sQZ8yyT7dbiS60NA412n383OSOboZDfVsxgFrve48F5MypV0KP5k2fxdEbu4rmPbyAIx_xF01MV0bxglqZwoxKXbiDml3ub_m4F5wdaJ_du2T-PXzJhSXLgx8sZxEnoXeudlgTBCu4efMnw0yK9AdEuZ',
            lastJobDuration: getLastJobDuration(item.bookings),
            ownerLocation: item.owner,
            farmerLocation: currentLocation ? { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude } : null,
          }));
        }

        return HARVESTERS.filter(h => !h.isNew).map(h => ({
          id: h.id,
          name: h.name,
          distance: h.distance,
          price: h.price,
          rating: h.rating,
          image: h.image
        }));
      } catch (err) {
        return HARVESTERS.filter(h => !h.isNew).map(h => ({
          id: h.id,
          name: h.name,
          distance: h.distance,
          price: h.price,
          rating: h.rating,
          image: h.image
        }));
      }
    }
  });

  const newArrival = HARVESTERS.find(h => h.isNew)!;

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <HomeHeader location={locationName} />

      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between">
          <SearchBar />
          <TouchableOpacity 
            onPress={toggleLanguage}
            className="ml-2 p-2 bg-secondary/10 rounded-full"
          >
            <MaterialIcons name="language" size={24} color="#0d631b" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
            <ListingSkeletonList />
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
            <View className="pt-2">
              <View className="flex-row items-baseline justify-between mb-4">
                <Text className="text-2xl font-headline font-extrabold text-primary tracking-tight">
                  {t('common.availableNearYou')}
                </Text>
                <Text className="text-sm font-bold text-secondary">{harvesters.length} {t('common.units')}</Text>
              </View>

              {harvesters.map((item: any) => (
                <ListingCard key={item.id} {...item} />
              ))}

              <SmallListingCard {...newArrival} />
            </View>
          </ScrollView>
        )}
      </View>

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
