import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from './SkeletonBox';

export function DetailsSkeleton() {
  return (
    <View className="flex-1 bg-background">
      {/* Hero image */}
      <SkeletonBox style={{ height: 280, width: '100%', borderRadius: 0 }} />

      <View className="px-5 mt-6 flex-1">
        {/* Status badge */}
        <SkeletonBox style={{ width: 120, height: 28, borderRadius: 14, marginBottom: 14 }} />
        {/* Title */}
        <SkeletonBox style={{ width: '80%', height: 30, marginBottom: 10 }} />
        {/* Subtitle */}
        <SkeletonBox style={{ width: '45%', height: 18, marginBottom: 28 }} />

        {/* Spec row */}
        <View className="flex-row gap-4 mb-6">
          <SkeletonBox style={{ flex: 1, height: 84, borderRadius: 20 }} />
          <SkeletonBox style={{ flex: 1, height: 84, borderRadius: 20 }} />
        </View>

        {/* Owner card */}
        <SkeletonBox style={{ width: '100%', height: 90, borderRadius: 24, marginBottom: 16 }} />

        {/* Map */}
        <SkeletonBox style={{ width: '100%', height: 160, borderRadius: 32 }} />
      </View>

      {/* Bottom bar */}
      <View className="absolute bottom-0 w-full bg-white px-5 py-5 flex-row items-center justify-between border-t border-outline/10">
        <View className="gap-2">
          <SkeletonBox style={{ width: 60, height: 12 }} />
          <SkeletonBox style={{ width: 100, height: 26 }} />
        </View>
        <SkeletonBox style={{ width: 140, height: 52, borderRadius: 28 }} />
      </View>
    </View>
  );
}
