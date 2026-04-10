import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getHarvesterById } from '../../constants/harvesterData';
import { DetailsSkeleton } from '../../components/DetailsSkeleton';

import { HarvesterMap } from '../../components/HarvesterMap';
import { OwnerCard } from '../../components/OwnerCard';
import { Specification } from '../../components/Specification';
import { authApi } from '../../utils/api';
import { Harvester } from '../../constants/harvesterData';
import { getLastJobDuration } from '../../utils/bookingUtils';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { DistanceBadge } from '../../components/DistanceBadge';

const { width: SCREEN_W } = Dimensions.get('window');


export default function HarvesterDetails() {
  const { currentLocation } = useCurrentLocation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

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
            price: `₹${item.price_per_acre || item.price_per_hour || '0'}`,
            perUnit: item.price_per_acre ? t('common.perAcre') : t('common.perHour'),
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
            ownerRaw: item.owner,
            lastJobDuration: getLastJobDuration(item.bookings),
          } as Harvester & { lastJobDuration?: string; ownerRaw?: any };
        }
        return getHarvesterById(id) || null;
      } catch (err) {
        console.error('Failed to fetch harvester details', err);
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
      <View className="flex-1 bg-background items-center justify-center px-8">
        <MaterialIcons name="error-outline" size={64} color="#bfcaba" />
        <Text className="text-on-surface-variant text-lg font-bold mt-4 text-center">
          {t('bookings.notFound')}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-primary px-8 py-4 rounded-2xl"
        >
          <Text className="text-white font-bold">{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const heroImages = [harvester.image];
  const heroH = Math.min(Math.round(SCREEN_W * (9 / 21)), 260);
  const isAvailable = harvester.status === 'available';

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* ── Floating Nav ── */}
      <View
        className="absolute top-0 w-full z-20 flex-row justify-between items-center px-5"
        style={{ paddingTop: 52 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          className="w-11 h-11 rounded-full bg-white/90 items-center justify-center"
          style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 }}
        >
          <MaterialIcons name="arrow-back" size={22} color="#0d631b" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          className="w-11 h-11 rounded-full bg-white/90 items-center justify-center"
          style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 }}
        >
          <MaterialIcons name="favorite-border" size={22} color="#ba1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View
          className="mx-4 mt-16 rounded-3xl overflow-hidden"
          style={{
            height: heroH,
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 12,
          }}
        >
          <Image
            source={{ uri: heroImages[activeSlide] }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          <View className="absolute inset-0 flex-row items-center justify-between px-3">
            <TouchableOpacity
              onPress={() => setActiveSlide(s => (s === 0 ? heroImages.length - 1 : s - 1))}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
            >
              <MaterialIcons name="chevron-left" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSlide(s => (s === heroImages.length - 1 ? 0 : s + 1))}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
            >
              <MaterialIcons name="chevron-right" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="absolute bottom-4 w-full flex-row justify-center" style={{ gap: 8 }}>
            {heroImages.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveSlide(i)}
                style={{
                  width: 10, height: 10, borderRadius: 5,
                  backgroundColor: i === activeSlide ? '#ffffff' : 'rgba(255,255,255,0.45)',
                }}
              />
            ))}
          </View>
        </View>

        <View className="px-5 mt-6 mb-8">
          <View
            className="self-start flex-row items-center px-4 py-1.5 rounded-full mb-3"
            style={{
              backgroundColor: isAvailable ? '#a3f69c' : '#ffdad6',
              gap: 7,
            }}
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isAvailable ? '#0d631b' : '#ba1a1a' }}
            />
            <Text
              className="text-xs font-semibold"
              style={{ color: isAvailable ? '#005312' : '#93000a' }}
            >
              {isAvailable ? t('common.available') : t('common.busy')}
            </Text>
          </View>

          <Text
            className="font-headline font-extrabold text-on-surface tracking-tight mb-2"
            style={{ fontSize: 26, lineHeight: 32 }}
          >
            {harvester.name}
          </Text>

          <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text className="text-on-surface-variant text-sm font-medium">
                {t('common.modelYear')}: {harvester.year}
              </Text>
            </View>
            <View className="bg-primary/10 px-3 py-1 rounded-full flex-row items-center gap-1">
              <MaterialIcons name="history" size={14} color="#0d631b" />
              <Text className="text-primary text-[10px] font-bold uppercase tracking-tight">{t('common.lastJob')}: {(harvester as any).lastJobDuration}</Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          <Specification
            workSpeed={harvester.workSpeed}
            estimatedTime={harvester.estimatedTime}
            isAvailable={isAvailable}
            distance={harvester.distance}
          />
        </View>

        <View className="px-5">
          <OwnerCard
            name={harvester.owner.name}
            experience={harvester.owner.experience}
            avatar={harvester.owner.avatar}
            rating={harvester.rating !== 'New' ? harvester.rating : undefined}
            jobs={harvester.jobs}
          />
        </View>

        <View className="px-5">
          <HarvesterMap
            ownerLocation={(harvester as any).ownerRaw}
            farmerLocation={currentLocation ? { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude } : null}
          />
        </View>

      </ScrollView>

      <View
        className="absolute bottom-0 w-full bg-white px-5 pt-4 pb-8 flex-row items-center justify-between"
        style={{
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          borderTopWidth: 1,
          borderTopColor: 'rgba(203, 213, 225, 0.4)'
        }}
      >
        <View>
          <Text className="text-on-surface-variant font-medium text-xs mb-0.5">{t('common.rentalRate')}</Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text className="font-extrabold text-on-surface text-2xl">{harvester.price}</Text>
            <Text className="text-on-surface-variant text-sm font-medium">{harvester.perUnit}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push(`/book/${id}` as any)}
          className="bg-secondary-container px-8 py-4 rounded-full flex-row items-center justify-center"
          style={{
            elevation: 4,
            shadowColor: '#fcab28',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8
          }}
        >
          <Text className="font-bold text-[#694300] text-[17px]">
            {t('common.bookNow')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
