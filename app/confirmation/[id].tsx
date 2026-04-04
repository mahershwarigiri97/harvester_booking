import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookingConfirmation() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(50)).current;

  // Always success — we only reach this screen after a successful booking
  const isSuccess = true;
  const bookingId = id || '—';

  useEffect(() => {
    async function playEffects() {
      try {
        if (isSuccess) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await Audio.Sound.createAsync(
            { uri: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3' },
            { shouldPlay: true }
          );
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          // Optional: error sound here if available
        }
      } catch (err) {
        console.warn('Could not play sound:', err);
      }
    }

    playEffects();

    Animated.parallel([
      Animated.spring(translateYValue, {
        toValue: 0,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, [scaleValue, opacityValue, translateYValue, isSuccess]);

  return (
    <View className="flex-1 bg-[#fafaf5]">
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {isSuccess && (
        <ConfettiCannon
          count={200}
          origin={{ x: Dimensions.get('window').width / 2, y: Dimensions.get('window').height }}
          explosionSpeed={1000}
          fallSpeed={3000}
          fadeOut={true}
        />
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingBottom: insets.bottom + 48 }}>
        <Animated.View
          className="w-full max-w-xl items-center"
          style={{
            opacity: opacityValue,
            transform: [
              { scale: scaleValue },
              { translateY: translateYValue }
            ]
          }}
        >
          {isSuccess ? (
            <>
              {/* Success Visual */}
              <View className="items-center mb-5">
                <View
                  className="w-24 h-24 bg-[#2e7d32] rounded-full items-center justify-center mb-6"
                  style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.04, shadowRadius: 24 }}
                >
                  <MaterialIcons name="check-circle" size={48} color="#cbffc2" />
                </View>
                <Text className="font-headline font-extrabold text-4xl text-[#0d631b] tracking-tight mb-3 text-center">
                  Booking Confirmed!
                </Text>
                <Text className="text-[#40493d] text-base leading-relaxed text-center mb-6 max-w-xs">
                  Your service has been successfully scheduled. The operator will contact you shortly.
                </Text>
                <View className="px-4 py-2 bg-[#eeeee9] rounded-full">
                  <Text className="text-[#1a1c19] font-semibold text-sm">Booking ID: #HB-{bookingId}</Text>
                </View>
              </View>

              {/* Primary Actions for Success */}
              <View className="w-full items-center z-50 pb-8 mt-4">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.replace('/(tabs)' as any)}
                  className="py-4 px-8 items-center bg-[#0d631b]/10 rounded-full"
                >
                  <Text className="text-[#0d631b] font-bold text-base">Back to Home</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Error Visual */}
              <View className="items-center mb-5">
                <View className="relative flex justify-center mb-6">
                  {/* Subtle blur background effect in react native could be a scaled circle or shadow, keeping it simple */}
                  <View
                    className="w-24 h-24 bg-[#ffdad6] rounded-full items-center justify-center"
                    style={{ elevation: 4, shadowColor: '#ba1a1a', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 24 }}
                  >
                    <MaterialIcons name="error" size={48} color="#ba1a1a" />
                  </View>
                </View>
                <Text className="font-headline font-extrabold text-4xl text-[#1a1c19] tracking-tight mb-3 text-center leading-tight">
                  Booking Failed
                </Text>
                <Text className="text-[#40493d] text-base leading-relaxed text-center mb-10 max-w-xs">
                  Something went wrong while processing your payment. Please try again or contact support if the issue persists.
                </Text>
              </View>

              {/* Primary Actions for Error */}
              <View className="w-full space-y-4 px-4">
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => router.back()} // Go back to booking form
                  className="w-full h-16 bg-[#0d631b] rounded-2xl flex-row items-center justify-center mb-4"
                  style={{ elevation: 4, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}
                >
                  <MaterialIcons name="refresh" size={24} color="#fff" />
                  <Text className="text-white font-bold text-lg ml-3">Try Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => { }}
                  className="w-full h-16 bg-[#e8e8e3] rounded-2xl flex-row items-center justify-center"
                >
                  <MaterialIcons name="support-agent" size={24} color="#1a1c19" />
                  <Text className="text-[#1a1c19] font-bold text-lg ml-3">Contact Support</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Contextual/Trust Footer */}
          <View className="mt-12 opacity-50">
            <Text className="text-xs font-semibold uppercase tracking-widest text-[#1a1c19] text-center">
              {isSuccess ? "Secure Agricultural Services" : `Support ID: KR-${bookingId}-XPL | Krishi Seva`}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
