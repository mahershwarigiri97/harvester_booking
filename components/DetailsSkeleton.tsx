import React from 'react';
import { View, ScrollView } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

export function DetailsSkeleton() {
  return (
    <View className="flex-1 bg-background">
      <Skeleton isLoading={true}>
        <ScrollView className="flex-1 px-4 mt-16" showsVerticalScrollIndicator={false}>
          {/* Hero Area */}
          <View className="h-64 rounded-3xl bg-gray-200 mb-6" />
          
          <View className="px-1 space-y-4 mb-8">
            {/* Status Badge */}
            <View className="w-32 h-7 rounded-full bg-gray-200 mb-4" />
            
            {/* Title */}
            <View className="w-3/4 h-8 bg-gray-200 rounded-lg mb-2" />
            
            {/* Subtitle */}
            <View className="w-1/2 h-4 bg-gray-200 rounded-md" />
          </View>

          {/* Grid Blocks */}
          <View className="flex-row gap-4 px-1 mb-8">
            <View className="flex-1 h-20 bg-gray-200 rounded-2xl" />
            <View className="flex-1 h-20 bg-gray-200 rounded-2xl" />
          </View>

          {/* Large Area / Specs */}
          <View className="h-24 w-full bg-gray-200 rounded-[24px] mb-8" />
          
          {/* Map Area */}
          <View className="h-44 w-full bg-gray-200 rounded-[32px] mb-8" />
        </ScrollView>

        <View className="absolute bottom-0 w-full bg-white px-5 py-6 flex-row items-center justify-between border-t border-outline/10 h-24">
          <View>
            <View className="w-16 h-3 bg-gray-200 rounded mb-2" />
            <View className="w-24 h-7 bg-gray-200 rounded" />
          </View>
          <View className="w-36 h-14 bg-gray-200 rounded-full" />
        </View>
      </Skeleton>
    </View>
  );
}
