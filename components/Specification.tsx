import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SpecificationProps {
  workSpeed: string;
  estimatedTime: string;
  isAvailable: boolean;
  distance: string;
}

export function Specification({ workSpeed, estimatedTime, isAvailable, distance }: SpecificationProps) {
  return (
    <View style={{ marginBottom: 32, gap: 20 }}>

      {/* ── Operational Stats ── */}
      <View className="flex-col" style={{ gap: 12 }}>

        {/* Work Speed — border-l primary */}
        <View
          className="bg-surface-container-low p-6 rounded-2xl"
          style={{ borderLeftWidth: 4, borderLeftColor: '#0d631b' }}
        >
          <View className="flex-row items-center mb-2" style={{ gap: 10 }}>
            <MaterialIcons name="eco" size={22} color="#0d631b" />
            <Text className="font-bold text-on-surface text-base">Work Speed</Text>
          </View>
          <Text className="font-black text-on-surface" style={{ fontSize: 22 }}>
            {workSpeed}
          </Text>
        </View>

        {/* Estimated Time — border-l secondary */}
        <View
          className="bg-surface-container-low p-6 rounded-2xl"
          style={{ borderLeftWidth: 4, borderLeftColor: '#835400' }}
        >
          <View className="flex-row items-center mb-2" style={{ gap: 10 }}>
            <MaterialIcons name="timer" size={22} color="#835400" />
            <Text className="font-bold text-on-surface text-base">Estimated Time</Text>
          </View>
          <Text className="font-medium text-on-surface-variant text-base">
            Your work will finish in{' '}
            <Text className="font-bold text-on-surface">{estimatedTime}</Text>
          </Text>
        </View>
      </View>

      {/* ── Availability Status (full-width) ── */}
      <View style={{ gap: 14 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <MaterialIcons name="event-available" size={20} color="#0d631b" />
          <Text className="font-bold text-primary text-base">Availability Status</Text>
        </View>
        <View className="bg-surface-container-low p-5 rounded-2xl flex-row" style={{ gap: 24 }}>
          {/* Available Today */}
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <MaterialIcons name="check-circle" size={20} color={isAvailable ? '#0d631b' : '#ba1a1a'} />
            <Text className="font-bold text-on-surface">
              {isAvailable ? 'Available Today' : 'Not Available Today'}
            </Text>
          </View>
          {/* Next Available */}
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <MaterialIcons name="hourglass-empty" size={20} color="#835400" />
            <Text className="font-medium text-on-surface-variant text-sm">
              Next:{' '}
              <Text className="font-bold text-on-surface">Tomorrow 9 AM</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
