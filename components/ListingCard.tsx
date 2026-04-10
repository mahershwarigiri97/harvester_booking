import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DistanceBadge } from './DistanceBadge';

export interface ListingProps {
  id: string;
  name: string;
  distance?: string; 
  price: string;
  rating: string;
  image: string;
  jobs?: string;
  lastJobDuration?: string;
  ownerLocation?: { current_latitude: number; current_longitude: number } | null;
  farmerLocation?: { latitude: number; longitude: number } | null;
}

export function ListingCard({
  id,
  name,
  distance: staticDistance,
  price,
  rating,
  image,
  jobs,
  lastJobDuration,
  ownerLocation,
  farmerLocation
}: ListingProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-sm mb-6 pb-2" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
      <View className="h-64 overflow-hidden relative">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="star" size={16} color="#835400" />
            <Text className="text-xs font-bold text-on-surface">{rating}</Text>
          </View>
          {jobs && (
            <>
              <View className="w-[1px] h-3 bg-outline/20" />
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="history" size={14} color="#0d631b" />
                <Text className="text-[10px] font-bold text-primary">{jobs} {t('common.jobs')}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View className="p-6">
        <View className="flex-row justify-between items-start mb-2 gap-4">
          <View className="flex-1">
            <Text className="text-xl font-headline font-bold text-on-surface" numberOfLines={1}>{name}</Text>
            <DistanceBadge 
              ownerLocation={ownerLocation} 
              farmerLocation={farmerLocation} 
              staticDistance={staticDistance} 
              className="flex-row items-center gap-1 mt-1"
            />
            {lastJobDuration && lastJobDuration !== 'N/A' && (
              <View className="flex-row items-center gap-1 mt-3 bg-secondary-container/30 self-start px-2 py-0.5 rounded-lg">
                <MaterialIcons name="history" size={14} color="#835400" />
                <Text className="text-[10px] font-bold text-on-secondary-container uppercase tracking-tight">{t('common.lastJob')}: {lastJobDuration}</Text>
              </View>
            )}
          </View>
          <View className="items-end shrink-0">
            <Text className="text-2xl font-headline font-black text-primary">{price}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-outline">{t('common.perHour')}</Text>
          </View>
        </View>

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/details/[id]', params: { id } })}
            className="flex-1 bg-primary-container py-4 rounded-2xl items-center justify-center active:scale-95"
          >
            <Text className="font-bold text-on-primary-container">{t('common.details')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/book/[id]', params: { id } } as any)}
            className="flex-[2] bg-secondary-container py-4 rounded-2xl items-center justify-center active:scale-95"
            style={{ elevation: 2, shadowColor: '#fcab28', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
          >
            <Text className="font-bold text-on-secondary-container text-lg">{t('common.bookNow')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
