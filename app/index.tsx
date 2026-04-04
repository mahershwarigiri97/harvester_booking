import { Image, View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../utils/authStore';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    
    const timer = setTimeout(() => {
      const { isAuthenticated, user } = useAuthStore.getState();
      
      if (isAuthenticated && user) {
        if (user.role === 'owner') {
          router.replace(user.is_profile_complete ? '/(owner)' : '/owner-registration');
        } else {
          router.replace('/(farmer)');
        }
      } else {
        router.replace('/login');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, progressAnim]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View className="flex-1 bg-background" style={{ width: '100%', height: '100%' }}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Full-Screen Background Image */}
      <Image
        source={require('../assets/images/splash-bg.jpg')}
        style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%' }]}
        resizeMode="cover"
      />

      {/* Overlays for Depth and Contrast as siblings */}
      <LinearGradient
        colors={['rgba(26,28,25,0.4)', 'rgba(26,28,25,0.1)', 'transparent']}
        style={StyleSheet.absoluteFillObject}
        className="z-10"
      />
      <LinearGradient
        colors={['transparent', 'rgba(26,28,25,0.2)', 'rgba(26,28,25,0.6)']}
        style={StyleSheet.absoluteFillObject}
        className="z-10"
      />
      <View style={StyleSheet.absoluteFillObject} className="bg-[#0d631b]/20 z-10" />

      {/* Rest of the UI Content */}
      <View className="flex-1 items-center justify-center p-6 relative z-20" style={{ width: '100%' }}>
        {/* Tactile Icon Shell - Solid White */}
        <View 
          className="mb-8 p-8 rounded-[40px] shadow-lg bg-white items-center justify-center"
          style={{ shadowColor: '#0d631b', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.12, shadowRadius: 48, elevation: 15 }}
        >
          <MaterialIcons name="agriculture" size={80} color="#0d631b" />
        </View>

        {/* Typography Anchor */}
        <View className="space-y-4 items-center w-full">
          <Text 
            className="font-headline font-extrabold text-[#ffffff] text-6xl text-center tracking-tighter" 
            style={{ textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 6 }}
          >
            Harvester Hub
          </Text>
          
          <View className="flex-row items-center justify-center mt-2 w-full max-w-[400px]">
            <View className="h-[1px] flex-1 bg-[#fcab28] opacity-60" />
            <Text className="font-body font-semibold text-lg md:text-xl text-center text-[#fafaf5] tracking-wide uppercase opacity-90 mx-3">
              Your Digital Harvest Partner
            </Text>
            <View className="h-[1px] flex-1 bg-[#fcab28] opacity-60" />
          </View>
        </View>
      </View>

      {/* Progress/Loading Indicator */}
      <View className="absolute bottom-16 left-1/2 -ml-32 w-64 h-2 bg-white/20 rounded-full overflow-hidden z-20">
        <Animated.View 
          className="h-full bg-[#fcab28] rounded-full" 
          style={{ width: widthInterpolated }}
        />
      </View>

      {/* Contextual Visual: Bottom Earth Gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(26,28,25,0.8)']}
        className="absolute bottom-0 left-0 right-0 h-1/4 z-10"
      />
    </View>
  );
}
