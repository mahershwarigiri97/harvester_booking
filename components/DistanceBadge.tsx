import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { calculateDistance } from '../utils/locationUtils';

interface DistanceBadgeProps {
  ownerLocation?: { current_latitude: number; current_longitude: number } | null;
  farmerLocation?: { latitude: number; longitude: number } | null;
  staticDistance?: string;
  className?: string;
  iconSize?: number;
  textSize?: string;
  color?: string;
}

export const DistanceBadge = ({ 
  ownerLocation, 
  farmerLocation, 
  staticDistance,
  className = "flex-row items-center gap-1",
  iconSize = 16,
  textSize = "text-sm",
  color = "#40493d"
}: DistanceBadgeProps) => {
  const distance = React.useMemo(() => {
    if (farmerLocation?.latitude && ownerLocation?.current_latitude) {
      const d = calculateDistance(
        farmerLocation.latitude,
        farmerLocation.longitude,
        ownerLocation.current_latitude,
        ownerLocation.current_longitude
      );
      return `${d} km`;
    }
    return staticDistance || 'Distance unknown';
  }, [farmerLocation, ownerLocation, staticDistance]);

  return (
    <View className={className} style={{ gap: 4 }}>
      <MaterialIcons name="location-on" size={iconSize} color={color} />
      <Text className={`text-on-surface-variant ${textSize}`}>{distance} away</Text>
    </View>
  );
};
