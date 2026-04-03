import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Stitch-sourced map image
const MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCD7eh1-U4YysxDircGjINv8Q07emPHj-Ch3TYgnE72Pakw-TfLSIR4Nx66hqLxhjDwIdGVKHrLU2CSB5Iq1Q9Cxva1XGofIy5i2D_W8Tc574X9KW8mdU1C-RML7pGmqfkCr_IPg6SfiSPbGXEsNZqYSd3MxqjFeozZe5Q7j-4qPey_iJ9p40JTO6i8UutDg43avR2MNSFg62Qnsl_rHW8IpgCL436VHZPGKMPm_rq_usTX4uPdhh-4O6hMHdybriE5j8zy_1bStOvN';

// ─────────────────────────────────────────────────────
export function HarvesterMap({ distance = '2.5 km' }: { distance?: string }) {
  return (
    <View style={{ marginBottom: 32 }}>

      {/* ── Section Header ── */}
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <MaterialIcons name="location-on" size={24} color="#0d631b" />
          <Text
            className="font-headline font-bold text-primary"
            style={{ fontSize: 20 }}
          >
            Location
          </Text>
        </View>
        {/* "2.5 km away" badge */}
        <View className="bg-surface-container-highest px-3 py-1 rounded-lg">
          <Text className="font-bold text-on-surface-variant text-sm">{distance} away</Text>
        </View>
      </View>

      {/* ── Map Image (rounded-3xl, h-300, gradient + button overlay) ── */}
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          height: 240,
          backgroundColor: '#e3e3de',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        }}
      >
        <Image
          source={{ uri: MAP_IMAGE }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Subtle overlay */}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
          pointerEvents="none"
        />

        {/* "View on Map" button — absolute bottom-right */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="absolute bottom-5 right-5 flex-row items-center bg-white px-5 py-3 rounded-xl"
          style={{
            gap: 8,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
          }}
        >
          <MaterialIcons name="map" size={18} color="#0d631b" />
          <Text className="font-bold text-primary text-sm">View on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
