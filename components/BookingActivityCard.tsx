import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../utils/api';
import { calculateDistance } from '../utils/locationUtils';

interface BookingActivityCardProps {
  booking: any;
  ownerLocation?: { latitude: number; longitude: number } | null;
  onViewRequest: (booking: any) => void;
  onNavigateToNavigation: (id: number) => void;
  onNavigateToTracker: (id: number) => void;
}

export default function BookingActivityCard({
  booking,
  ownerLocation,
  onViewRequest,
  onNavigateToNavigation,
  onNavigateToTracker
}: BookingActivityCardProps) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (status: any) => authApi.updateBookingStatus(booking.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['booking', String(booking.id)] });
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update status. Please try again.');
    },
  });

  const distance = React.useMemo(() => {
    const lat = booking.full_address?.latitude || booking.farm_latitude;
    const lon = booking.full_address?.longitude || booking.farm_longitude;
    if (!ownerLocation || !lat || !lon) return null;
    return calculateDistance(ownerLocation.latitude, ownerLocation.longitude, lat, lon);
  }, [ownerLocation, booking.farm_latitude, booking.farm_longitude, booking.full_address]);

  if (!booking || !booking.status) return null;

  return (
    <View
      className="bg-surface-container-lowest p-5 rounded-[32px] overflow-hidden"
      style={{
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.04,
        shadowRadius: 32,
      }}
    >
      {/* Decorative background element */}
      <View className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-12 -mt-12" />

      <View className="flex-col gap-4 z-10 w-full mb-6">
        <View className="flex-row items-center gap-4 w-full">
          <View className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-primary/10 items-center justify-center">
            {booking.farmer?.avatar ? (
              <Image source={{ uri: booking.farmer.avatar }} className="w-full h-full" />
            ) : (
              <MaterialIcons name="person" size={24} color="#0d631b" />
            )}
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg text-on-surface" numberOfLines={1}>
              {booking.farmer?.name || booking.customer_name || 'Farmer'}
            </Text>
            <View className="flex-col gap-0.5 mt-1">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="eco" size={14} color="#40493d" />
                <Text className="text-sm font-medium text-on-surface-variant">
                  {booking.crop_type || 'General'} • {booking.land_area} Ac
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="location-on" size={14} color="#0d631b" />
                <Text className="text-primary text-[11px] font-bold uppercase tracking-tight">
                  {(() => {
                    const block = booking.full_address?.village || booking.full_address?.district || booking.address;
                    
                    let distStr = '';
                    if (distance !== null && distance >= 0) {
                      distStr = ` • ${distance} km`;
                    }
                    
                    if (block) return `${block}${distStr}`;
                    if (distStr) return `${distStr.replace(' • ', '')} away`;
                    return 'View Location';
                  })()}
                </Text>
              </View>
            </View>
          </View>
          <View className="bg-primary/10 px-3 py-1 rounded-full">
            <Text className="text-primary text-[10px] font-bold uppercase">
              {(booking.status || 'active').replace(/_/g, ' ')}
            </Text>
          </View>
        </View>

        <View className="flex-col items-end self-end w-full">
          <Text className="text-2xl font-headline font-black text-primary">
            ₹{booking.price?.toLocaleString() || '0'}
          </Text>
          <Text className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-tighter">Est. Payout</Text>
        </View>
      </View>

      {booking.status === 'requested' ? (
        <TouchableOpacity
          onPress={() => onViewRequest(booking)}
          style={{ backgroundColor: '#e9f5ea', borderColor: 'rgba(13, 99, 27, 0.15)', borderWidth: 1, borderRadius: 16 }}
          className="w-full py-4 items-center justify-center active:scale-95"
        >
          <Text className="font-bold text-primary">View Job Request</Text>
        </TouchableOpacity>
      ) : booking.status === 'accepted' ? (
        <TouchableOpacity
          onPress={() => statusMutation.mutate('on_the_way')}
          disabled={statusMutation.isPending}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#0d631b', '#2e7d32']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, elevation: 4, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            className="w-full py-4 items-center justify-center flex-row gap-2"
          >
            {statusMutation.isPending ? <ActivityIndicator color="white" /> : (
              <>
                <MaterialIcons name="navigation" size={20} color="white" />
                <Text className="text-white font-bold uppercase tracking-tight">Start Navigation</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ) : booking.status === 'on_the_way' ? (
        <TouchableOpacity
          onPress={() => statusMutation.mutate('arrived')}
          disabled={statusMutation.isPending}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#835400', '#fcab28']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, elevation: 4, shadowColor: '#835400', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            className="w-full py-4 items-center justify-center flex-row gap-2"
          >
            {statusMutation.isPending ? <ActivityIndicator color="white" /> : (
              <>
                <MaterialIcons name="check-circle" size={20} color="white" />
                <Text className="text-white font-bold uppercase tracking-tight">Confirm Arrival</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ) : booking.status === 'arrived' ? (
        <TouchableOpacity
          onPress={() => onNavigateToTracker(booking.id)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#835400', '#fcab28']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, elevation: 4, shadowColor: '#835400', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            className="w-full py-4 items-center justify-center flex-row gap-2"
          >
            <MaterialIcons name="precision-manufacturing" size={20} color="white" />
            <Text className="text-white font-bold uppercase tracking-tight">Start Harvesting</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => onNavigateToTracker(booking.id)}
          style={{ backgroundColor: '#0d631b', borderRadius: 16 }}
          className="w-full py-4 items-center justify-center active:scale-95 flex-row gap-2 shadow-md"
        >
          <MaterialIcons name="timer" size={20} color="white" />
          <Text className="font-bold text-white uppercase tracking-tight">Monitor Work Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
