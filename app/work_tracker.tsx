import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Design token values from work_tracker.html
const COLORS = {
  primary: '#0d631b',
  primaryContainer: '#2e7d32',
  onPrimaryContainer: '#cbffc2',  // light green text on dark green bg
  onSurface: '#1a1c19',
  onSurfaceVariant: '#40493d',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f4f4ef',
  surfaceContainerHigh: '#e8e8e3',
  surfaceContainerHighest: '#e3e3de',
  outlineVariant: '#bfcaba',
  error: '#ba1a1a',
};

export default function WorkTracker() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [workStarted, setWorkStarted] = useState(false);

  useEffect(() => {
    if (!workStarted) return; // Only tick when work has started
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [workStarted]); // Re-run when workStarted changes

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" backgroundColor="#ffffff" />

      {/* TopAppBar — just back arrow */}
      <View
        className="absolute top-0 w-full z-50 bg-white border-b"
        style={{ paddingTop: insets.top, borderColor: 'rgba(191, 202, 186, 0.2)' }}
      >
        <View className="flex-row items-center px-4 py-3 gap-3">
          <TouchableOpacity
            onPress={() => router.push('/(owner)')}
            className="w-10 h-10 items-center justify-center rounded-full bg-[#f4f4ef] active:scale-95"
          >
            <MaterialIcons name="arrow-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-lg" style={{ color: COLORS.primary }}>Work in Progress</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 80, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── TIMER CARD — only shown after work starts ── */}
        {workStarted && (
          <View
            className="bg-surface-container-lowest p-8 rounded-3xl items-center justify-center mb-4 relative overflow-hidden"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 24, elevation: 2 }}
          >
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: COLORS.primaryContainer }} />
            <Text className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: COLORS.primary }}>
              ACTIVE DURATION
            </Text>
            <Text className="font-headline font-extrabold tracking-tight mb-2" style={{ fontSize: 56, color: COLORS.onSurface }}>
              {formatTime(seconds)}
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primaryContainer }} />
              <Text className="font-medium" style={{ color: COLORS.primaryContainer }}>Tracking Live</Text>
            </View>
          </View>
        )}

        {/* ── EARNINGS & RATE CARDS ── */}
        <View className="gap-4 mb-6">
          {/* Earnings: from-primary to-primary-container, text-on-primary-container = #cbffc2 */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryContainer,]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20 }}
            className="p-6 rounded-3xl flex-row items-center justify-between"
          >
            <View>
              <Text className="text-sm font-medium mb-2" style={{ color: `${COLORS.onPrimaryContainer}cc` }}>
                Estimated Earnings
              </Text>
              {/* Rounded box — pure inline styles to guarantee RN rendering */}
              <View style={{ backgroundColor: 'rgba(203,255,194,0.2)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 4 }}>
                <Text className="text-3xl font-headline font-extrabold" style={{ color: COLORS.onPrimaryContainer }}>
                  ₹1,800
                </Text>
              </View>
            </View>
            {/* bg-on-primary-container/20 */}
            <View className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(203,255,194,0.2)' }}>
              <MaterialIcons name="payments" size={32} color={COLORS.onPrimaryContainer} />
            </View>
          </LinearGradient>

          {/* Work Rate: bg-surface-container-low, rounded-3xl, no shadow */}
          <View className="bg-surface-container-low p-6 rounded-3xl flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-on-surface-variant mb-1">Work Rate</Text>
              <Text className="text-2xl font-headline font-bold text-on-surface">₹1,200/acre</Text>
            </View>
            <MaterialIcons name="speed" size={32} color="#835400" />
          </View>
        </View>

        {/* ── JOB DETAILS ── line by line */}
        <View className="mb-8 gap-3">
          {/* Farmer row */}
          <View
            className="bg-surface-container-low p-4 rounded-3xl flex-row items-center gap-4"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
          >
            <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: 'rgba(13,99,27,0.1)' }}>
              <MaterialIcons name="person" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Farmer</Text>
              <Text className="font-headline font-bold text-on-surface">Amandeep Singh</Text>
            </View>
          </View>

          {/* Crop Type row */}
          <View
            className="bg-surface-container-low p-4 rounded-3xl flex-row items-center gap-4"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
          >
            <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: 'rgba(13,99,27,0.1)' }}>
              <MaterialIcons name="grass" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Crop Type</Text>
              <Text className="font-headline font-bold text-on-surface">Basmati Rice</Text>
            </View>
          </View>
        </View>

        {/* ── ACTION CONTROLS ── */}
        <View className="gap-4">
          {!workStarted ? (
            <TouchableOpacity
              onPress={() => { setSeconds(0); setWorkStarted(true); }}
              activeOpacity={0.9}
              style={{ shadowColor: '#835400', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 15, elevation: 12 }}
            >
              <LinearGradient
                colors={['#835400', '#fcab28']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ height: 80, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                <MaterialIcons name="play-circle-filled" size={32} color="white" />
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', letterSpacing: 2, marginTop: 2 }}>Start Work</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(owner)')}
              activeOpacity={0.98}
              style={{ shadowColor: COLORS.error, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 }}
            >
              <LinearGradient
                colors={[COLORS.error, '#93000a']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ height: 80, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                <MaterialIcons name="stop-circle" size={32} color="white" />
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>End Work</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* ── FIELD VISUAL ── mt-8 rounded-3xl h-48 */}
        <View className="mt-8 rounded-3xl overflow-hidden relative bg-surface-container-high" style={{ height: 192 }}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZAv2nyXgrEv8dNTgod1Vze3lilpYinr07_SK19Q7EWwPMlp5D8cH4qxl0chmhk7cno0LMQj8DFze5GRqHUfIYocSMPqDT0d6aYya96t6DLq83snmao7GFircaTkxNfordu6DG3lCO4T5CAxI_ANs9STJdyO0RofGIpMv7I0mk8F9MRrVHVdN_iIvaacenK8c0eUloUsKiSaAMDSdZAZzvqKgYOwHZVdCr9XLy7rPrX2_Hvb87YdBDOuvsNxCf2s2S1-0kqllm8a4p' }}
            className="w-full h-full"
            style={{ opacity: 0.75 }}  // brightness-75 equivalent
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            className="absolute inset-0 justify-end p-6"
          >
            <View className="flex-row items-center gap-1 mb-1">
              <MaterialIcons name="location-on" size={14} color="white" />
              <Text className="text-white/80 text-sm font-medium">Sangrur, Punjab</Text>
            </View>
            <Text className="text-white font-headline font-bold">Block 4A - North Field</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}
