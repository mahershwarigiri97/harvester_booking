import React from 'react';
import { View, ScrollView } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

export function DashboardSkeleton() {
  return (
    <View className="flex-1 bg-surface">
      <Skeleton isLoading={true}>
        <View className="px-6 py-10">
          {/* Header area */}
          <View className="flex-row items-center gap-3 mb-10 w-full">
            <View className="w-10 h-10 rounded-full bg-gray-200" />
            <View className="flex-1">
              <View className="h-5 w-32 bg-gray-200 rounded mb-1" />
              <View className="h-4 w-24 bg-gray-200 rounded" />
            </View>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title & Switch area */}
            <View className="flex-row justify-between items-center mb-8">
              <View className="h-9 w-40 bg-gray-200 rounded" />
              <View className="w-12 h-6 bg-gray-200 rounded-full" />
            </View>

            {/* Main Stats Card */}
            <View className="w-full h-40 bg-gray-200 rounded-[32px] mb-8" />

            {/* Small Stats Row */}
            <View className="flex-row gap-4 mb-10">
              <View className="flex-1 h-32 bg-gray-200 rounded-3xl" />
              <View className="flex-1 h-32 bg-gray-200 rounded-3xl" />
            </View>

            <View className="h-6 w-56 bg-gray-200 rounded mb-6" />

            <View className="h-44 w-full bg-gray-200 rounded-[32px] mb-4" />
            <View className="h-44 w-full bg-gray-200 rounded-[32px]" />
          </ScrollView>
        </View>
      </Skeleton>
    </View>
  );
}
