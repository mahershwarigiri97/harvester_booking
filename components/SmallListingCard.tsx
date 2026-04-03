import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ListingProps } from './ListingCard';

export function SmallListingCard({ id, name, distance, price, image }: ListingProps) {
  const router = useRouter();
  return (
    <View className="flex-row gap-4 bg-surface-container-low rounded-[32px] p-4 mb-4" style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 }}>
      <View className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0">
        <Image 
          source={{ uri: image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 justify-center py-2 pl-2 pr-1">
        <Text className="text-primary font-bold text-xs uppercase tracking-widest mb-1">New Arrival</Text>
        <Text className="text-lg font-headline font-bold text-on-surface" numberOfLines={2}>{name}</Text>
        <Text className="text-on-surface-variant text-sm mt-1" numberOfLines={1}>Efficient • {distance} away</Text>
        
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-lg font-black text-primary">{price}/hr</Text>
          <TouchableOpacity 
            onPress={() => router.push({ pathname: '/details/[id]', params: { id } })}
            className="w-10 h-10 bg-primary rounded-full items-center justify-center active:scale-90 shadow-sm"
          >
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
