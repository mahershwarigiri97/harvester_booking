import React from 'react';
import { View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

export function ListingSkeleton() {
  return (
    <View className="mb-6">
      <Skeleton isLoading={true}>
        <View className="bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-sm pb-2">
          <View className="h-64 w-full bg-gray-200" />
          <View className="p-6">
            <View className="flex-row justify-between items-start mb-2 gap-4">
              <View className="flex-1">
                <View className="h-7 w-3/4 bg-gray-200 rounded-lg mb-2" />
                <View className="h-4 w-1/2 bg-gray-200 rounded-md" />
              </View>
              <View className="h-8 w-20 bg-gray-200 rounded-lg" />
            </View>
            <View className="flex-row gap-2 mt-4">
              <View className="flex-1 h-14 bg-gray-200 rounded-2xl" />
              <View className="flex-[2] h-14 bg-gray-200 rounded-2xl" />
            </View>
          </View>
        </View>
      </Skeleton>
    </View>
  );
}

export function ListingSkeletonList() {
  return (
    <View className="pt-2">
      <ListingSkeleton />
      <ListingSkeleton />
      <ListingSkeleton />
    </View>
  );
}
