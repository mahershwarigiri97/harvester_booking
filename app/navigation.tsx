import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Animated, Dimensions, PanResponder, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authApi } from '../utils/api';
import { ConfirmArrivedModal } from '../components/ConfirmArrivedModal';
import { Alert } from 'react-native';
import { NavigationMapView } from '../components/NavigationMapView';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { socketService } from '../utils/socket';

const SWIPE_THRESHOLD = 30; 
const MINIMIZED_OFFSET = 300;

export default function DriverNavigation() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { currentLocation } = useCurrentLocation(true);

  React.useEffect(() => {
    if (bookingId && currentLocation?.coords) {
      socketService.updateLocation(
        Number(bookingId),
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        currentLocation.coords.heading
      );
    }
  }, [currentLocation?.coords.latitude, currentLocation?.coords.longitude, currentLocation?.coords.heading, bookingId]);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const res = await authApi.getBookingById(bookingId);
      return res.data.data;
    },
    enabled: !!bookingId,
  });

  const translateY = React.useRef(new Animated.Value(600)).current;
  const lastOffset = React.useRef(0);

  React.useEffect(() => {
    if (booking?.status === 'on_the_way') {
      setNavigationStarted(true);
    }
  }, [booking?.status]);

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      damping: 20,
      stiffness: 90,
      useNativeDriver: true,
    }).start();
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false, 
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 3;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = lastOffset.current + gestureState.dy;
        if (newY < 0) {
          translateY.setValue(newY * 0.15); 
        } else if (newY > MINIMIZED_OFFSET + 40) {
          translateY.setValue(MINIMIZED_OFFSET + 40 + (newY - (MINIMIZED_OFFSET + 40)) * 0.15);
        } else {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const finalPosition = lastOffset.current + gestureState.dy;
        const velocity = gestureState.vy;

        if (velocity > 0.3 || (velocity > -0.3 && finalPosition > MINIMIZED_OFFSET / 2)) {
          Animated.spring(translateY, {
            toValue: MINIMIZED_OFFSET,
            damping: 24,
            velocity: velocity,
            stiffness: 100,
            useNativeDriver: true,
          }).start(() => { lastOffset.current = MINIMIZED_OFFSET; });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            damping: 24,
            velocity: velocity,
            stiffness: 100,
            useNativeDriver: true,
          }).start(() => { lastOffset.current = 0; });
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: lastOffset.current,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const ctaTranslateY = translateY.interpolate({
    inputRange: [0, MINIMIZED_OFFSET],
    outputRange: [0, -200], 
    extrapolate: 'clamp',
  });

  const infoTranslateY = translateY.interpolate({
    inputRange: [0, MINIMIZED_OFFSET],
    outputRange: [0, 80],
    extrapolate: 'clamp',
  });

  const infoOpacity = translateY.interpolate({
    inputRange: [0, MINIMIZED_OFFSET * 0.45],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const arrivedMutation = useMutation({
    mutationFn: () => authApi.updateBookingStatus(bookingId as string, 'arrived', 'Harvester has reached the location'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      router.push({
        pathname: '/work_tracker',
        params: { bookingId }
      });
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update arrival status. Please try again.');
    }
  });

  const onCtaPress = () => {
    if (!navigationStarted) {
      setNavigationStarted(true);
    } else {
      setIsConfirmModalVisible(true);
    }
  };

  const farmAddress = booking?.full_address || { latitude: booking?.farm_latitude, longitude: booking?.farm_longitude };

  return (
    <View className="flex-1 bg-surface relative overflow-hidden">
      <StatusBar style="dark" backgroundColor="#fafaf5" />

      {/* Background Map */}
      <View className="absolute inset-0 z-0">
        <NavigationMapView
          navigationStarted={navigationStarted}
          farmerCoords={farmAddress.latitude ? { latitude: Number(farmAddress.latitude), longitude: Number(farmAddress.longitude) } : undefined}
          ownerCoords={currentLocation?.coords ? { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude } : undefined}
          ownerHeading={currentLocation?.coords ? currentLocation.coords.heading : 0}
        />
      </View>

      {/* Side Map Controls */}
      <View className="absolute right-6 top-1/3 z-40 flex-col gap-4">
        <TouchableOpacity className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center active:scale-90 shadow-lg" style={{ elevation: 5 }}>
          <MaterialIcons name="add" size={24} color="#1a1c19" />
        </TouchableOpacity>
        <TouchableOpacity className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center active:scale-90 shadow-lg" style={{ elevation: 5 }}>
          <MaterialIcons name="remove" size={24} color="#1a1c19" />
        </TouchableOpacity>
        <TouchableOpacity className="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center active:scale-90 shadow-lg mt-2" style={{ elevation: 5 }}>
          <MaterialIcons name="my-location" size={24} color="#0d631b" />
        </TouchableOpacity>
      </View>

      {/* Exit Button */}
      <View style={{ paddingTop: insets.top + 16, paddingLeft: 24 }} className="absolute top-0 left-0 z-50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a1c19" />
        </TouchableOpacity>
      </View>

      {/* Floating CTA Button (Bottom Right) */}
      <View style={{ position: 'absolute', bottom: insets.bottom + 24, right: 24, zIndex: 100 }}>
        <TouchableOpacity
          onPress={onCtaPress}
          activeOpacity={0.88}
          className="h-16 px-8 rounded-3xl flex-row items-center justify-center gap-3 active:scale-95 duration-200"
          style={{
            minWidth: 180,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 15,
          }}
        >
          <View className="absolute inset-0 rounded-3xl overflow-hidden">
            <LinearGradient
              colors={navigationStarted ? ['#835400', '#fcab28'] : ['#0d631b', '#2e7d32']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              className="w-full h-full"
            />
          </View>
          <MaterialIcons 
            name={navigationStarted ? "check-circle" : "navigation"} 
            size={24} 
            color="white" 
          />
          <Text className="text-white font-headline font-bold text-lg uppercase tracking-tight">
            {arrivedMutation.isPending ? t('common.updating') : (navigationStarted ? t('owner.confirmArrival') : t('owner.startNavigation'))}
          </Text>
        </TouchableOpacity>
      </View>

      <ConfirmArrivedModal
        visible={isConfirmModalVisible}
        onClose={() => setIsConfirmModalVisible(false)}
        onConfirm={() => {
          setIsConfirmModalVisible(false);
          arrivedMutation.mutate();
        }}
        isLoading={arrivedMutation.isPending}
      />
    </View>
  );
}
