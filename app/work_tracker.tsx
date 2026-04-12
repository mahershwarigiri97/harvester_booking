import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authApi } from '../utils/api';
import { BookingAddress } from '../components/BookingAddress';
import { ConfirmEndWorkModal } from '../components/ConfirmEndWorkModal';
import { getLastJobDuration } from '../utils/bookingUtils';

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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const queryClient = useQueryClient();
  const [seconds, setSeconds] = useState(0);
  const [workStarted, setWorkStarted] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const { data: booking, isLoading: isBookingLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const res = await authApi.getBookingById(bookingId as string);
      return res.data.data;
    },
    enabled: !!bookingId,
  });

  const { data: trackingData = [] } = useQuery({
    queryKey: ['tracking', bookingId],
    queryFn: async () => {
      const res = await authApi.getBookingTracking(bookingId as string);
      return res.data.data || [];
    },
    enabled: !!bookingId,
  });

  // Sync internal state with server status
  useEffect(() => {
    if (booking?.status === 'in_progress') {
      setWorkStarted(true);
      // Calculate elapsed time desde start
      const startRecord = trackingData.find((t: any) => t.status === 'in_progress');
      if (startRecord) {
        const startTime = new Date(startRecord.created_at).getTime();
        const now = new Date().getTime();
        setSeconds(Math.floor((now - startTime) / 1000));
      }
    } else if (booking?.status === 'completed') {
      setWorkStarted(true); // show timer but stopped? Or just fixed time.
      // We'll just keep it simple for now and only tick when active.
    }
  }, [booking?.status, trackingData]);

  const startWorkMutation = useMutation({
    mutationFn: () => authApi.updateBookingStatus(bookingId as string, 'in_progress', 'Harvester has started the work'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['tracking', bookingId] });
      setWorkStarted(true);
      setSeconds(0);
    },
  });

  const endWorkMutation = useMutation({
    mutationFn: (duration: string) => authApi.updateBookingStatus(bookingId as string, 'completed', 'Work completed successfully', undefined, undefined, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['tracking', bookingId] });
      router.push('/(owner)');
    },
  });

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
          <Text className="font-headline font-bold text-lg" style={{ color: COLORS.primary }}>{t('owner.workInProgress')}</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 80, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {isBookingLoading && !booking ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text className="mt-4 text-on-surface-variant font-medium">{t('common.loading')}</Text>
          </View>
        ) : (
          <>
            {/* ── TIMER CARD — always shown for completed or active work ── */}
            {(workStarted || booking?.status === 'completed') && (
              <View className="items-center py-8 bg-surface-container-low rounded-3xl mb-8 border border-outline/10">
                <Text className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-2">
                  {booking?.status === 'completed' ? t('owner.totalWorkSession') : t('owner.activeWorkTimer')}
                </Text>
                <Text className="text-4xl font-headline font-black text-on-surface mb-2">
                  {booking?.status === 'completed' ? getLastJobDuration([booking]) : formatTime(seconds)}
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className={`w-2 h-2 rounded-full ${booking?.status === 'completed' ? 'bg-outline' : 'bg-primary'}`} />
                  <Text className="text-on-surface-variant font-medium text-sm">
                    {booking?.status === 'completed' ? t('owner.sessionFinalized') : t('owner.timerRunning')}
                  </Text>
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
                    {booking?.status === 'completed' ? t('owner.finalEarnings') : t('owner.estimatedEarnings')}
                  </Text>
                  <View style={{ backgroundColor: 'rgba(203,255,194,0.2)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 4 }}>
                    <Text className="text-3xl font-headline font-extrabold" style={{ color: COLORS.onPrimaryContainer }}>
                      ₹{booking?.price?.toLocaleString() || '0'}
                    </Text>
                  </View>
                </View>
                <View className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(203,255,194,0.2)' }}>
                  <MaterialIcons name="payments" size={32} color={COLORS.onPrimaryContainer} />
                </View>
              </LinearGradient>

              {/* Work Rate: Use land area if available */}
              <View className="bg-surface-container-low p-6 rounded-3xl flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-medium text-on-surface-variant mb-1">{t('common.landSize')}</Text>
                  <Text className="text-2xl font-headline font-bold text-on-surface">{booking?.land_area ? `${booking.land_area} ${t('common.acre')}` : 'N/A'}</Text>
                </View>
                <MaterialIcons name="layers" size={32} color="#835400" />
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
                <View className="flex-1">
                  <Text className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('role.farmerTitle')}</Text>
                  <Text className="font-headline font-bold text-on-surface">{booking?.customer_name || booking?.farmer?.name || t('common.loading')}</Text>
                </View>
                <TouchableOpacity className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                  <MaterialIcons name="call" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              {/* Location row */}
              <View
                className="bg-surface-container-low p-4 rounded-3xl flex-row items-center gap-4"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}
              >
                <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: 'rgba(13,99,27,0.1)' }}>
                  <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('common.location')}</Text>
                  <BookingAddress address={booking?.full_address} className="font-headline font-bold text-on-surface" />
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
                  <Text className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('bookings.process.cropLabel')}</Text>
                  <Text className="font-headline font-bold text-on-surface">{booking?.crop_type || t('crops.rice')}</Text>
                </View>
              </View>
            </View>

            {/* ── ACTION CONTROLS ── */}
            <View className="gap-4">
              {!workStarted ? (
                <TouchableOpacity
                  onPress={() => startWorkMutation.mutate()}
                  disabled={startWorkMutation.isPending}
                  activeOpacity={0.9}
                  style={{ shadowColor: '#835400', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 15, elevation: 12 }}
                >
                  <LinearGradient
                    colors={['#835400', '#fcab28']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ height: 80, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}
                  >
                    {startWorkMutation.isPending ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <MaterialIcons name="play-circle-filled" size={32} color="white" />
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', letterSpacing: 2, marginTop: 2 }}>{t('owner.startWork')}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                booking?.status !== 'completed' && (
                  <TouchableOpacity
                    onPress={() => setIsConfirmModalVisible(true)}
                    disabled={endWorkMutation.isPending}
                    activeOpacity={0.98}
                    style={{ shadowColor: COLORS.error, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 }}
                  >
                    <LinearGradient
                      colors={[COLORS.error, '#93000a']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={{ height: 80, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}
                    >
                      {endWorkMutation.isPending ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <>
                          <MaterialIcons name="stop-circle" size={32} color="white" />
                          <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{t('owner.endWork')}</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                )
              )}
            </View>
          </>
        )}
      </ScrollView>
      <ConfirmEndWorkModal
        visible={isConfirmModalVisible}
        onClose={() => setIsConfirmModalVisible(false)}
        onConfirm={() => {
          setIsConfirmModalVisible(false);
          endWorkMutation.mutate(formatTime(seconds));
        }}
        isLoading={endWorkMutation.isPending}
      />
    </View>
  );
}
