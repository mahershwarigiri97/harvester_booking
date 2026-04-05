import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Animated, Easing, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../utils/api';
import { Alert } from 'react-native';
import SuccessModal from './SuccessModal';

interface BookingRequestPopupProps {
  visible: boolean;
  onClose: () => void;
  booking: any;
}

export default function BookingRequestPopup({ visible, onClose, booking }: BookingRequestPopupProps) {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState(15);
  const [showSuccess, setShowSuccess] = useState(false);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setTimeLeft(15);
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        // Auto close when time is up
        onClose();
      });

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible, onClose]);

  const statusMutation = useMutation({
    mutationFn: (status: 'accepted' | 'cancelled') => 
      authApi.updateBookingStatus(booking?.id, status, undefined, status === 'cancelled' ? 'Owner rejected mapping' : undefined, 'owner'),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['harvesters'] });
      
      if (status === 'accepted') {
        setShowSuccess(true);
      } else {
        onClose();
      }
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update booking. Please check your connection.');
    }
  });

  if (!booking && visible) return null;

  // The Ring has r=24 on a 56x56 view (cx=28 cy=28). Circumference = 2 * PI * 24 = ~150.796
  const circumference = 2 * Math.PI * 24;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference] // Animates from full to completely drained
  });

  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="slide" 
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(26,28,25,0.4)' }}>
        <View 
          className="bg-surface w-full overflow-hidden"
          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.12,
            shadowRadius: 40,
            elevation: 20,
            maxHeight: 795,
          }}
        >
          {/* Header & Timer Section */}
          <View className="p-6 bg-primary-container flex-row justify-between items-center overflow-hidden">
            <View className="z-10">
              <Text className="font-headline font-bold text-lg text-on-primary-container leading-tight">Incoming Request</Text>
              <Text className="text-xs font-medium mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Respond immediately to secure the booking</Text>
            </View>
            <View className="z-10 items-center justify-center relative w-14 h-14 bg-white/20 rounded-full">
              <View className="absolute inset-0" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Svg width="56" height="56" viewBox="0 0 56 56">
                  <Circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.3)" strokeWidth="4" fill="transparent" />
                  <AnimatedCircle 
                    cx="28" cy="28" r="24" 
                    stroke="#fcab28" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
              <Text className="font-headline font-extrabold text-xl text-on-primary-container">{timeLeft}s</Text>
            </View>
            
            {/* Decorative background circle */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          </View>

          {/* Details Content */}
          <View className="p-6 space-y-6">
            {/* Farmer & Crop Bento Header */}
            <View className="flex-row gap-4 w-full">
              <View className="flex-1 bg-surface-container-low p-4 rounded-3xl flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center">
                  <MaterialIcons name="person" size={24} color="#002204" />
                </View>
                <View className="flex-shrink">
                  <Text className="text-xs text-on-surface-variant font-medium">Farmer</Text>
                  <Text className="font-headline font-bold text-on-surface" numberOfLines={1}>
                    {booking?.farmer?.name || booking?.customer_name || 'Farmer'}
                  </Text>
                </View>
              </View>
              <View className="flex-1 bg-surface-container-low p-4 rounded-3xl flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center">
                  <MaterialIcons name="grass" size={24} color="#2a1800" />
                </View>
                <View className="flex-shrink">
                  <Text className="text-xs text-on-surface-variant font-medium">Crop Type</Text>
                  <Text className="font-headline font-bold text-on-surface" numberOfLines={1}>
                    {booking?.crop_type || 'General'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Map & Location Section */}
            <View className="mt-6 mb-2">
              <View className="flex-row items-center gap-2 mb-3 px-2">
                <MaterialIcons name="location-on" size={24} color="#0d631b" />
                <Text className="font-headline font-bold text-on-surface text-lg">
                  {booking?.full_address?.village || booking?.full_address?.district || 'Location Details'}
                </Text>
              </View>
              <View className="h-48 w-full rounded-[32px] overflow-hidden bg-surface-container-highest relative">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPgNCpXRR8lVkBxz2VkjJ7oCxyB9z2JMiSlia_aM9gYErH9Fnd5FVFE_zZoOgD5BJzbqdHzwXKztEkn1JqK9lkP3flHQjOnqFdsh_vxMmts98Fk3eQ0aC47OzFIhfkMAEF5jgdpjXMN8o06DHRu07ibW_Oiflre8YOSvJXJ2DnACXKWnE7xmASecsgeOG19lvKvlj7uXvZej_fDXY0Y3VyIfoMSb82KSQZddbYHWBxqojePCnAZlFsJDv5-btqnAiCdVdt74B4hL2b' }}
                  className="w-full h-full opacity-80"
                />
                <LinearGradient 
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} 
                  className="absolute inset-0" 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 0, y: 1 }} 
                />
                <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <View 
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center" 
                    style={{ elevation: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                  >
                    <MaterialIcons name="agriculture" size={20} color="white" />
                  </View>
                  <View className="absolute -bottom-2 w-4 h-1 bg-black/40 rounded-full" />
                </View>
              </View>
            </View>

            {/* Financials & Duration Bento */}
            <View className="flex-row gap-4 w-full mt-4">
              <View className="flex-1 bg-surface-container-low p-5 rounded-[32px]">
                <Text className="text-xs text-on-surface-variant font-medium mb-1">Total land Area</Text>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="map" size={22} color="#0d631b" />
                  <Text className="font-headline font-extrabold text-xl text-on-surface">{booking?.land_area} Ac</Text>
                </View>
              </View>
              <View className="flex-1 bg-secondary-container/10 border-[2px] p-5 rounded-[32px]" style={{ borderColor: 'rgba(252, 171, 40, 0.2)' }}>
                <Text className="text-xs font-medium mb-1" style={{ color: '#694300' }}>Total Earning</Text>
                <Text className="font-headline font-extrabold text-2xl mt-1" style={{ color: '#694300' }}>₹{booking?.price?.toLocaleString() || '0'}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="p-6 bg-surface-container-low flex-row gap-4 border-t" style={{ borderColor: 'rgba(191,202,186,0.1)' }}>
            <TouchableOpacity 
              onPress={() => statusMutation.mutate('cancelled')}
              disabled={statusMutation.isPending}
              className="flex-1 h-16 rounded-3xl bg-surface-container-highest flex-row items-center justify-center gap-2 active:scale-95"
            >
              <MaterialIcons name="close" size={24} color="#1a1c19" />
              <Text className="font-headline font-bold text-on-surface text-lg">Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => statusMutation.mutate('accepted')}
              disabled={statusMutation.isPending}
              className="flex-1 h-16 rounded-3xl flex-row items-center justify-center gap-2 active:scale-95"
              style={{ elevation: 8, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 }}
            >
              <View className="absolute inset-0 rounded-3xl overflow-hidden">
                <LinearGradient colors={['#0d631b', '#2e7d32']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full h-full" />
              </View>
              {statusMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="check-circle" size={24} color="white" />
                  <Text className="font-headline font-extrabold text-white text-lg ml-1">Accept</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <SuccessModal 
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        title="Accepted!"
        message={`You've successfully accepted ${booking?.farmer?.name || booking?.customer_name}'s request.`}
        buttonLabel="Go to Dashboard"
      />
    </Modal>
  );
}
