import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// ─────────────────────────────────────────────────────
// Matches Stitch design:
// 1. Trust signal chips (rating + jobs) — flex-wrap row
// 2. Owner card — avatar (w-20 h-20, border-4 white), name, verified,
//    "Call Owner" full-width button below on mobile
// ─────────────────────────────────────────────────────

interface OwnerCardProps {
  name: string;
  experience: string;
  avatar?: string;
  rating?: string;
  jobs?: string;
}

export function OwnerCard({
  name,
  experience,
  avatar,
  rating = '4.6',
  jobs = '120+',
}: OwnerCardProps) {
  return (
    <View style={{ marginBottom: 32 }}>

      {/* ── Trust Signal Chips ── */}
      <View className="flex-row flex-wrap mb-5" style={{ gap: 10 }}>
        {/* Rating chip — secondary-fixed/30 + border secondary-fixed */}
        <View
          className="flex-row items-center px-4 py-2 rounded-full"
          style={{
            gap: 8,
            backgroundColor: 'rgba(255, 221, 181, 0.35)',
            borderWidth: 1,
            borderColor: '#ffddb5',
          }}
        >
          <MaterialIcons name="star" size={16} color="#835400" />
          <Text className="font-bold" style={{ color: '#643f00', fontSize: 13 }}>
            {rating} Rating
          </Text>
        </View>

        {/* Jobs chip — primary-fixed/30 + border primary-fixed */}
        <View
          className="flex-row items-center px-4 py-2 rounded-full"
          style={{
            gap: 8,
            backgroundColor: 'rgba(163, 246, 156, 0.30)',
            borderWidth: 1,
            borderColor: '#a3f69c',
          }}
        >
          <MaterialIcons name="person" size={16} color="#0d631b" />
          <Text className="font-bold" style={{ color: '#005312', fontSize: 13 }}>
            {jobs} Jobs Completed
          </Text>
        </View>
      </View>

      {/* ── Owner Card ── */}
      {/* On mobile: stacks vertically (col), matching the HTML's flex-col md:flex-row */}
      <View
        className="bg-surface-container-low p-7 rounded-3xl"
        style={{
          borderWidth: 1,
          borderColor: 'rgba(191, 202, 186, 0.30)',
          gap: 20,
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}
      >
        {/* Avatar + Info row */}
        <View className="flex-row items-center" style={{ gap: 20 }}>
          {/* w-20 h-20 rounded-full border-4 border-white shadow-md */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              borderWidth: 4,
              borderColor: '#ffffff',
              overflow: 'hidden',
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 5,
            }}
          >
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center bg-primary/10">
                <MaterialIcons name="person" size={36} color="#0d631b" />
              </View>
            )}
          </View>

          {/* Name + verified row */}
          <View style={{ gap: 3 }}>
            <Text
              className="font-bold text-primary uppercase tracking-widest"
              style={{ fontSize: 10 }}
            >
              Machine Owner
            </Text>
            <Text
              className="font-headline font-bold text-on-surface"
              style={{ fontSize: 20 }}
            >
              {name}
            </Text>
            <View className="flex-row items-center" style={{ gap: 5 }}>
              <MaterialIcons name="verified" size={15} color="#40493d" />
              <Text className="text-on-surface-variant" style={{ fontSize: 13 }}>
                {experience}+ years experience
              </Text>
            </View>
          </View>
        </View>

        {/* Call Owner — full-width on mobile (matches HTML flex-col) */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="flex-row items-center justify-center bg-primary rounded-2xl py-4"
          style={{
            gap: 10,
            elevation: 6,
            shadowColor: '#0d631b',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.28,
            shadowRadius: 10,
          }}
        >
          <MaterialIcons name="call" size={22} color="#ffffff" />
          <Text className="font-bold text-white text-base">Call Owner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
