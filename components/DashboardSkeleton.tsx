import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SkeletonBox } from './SkeletonBox';

export function DashboardSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {/* Top bar */}
      <View className="flex-row items-center px-6 py-4 gap-3 border-b border-outline/10">
        <SkeletonBox style={{ width: 40, height: 40, borderRadius: 20 }} />
        <View className="flex-1 gap-2">
          <SkeletonBox style={{ width: 120, height: 18 }} />
          <SkeletonBox style={{ width: 80, height: 13 }} />
        </View>
      </View>

      <View className="px-6 pt-8 flex-1">
        {/* Name + switch */}
        <View className="flex-row justify-between items-center mb-8">
          <View className="gap-2">
            <SkeletonBox style={{ width: 160, height: 32 }} />
            <SkeletonBox style={{ width: 80, height: 20 }} />
          </View>
          <SkeletonBox style={{ width: 44, height: 24, borderRadius: 12 }} />
        </View>

        {/* Big earnings card */}
        <SkeletonBox style={{ width: '100%', height: 148, borderRadius: 24, marginBottom: 16 }} />

        {/* Two small cards */}
        <View className="flex-row gap-4 mb-10">
          <SkeletonBox style={{ flex: 1, height: 120, borderRadius: 24 }} />
          <SkeletonBox style={{ flex: 1, height: 120, borderRadius: 24 }} />
        </View>

        {/* Section title */}
        <SkeletonBox style={{ width: 200, height: 24, marginBottom: 20 }} />

        {/* Booking request cards */}
        <SkeletonBox style={{ width: '100%', height: 160, borderRadius: 32, marginBottom: 16 }} />
        <SkeletonBox style={{ width: '100%', height: 160, borderRadius: 32 }} />
      </View>
    </View>
  );
}
