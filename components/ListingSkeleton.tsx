import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';

export function ListingSkeleton() {
  return (
    <View className="mb-6">
      <View className="bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-sm pb-2" style={{ elevation: 2 }}>
        {/* Hero image */}
        <SkeletonBox style={{ height: 256, width: '100%', borderRadius: 0 }} />
        <View className="p-6">
          <View className="flex-row justify-between items-start mb-2 gap-4">
            <View className="flex-1">
              <SkeletonBox style={{ height: 24, width: '70%', marginBottom: 8 }} />
              <SkeletonBox style={{ height: 16, width: '45%' }} />
            </View>
            <SkeletonBox style={{ height: 32, width: 80 }} />
          </View>
          <View className="flex-row gap-2 mt-4">
            <SkeletonBox style={{ flex: 1, height: 52, borderRadius: 16 }} />
            <SkeletonBox style={{ flex: 2, height: 52, borderRadius: 16 }} />
          </View>
        </View>
      </View>
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
