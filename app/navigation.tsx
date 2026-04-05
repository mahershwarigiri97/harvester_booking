import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Animated, Dimensions, Image, PanResponder, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../utils/api';
import { ConfirmArrivedModal } from '../components/ConfirmArrivedModal';
import { Alert } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 30; 
const MINIMIZED_OFFSET = 300;

export default function DriverNavigation() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: bookingResponse, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const res = await authApi.getBookingById(bookingId);
      return res.data;
    },
    enabled: !!bookingId,
  });

  const booking = bookingResponse?.data;

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

  return (
    <View className="flex-1 bg-surface relative overflow-hidden">
      <StatusBar style="dark" backgroundColor="#fafaf5" />

      {/* Background Map Imagery */}
      <View className="absolute inset-0 z-0">
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe6xa8JQBN0zHDKLZzzdnp_VO7cVPQddnEYitI5ruz_pSD2amCpl1rAKwqPM9WLto6-a3UDLOWiZE3rK2HgLdxlwCEyos8OLTcAPkOjxpESPFvoFcfpYaixeaJ6iUXFu7QozLEHX2Cl9Ayvp9TtttrNR3rykSuEZpr_vzEDAtNoUrKusteH2ASYedWs05qkFOKaGBsRvs5d1oGaBYuQRCdWIeGzeQCZHlTbaUo6FpubJQh3YQZkf9oIQn3_0hvgniS3rb3FnmQv3RJ' }}
          className="w-full h-full object-cover"
          style={{ opacity: 0.9 }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent', 'transparent', 'rgba(26,28,25,0.6)']}
          locations={[0, 0.2, 0.7, 1]}
          className="absolute inset-0"
        />
        <View className="absolute inset-0">
          <Svg height="100%" width="100%" viewBox="0 0 400 800" className="opacity-90">
            <Path
              d="M 100 700 Q 150 500, 250 450 T 320 200"
              fill="none" stroke={navigationStarted ? "#0d631b" : "#fcab28"} strokeLinecap="round" strokeOpacity="0.4" strokeWidth="16"
            />
            <Path
              d="M 100 700 Q 150 500, 250 450 T 320 200"
              fill="none" stroke={navigationStarted ? "#0d631b" : "#fcab28"} strokeDasharray="1 15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"
            />
          </Svg>
        </View>

        {/* Map Markers */}
        <View className="absolute bottom-[20%] left-[20%] z-10">
          <View className="items-center justify-center relative">
            <View className="absolute w-12 h-12 bg-primary/20 rounded-full" style={{ transform: [{ scale: 1.5 }] }} />
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center border-2 border-white shadow-lg">
              <MaterialIcons name="agriculture" size={20} color="white" />
            </View>
          </View>
        </View>

        <View className="absolute top-[25%] right-[15%] z-10">
          <View className="items-center">
            <View className="bg-surface-container-lowest px-3 py-1 rounded-lg border border-outline-variant/20 shadow-md mb-1">
              <Text className="text-xs font-bold text-on-surface">Farmer's Field</Text>
            </View>
            <MaterialIcons name="location-on" size={40} color="#ba1a1a" />
          </View>
        </View>
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
            {arrivedMutation.isPending ? 'Updating...' : (navigationStarted ? 'Arrived' : 'Start Navigation')}
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
