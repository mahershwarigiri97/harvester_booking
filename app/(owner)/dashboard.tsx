import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../utils/authStore';
import BookingRequestPopup from '../../components/BookingRequestPopup';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { DashboardSkeleton } from '../../components/DashboardSkeleton';
import BookingActivityCard from '../../components/BookingActivityCard';
import { useRouter } from 'expo-router';

export default function OwnerDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locationName, currentLocation } = useCurrentLocation(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const insets = useSafeAreaInsets();

  const { userId: paramsUserId } = useLocalSearchParams<{ userId: string }>();

  // Use stored user for immediate UI, but let useQuery handle the fetch
  const storedUser = useAuthStore(state => state.user);
  const finalUserId = paramsUserId || (storedUser?.id ? String(storedUser.id) : null);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', finalUserId],
    queryFn: async () => {
      if (!finalUserId) return storedUser;
      try {
        const res = await authApi.getProfile(finalUserId);
        return res.data.data;
      } catch (err) {
        console.error('Fetch profile failed', err);
        return storedUser;
      }
    },
    enabled: !!finalUserId,
    initialData: storedUser || undefined,
    refetchInterval: 3000,
  });

  // Sync owner location to server for farmer distance calculation
  React.useEffect(() => {
    if (user?.id && currentLocation?.coords && isOnline) {
      authApi.updateProfile(user.id, {
        current_latitude: currentLocation.coords.latitude,
        current_longitude: currentLocation.coords.longitude
      }).catch(err => console.error('[LocationUpdate] Failed:', err));
    }
  }, [currentLocation?.coords.latitude, currentLocation?.coords.longitude, user?.id, isOnline]);

  const todayEarnings = React.useMemo(() => {
    if (!user?.owner_bookings) return 0;
    const today = new Date().toDateString();
    return user.owner_bookings
      .filter((b: any) => b && b.status === 'completed' && b.created_at && new Date(b.created_at).toDateString() === today)
      .reduce((sum: number, b: any) => sum + (b.price || 0), 0);
  }, [user]);

  const activeBookingsCount = React.useMemo(() => {
    if (!user?.owner_bookings) return 0;
    return user.owner_bookings.filter((b: any) =>
      b && b.status && !['completed', 'cancelled'].includes(b.status)
    ).length;
  }, [user]);

  const totalCompletedJobs = React.useMemo(() => {
    if (!user?.owner_bookings) return 0;
    return user.owner_bookings.filter((b: any) => b && b.status === 'completed').length;
  }, [user]);

  const pendingBookings = React.useMemo(() => {
    if (!user?.owner_bookings) return [];
    return user.owner_bookings.filter((b: any) =>
      !['completed', 'cancelled'].includes(b.status)
    );
  }, [user]);

  if (isLoading && !user) {
    return <DashboardSkeleton />;
  }

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" backgroundColor="#fafaf5" />
      {/* TopAppBar */}
      <View
        className="absolute top-0 w-full z-50 bg-surface border-b"
        style={{ paddingTop: insets.top, borderColor: 'rgba(191, 202, 186, 0.2)' }}
      >
        <View className="flex-row justify-between items-center px-6 py-4 w-full">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
              <Image
                source={{ uri: user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf9n4KoRbSHPB_d4GTdcV1F290tXpjqMY0-CskNDmAOhoIFuSpqXaKzhmGhlCAc4oZ1Pfg7q1hY1dGaFaN2-Cfb_J9eu3EavfsQ000egQc4RSNVH-3NLPH1JO7jWclB3n5r2-FktzEO7ep20j5OU2FLmMErdCvxuJhsBp8qSwQyf_9dqUmruPw2i-MRRuY5nuFXgwk1x_cEB8QNHyn4JlKfE4ys1bXIVtrQ_M4NDOaw7uoRd54WA2n_52ImUbaUOFUI5lYQdRjDQkD' }}
                className="w-full h-full"
                accessibilityLabel="portrait of the owner"
              />
            </View>
            <View className="flex-col">
              <Text className="font-headline font-bold text-lg text-primary">{user?.name || t('role.ownerTitle')}</Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="location-on" size={14} color="#0d631b" />
                <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
                  {locationName}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="hover:bg-[#f4f4ef] dark:hover:bg-[#2e312c] p-2 rounded-full active:scale-95 duration-200">
              <MaterialIcons name="notifications" size={24} color="#0d631b" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 80, // matches pt-24 space from HTML
          paddingBottom: 110
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 max-w-4xl mx-auto space-y-8 w-full">

          {/* Profile & Status Section */}
          <View className="space-y-4">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">{user?.name || 'User'}</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <MaterialIcons name="star" size={20} color="#835400" />
                  <Text className="font-bold text-lg text-on-surface">{user?.rating || '0.0'}</Text>
                </View>
              </View>
              <View className="flex-col items-end">
                <View style={{ marginBottom: Platform.OS === 'ios' ? 0 : -6, marginRight: Platform.OS === 'ios' ? -2 : -6 }}>
                  <Switch
                    value={isOnline}
                    onValueChange={setIsOnline}
                    trackColor={{ false: "#e3e3de", true: "#0d631b" }}
                    thumbColor="#ffffff"
                    style={Platform.OS === 'ios' ? { transform: [{ scale: 0.85 }] } : undefined}
                  />
                </View>
                <Text className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 mr-1">{isOnline ? t('common.online') : t('common.offline')}</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid (Bento Style) */}
          <View className="flex-row flex-wrap gap-4 mt-5">
            {/* Today's earnings (col-span-2 equivalent) */}
            <View
              className="w-full rounded-3xl"
              style={{
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <View className="w-full rounded-3xl overflow-hidden">
                <LinearGradient
                  colors={['#0d631b', '#2e7d32']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  className="w-full p-6"
                >
                  <Text className="text-on-primary/80 text-sm font-semibold">{t('owner.todayEarnings')}</Text>
                  <Text className="text-4xl font-headline font-black text-on-primary mt-2">₹{todayEarnings.toLocaleString()}</Text>
                  <View className="mt-4 flex-row items-center gap-1 bg-white/20 px-3 py-1 rounded-full self-start">
                    <MaterialIcons name="trending-up" size={16} color="white" />
                    <Text className="text-on-primary text-xs">{t('common.earnings')}</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Bookings & Total Jobs Row */}
            <View className="flex-row w-full gap-4">
              <View
                className="flex-1 bg-surface-container-lowest p-6 rounded-3xl"
                style={{
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 20,
                }}
              >
                <Text className="text-on-surface-variant text-sm font-semibold">{t('common.bookings')}</Text>
                <Text className="text-3xl font-headline font-bold text-on-surface mt-1">
                  {activeBookingsCount}
                </Text>
                <Text className="text-xs text-primary font-bold mt-2 uppercase">{t('owner.activeJobs')}</Text>
              </View>

              <View
                className="flex-1 bg-surface-container-lowest p-6 rounded-3xl"
                style={{
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 20,
                }}
              >
                <Text className="text-on-surface-variant text-sm font-semibold">{t('owner.totalJobs')}</Text>
                <Text className="text-3xl font-headline font-bold text-on-surface mt-1">
                  {totalCompletedJobs}
                </Text>
                <Text className="text-xs text-on-surface-variant font-bold mt-2 uppercase">Lifetime</Text>
              </View>
            </View>
          </View>

          {/* New Booking Requests */}
          <View className="flex-col mt-4">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-headline font-bold text-xl text-primary">{t('owner.liveActivity')}</Text>
              <View className={`${pendingBookings.some((b: any) => b && b.status === 'requested') ? 'bg-error-container' : 'bg-primary-container'} px-3 py-1 rounded-full`}>
                <Text className={`${pendingBookings.some((b: any) => b && b.status === 'requested') ? 'text-on-error-container' : 'text-on-primary-container'} text-xs font-bold`}>
                  {pendingBookings.length} {pendingBookings.some((b: any) => b && b.status === 'requested') ? 'NEW' : 'ACTIVE'}
                </Text>
              </View>
            </View>

            <View className="flex-col gap-4">
              {pendingBookings.length === 0 ? (
                <View className="items-center py-12 bg-surface-container-lowest rounded-[32px] border border-outline/10">
                  <MaterialIcons name="event-note" size={48} color="#bfcaba" />
                  <Text className="text-on-surface-variant font-bold mt-4">{t('owner.noBookings')}</Text>
                  <Text className="text-on-surface-variant text-xs mt-1">{t('owner.newRequests')}</Text>
                </View>
              ) : (
                pendingBookings.map((booking: any) => (
                  <BookingActivityCard
                    key={booking.id}
                    booking={booking}
                    ownerLocation={currentLocation?.coords}
                    onViewRequest={(b: any) => {
                      setSelectedBooking(b);
                      setShowPopup(true);
                    }}
                    onNavigateToNavigation={(id) => router.push({ pathname: '/navigation', params: { bookingId: id } } as any)}
                    onNavigateToTracker={(id) => router.push({ pathname: '/work_tracker', params: { bookingId: id } } as any)}
                  />
                ))
              )}
            </View>
          </View>

          {/* Current Location Map Anchor */}
          <View
            className="bg-surface-container-low rounded-3xl p-4 flex-row items-center justify-between border mt-2"
            style={{ borderColor: 'rgba(191, 202, 186, 0.15)' }}
          >
            <View className="flex-row items-center gap-3">
              <View className="bg-primary-fixed p-2 rounded-xl">
                <MaterialIcons name="social-distance" size={24} color="#0d631b" />
              </View>
              <View>
                <Text className="text-xs font-bold text-on-surface-variant uppercase">{t('common.yourLocation')}</Text>
                <Text className="font-bold text-on-surface">{locationName}</Text>
              </View>
            </View>
            <MaterialIcons name="map" size={24} color="#0d631b" />
          </View>

        </View>
      </ScrollView>

      {/* Booking Request Popup overlay matched exactly to Stitch design */}
      <BookingRequestPopup
        visible={showPopup}
        booking={selectedBooking}
        onClose={() => {
          setShowPopup(false);
          setSelectedBooking(null);
        }}
      />
    </View>
  );
}
