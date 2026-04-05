import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../utils/authStore';
import BookingRequestPopup from '../../components/BookingRequestPopup';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { DashboardSkeleton } from '../../components/DashboardSkeleton';

export default function OwnerDashboard() {
  const { locationName } = useCurrentLocation();
  const [isOnline, setIsOnline] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
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
              <Text className="font-headline font-bold text-lg text-primary">{user?.name || 'Harvester Owner'}</Text>
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
                <Text className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 mr-1">{isOnline ? 'Online' : 'Offline'}</Text>
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
                  <Text className="text-on-primary/80 text-sm font-semibold">Today's Earnings</Text>
                  <Text className="text-4xl font-headline font-black text-on-primary mt-2">₹8,500</Text>
                  <View className="mt-4 flex-row items-center gap-1 bg-white/20 px-3 py-1 rounded-full self-start">
                    <MaterialIcons name="trending-up" size={16} color="white" />
                    <Text className="text-on-primary text-xs">12% vs yesterday</Text>
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
                <Text className="text-on-surface-variant text-sm font-semibold">Bookings</Text>
                <Text className="text-3xl font-headline font-bold text-on-surface mt-1">
                  {user?.owner_bookings?.filter((b: any) => ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length || 0}
                </Text>
                <Text className="text-xs text-primary font-bold mt-2 uppercase">Upcoming</Text>
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
                <Text className="text-on-surface-variant text-sm font-semibold">Total Jobs</Text>
                <Text className="text-3xl font-headline font-bold text-on-surface mt-1">
                  {user?.owner_bookings?.filter((b: any) => b.status === 'completed').length || 0}
                </Text>
                <Text className="text-xs text-on-surface-variant font-bold mt-2 uppercase">Lifetime</Text>
              </View>
            </View>
          </View>

          {/* New Booking Requests */}
          <View className="flex-col mt-4">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-headline font-bold text-xl text-primary">New Booking Requests</Text>
              <View className="bg-tertiary-container px-3 py-1 rounded-full">
                <Text className="text-on-tertiary-container text-xs font-bold">2 NEW</Text>
              </View>
            </View>

            <View className="flex-col gap-4">
              {/* Request Item 1 */}
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
                <View className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-12 -mt-12" />

                <View className="flex-col gap-4 z-10 w-full mb-6">
                  <View className="flex-row items-center gap-4 w-full">
                    <View className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                      <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYscZG3focAbBfPNU0v_rUEVMQXE5FHobwbxPHjl5Vvlt29jsyapJlCELSVqH2lCMJ_MKnuqNYwd7z5l-BFS46u9VKxv-wETGg8JfHN2tw0SjWxUjxeKFvGf7tcug7sgls_2V4g6JQvSF7Zl7YLAGfi8il00oCjwfUcAtRgMLxNPLqfobvBf_dOCouBRvLDti3I6pgkhZyvyNMMp4UUb6SncpLVljDqth2BzVq9HKX5el4nBDRP3L-t0tfhipFgxjAxN1XO8GeTWhc' }}
                        className="w-full h-full"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-lg text-on-surface">Amandeep Singh</Text>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="location-on" size={14} color="#40493d" />
                        <Text className="text-on-surface-variant text-sm flex-shrink">2.4 km away • Phillaur</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-col items-end self-end w-full">
                    <Text className="text-2xl font-headline font-black text-primary">₹3,000</Text>
                    <Text className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-tighter">Est. Payout</Text>
                  </View>
                </View>

                <View className="flex-row gap-4 w-full">
                  <TouchableOpacity className="flex-1 bg-surface-container-low hover:bg-error-container py-4 rounded-2xl items-center justify-center active:scale-95 duration-200 transition-colors">
                    <Text className="text-error font-bold">Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowPopup(true)}
                    className="flex-1 rounded-2xl active:scale-95 duration-200"
                    style={{
                      elevation: 8,
                      shadowColor: '#0d631b',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                    }}
                  >
                    <View className="w-full rounded-2xl overflow-hidden">
                      <LinearGradient
                        colors={['#0d631b', '#2e7d32']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        className="w-full py-4 items-center justify-center"
                      >
                        <Text className="text-on-primary font-bold">Accept</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Request Item 2 */}
              <View
                className="bg-surface-container-lowest p-5 rounded-[32px] overflow-hidden pt-4"
                style={{
                  elevation: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.04,
                  shadowRadius: 32,
                }}
              >
                <View className="flex-col gap-4 z-10 w-full mb-6">
                  <View className="flex-row items-center gap-4 w-full">
                    <View className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                      <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpT2CLa35WFfkpR5e5Gf1i3HFwZDXd4wYMhy4qVDSjQ9lZHx4oGapuTSBWMYylikQiN482dIxUNFlKMkftt229ZOvcZFDPIPC3TPLs61DWB4yrU0SJO21zhEOnZy7mqiXPNVuIzEceb771N-qJQ0f6Un5XNtWlHU4V4eH0uwEwI3BCIX4TAiuJ2HDRCgrNoPNTgbm4MaNSnKUL0zIdpPPP2NEhfvPjCWfAjscI136MiamSdxhyszWouwOx8vZhNViOQF-3RUNkl0EG' }}
                        className="w-full h-full"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-lg text-on-surface">Gurdeep Singh</Text>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="location-on" size={14} color="#40493d" />
                        <Text className="text-on-surface-variant text-sm flex-shrink">5.1 km away • Nakodar</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-col items-end self-end w-full">
                    <Text className="text-2xl font-headline font-black text-primary">₹5,400</Text>
                    <Text className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-tighter">Est. Payout</Text>
                  </View>
                </View>

                <View className="flex-row gap-4 w-full">
                  <TouchableOpacity className="flex-1 bg-surface-container-low hover:bg-error-container py-4 rounded-2xl items-center justify-center active:scale-95 duration-200 transition-colors">
                    <Text className="text-error font-bold">Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowPopup(true)}
                    className="flex-1 rounded-2xl active:scale-95 duration-200"
                    style={{
                      elevation: 8,
                      shadowColor: '#0d631b',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 12,
                    }}
                  >
                    <View className="w-full rounded-2xl overflow-hidden">
                      <LinearGradient
                        colors={['#0d631b', '#2e7d32']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        className="w-full py-4 items-center justify-center"
                      >
                        <Text className="text-on-primary font-bold">Accept</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
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
                <Text className="text-xs font-bold text-on-surface-variant uppercase">Your Location</Text>
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
        onClose={() => setShowPopup(false)}
      />
    </View>
  );
}
