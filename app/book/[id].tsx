import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { TouchableOpacity, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { BookingForm } from '../../components/BookingForm';
import { authApi } from '../../utils/api';
import { Harvester, getHarvesterById } from '../../constants/harvesterData';
import { DetailsSkeleton } from '../../components/DetailsSkeleton';

export default function BookHarvester() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: harvester, isLoading } = useQuery({
    queryKey: ['harvester', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await authApi.getHarvesterById(id);
        const item = res.data.data;
        if (item) {
          return {
            id: String(item.id),
            name: `${item.brand} ${item.model}`,
            distance: '2.4 km',
            price: `₹${item.price_per_acre || item.price_per_hour || '0'}`,
            perUnit: item.price_per_acre ? '/ acre' : '/ hour',
            rating: item.owner?.rating?.toFixed(1) || '0.0',
            jobs: (item.bookings?.length || 0).toString() + '+',
            year: item.model,
            image: item.images[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLGvKSPRqo9QcOGgXchxQD_30CplkCQx8qPUdl1bxd9vA0beMT33oRij4EJJumWtMxMDR54FcYQ44CzO7NErxWKdTKXjl6uEHtsyTZNhBuy--gzwBMCou-sQZ8yyT7dbiS60NA412n383OSOboZDfVsxgFrve48F5MypV0KP5k2fxdEbu4rmPbyAIx_xF01MV0bxglqZwoxKXbiDml3ub_m4F5wdaJ_du2T-PXzJhSXLgx8sZxEnoXeudlgTBCu4efMnw0yK9AdEuZ',
            status: item.is_available ? 'available' : 'busy',
            workSpeed: '2 acres / hour',
            estimatedTime: '~3 hours',
            owner: {
              name: item.owner?.name || 'Owner',
              experience: '10',
              avatar: item.owner?.avatar
            },
          } as Harvester;
        }
        return getHarvesterById(id) || null;
      } catch (err) {
        console.error('Failed to fetch harvester for booking', err);
        return getHarvesterById(id || '1') || null;
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!harvester) {
    return (
      <View className="flex-1 bg-[#fafaf5] items-center justify-center px-8">
        <MaterialIcons name="error-outline" size={64} color="#bfcaba" />
        <Text className="text-[#40493d] text-lg font-bold mt-4 text-center">
          Harvester not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-[#0d631b] px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#fafaf5]">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* ── Header ── */}
      <View
        className="w-full flex-row items-center justify-between px-6 pb-4 bg-white/95"
        style={{ paddingTop: Math.max(insets.top, 20) + 16, zIndex: 10 }}
      >
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            className="w-10 h-10 rounded-full items-center justify-center bg-[#e3e3de]/50"
          >
            <MaterialIcons name="arrow-back" size={24} color="#0d631b" />
          </TouchableOpacity>
          <Text className="font-headline font-extrabold text-[#0d631b] tracking-tight text-xl">
            Book Your Harvest
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-[#f4f4ef] items-center justify-center">
          <MaterialIcons name="help-outline" size={24} color="#40493d" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <View className="flex-row items-center gap-3 px-2 mb-8">
          <View className="flex-1 h-2 rounded-full bg-[#2e7d32]" />
          <View className="flex-1 h-2 rounded-full bg-[#2e7d32]" />
          <View className="flex-1 h-2 rounded-full bg-[#e8e8e3]" />
        </View>

        {/* Form Container */}
        <BookingForm harvester={harvester} pricePerAcre={parseInt(harvester.price.replace(/[^0-9]/g, ''), 10)} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 w-full bg-white/95 px-6 pt-4 items-center z-50 border-t border-[#e8e8e3]/60"
        style={{ 
          paddingBottom: Math.max(insets.bottom, 24),
          shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.04, elevation: 20
        }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push(`/confirmation/${id}` as any)}
          className="w-full max-w-2xl h-16 rounded-2xl flex-row items-center justify-center gap-3"
          style={{ 
            backgroundColor: '#0d631b',
            shadowColor: '#0d631b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8
          }}
        >
          <Text className="text-white font-bold text-lg">Confirm & Book Now</Text>
          <MaterialIcons name="chevron-right" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-[10px] text-[#40493d] font-medium uppercase tracking-widest mt-3">
          Secure Payment Powered by HarvestLink
        </Text>
      </View>
    </View>
  );
}
