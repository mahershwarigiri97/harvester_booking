import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated, PanResponder, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 30; // More sensitive
const MINIMIZED_OFFSET = 300; 

export default function DriverNavigation() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const translateY = React.useRef(new Animated.Value(600)).current;
  const lastOffset = React.useRef(0);

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
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Calculate new position based on drag
        const newY = lastOffset.current + gestureState.dy;
        // Apply resistance at top/bottom limits
        if (newY < 0) {
          translateY.setValue(newY * 0.2); // Rubbery resistance at very top
        } else if (newY > MINIMIZED_OFFSET + 50) {
          translateY.setValue(MINIMIZED_OFFSET + 50 + (newY - (MINIMIZED_OFFSET + 50)) * 0.2); // Rubber at bottom
        } else {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const finalY = lastOffset.current + gestureState.dy;

        // Smart snapping logic
        if (gestureState.vy > 0.5 || finalY > MINIMIZED_OFFSET / 2) {
          // Fast down-swipe or dragged past half-way -> MINIMIZE
          Animated.spring(translateY, {
            toValue: MINIMIZED_OFFSET,
            damping: 25,
            stiffness: 120,
            useNativeDriver: true,
          }).start(() => { lastOffset.current = MINIMIZED_OFFSET; });
        } else {
          // Fast up-swipe or dragged above half-way -> EXPAND
          Animated.spring(translateY, {
            toValue: 0,
            damping: 25,
            stiffness: 120,
            useNativeDriver: true,
          }).start(() => { lastOffset.current = 0; });
        }
      },
    })
  ).current;

  const ctaTranslateY = translateY.interpolate({
    inputRange: [0, MINIMIZED_OFFSET],
    outputRange: [0, -230], // Centered in peek view
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

  return (
    <View className="flex-1 bg-surface relative overflow-hidden">
      <StatusBar hidden={true} />

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
              fill="none" stroke="#fcab28" strokeLinecap="round" strokeOpacity="0.4" strokeWidth="16" 
            />
            <Path 
              d="M 100 700 Q 150 500, 250 450 T 320 200" 
              fill="none" stroke="#fcab28" strokeDasharray="1 15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" 
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

      {/* Design Header */}
      <View 
        className="absolute top-0 left-0 right-0 z-50 px-4"
        style={{ paddingTop: Math.max(insets.top + 10, 20) }}
      >
        <View className="flex-row items-center justify-between bg-white/60 rounded-full px-4 py-3" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 }}>
          <TouchableOpacity onPress={() => router.back()} className="p-1 rounded-full active:scale-95">
            <MaterialIcons name="directions-bike" size={24} color="#0d631b" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-lg tracking-tight" style={{ color: '#0d631b' }}>12.4 km • 18 min</Text>
          <TouchableOpacity className="p-1 rounded-full active:scale-95">
            <MaterialIcons name="settings" size={24} color="#0d631b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawer */}
      <Animated.View 
        className="absolute bottom-0 left-0 right-0 z-40 bg-surface-container-lowest" 
        style={{ transform: [{ translateY }], borderTopLeftRadius: 40, borderTopRightRadius: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -12 }, shadowOpacity: 0.15, shadowRadius: 40, elevation: 20 }}
      >
        <View className="pt-2 px-8 pb-[100px] min-h-[460px]">
          {/* DRAG HANDLE - Expanded to make interaction easier */}
          <View {...panResponder.panHandlers} className="w-full py-6 items-center">
            <View className="w-12 h-1.5 bg-surface-container-highest rounded-full" />
          </View>

          <Animated.View style={{ opacity: infoOpacity, transform: [{ translateY: infoTranslateY }] }}>
            <View className="flex-row items-center justify-between mb-8 mt-2">
              <View className="flex-row items-center gap-4">
                <View className="w-16 h-16 rounded-2xl bg-surface-container overflow-hidden">
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnH-Q92pOvcRu8x5vBsmB_DEDct6lH7arcfKKS-3Mez1_lJAJHsBMWMMfejNy2rkeYd_prWmmVYBz5fpoEbExPFEHBp2XVzoWdA1IoCZNQxt2nkawb7dZANsHZugSWkemiwulUor5PE3loEycsh57HZHKE81PzsyNCNrRDmidXJpbr1c4BckkgmROY3YyZiGmx-lhQitU1Jje99dduEDd4-SpblFJ8d5wFwtBkBmqa7tiuuow2vqpdULsmUMXnD8HNPPANmbOAyFYk' }}
                    className="w-full h-full object-cover"
                  />
                </View>
                <View>
                  <Text className="text-on-surface-variant font-medium text-xs tracking-wide uppercase mb-0.5">Navigating To</Text>
                  <Text className="font-headline text-2xl font-extrabold text-on-surface">Amandeep Singh</Text>
                </View>
              </View>
              <TouchableOpacity className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <MaterialIcons name="call" size={24} color="#0d631b" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-4 mb-2">
              <View className="flex-1 bg-surface-container-low p-4 rounded-[24px]">
                <View className="flex-row items-center gap-2 mb-1">
                  <MaterialIcons name="grass" size={16} color="#0d631b" />
                  <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Crop Type</Text>
                </View>
                <Text className="font-headline font-bold text-lg">Basmati Rice</Text>
              </View>
              <View className="flex-1 bg-surface-container-low p-4 rounded-[24px]">
                <View className="flex-row items-center gap-2 mb-1">
                  <MaterialIcons name="straighten" size={16} color="#0d631b" />
                  <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Area</Text>
                </View>
                <Text className="font-headline font-bold text-lg">4.5 Acres</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateY: ctaTranslateY }] }}>
            <View className="mt-8">
              <TouchableOpacity 
                className="h-20 rounded-[32px] flex-row items-center justify-center gap-3 active:scale-[0.98] duration-300"
                style={{ 
                  elevation: 12,
                  shadowColor: '#0d631b',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.35,
                  shadowRadius: 15,
                }}
              >
                <View className="absolute inset-0 rounded-[32px] overflow-hidden">
                  <LinearGradient 
                    colors={['#0d631b', '#2e7d32']} 
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                    className="w-full h-full"
                  />
                </View>
                <MaterialIcons name="navigation" size={28} color="white" />
                <Text className="text-white font-headline text-xl font-extrabold uppercase tracking-widest mt-1">Start Navigation</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}
