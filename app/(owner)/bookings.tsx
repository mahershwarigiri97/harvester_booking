import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../utils/authStore';
import { BookingAddress } from '../../components/BookingAddress';
import { CancelBookingModal } from '../../components/CancelBookingModal';
import { AcceptBookingModal } from '../../components/AcceptBookingModal';
import { BookingDetailsModal } from '../../components/BookingDetailsModal';
import { getBookingStatusInfo } from '../../utils/bookingHelpers';
import { useSocket } from '../../hooks/useSocket';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { calculateDistance } from '../../utils/locationUtils';

export default function BookingHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentLocation } = useCurrentLocation();
  const user = useAuthStore(state => state.user);
  const [activeFilter, setActiveFilter] = useState('All');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [acceptingBookingId, setAcceptingBookingId] = useState<string | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<any>(null);
  const queryClient = useQueryClient();

  // Real-time list refresh
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'owner'] });
    };
    socket.on('bookings_refresh', handleRefresh);
    return () => {
      socket.off('bookings_refresh', handleRefresh);
    };
  }, [socket]);

  const filters = ['All', 'Active', 'Pending', 'Completed', 'Cancelled'];

  const cancelMutation = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
      authApi.updateBookingStatus(bookingId, 'cancelled', undefined, reason, 'owner'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'owner'] });
      setCancellingBookingId(null);
    },
    onError: () => {
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
      setCancellingBookingId(null);
    },
  });

  const handleCancelClick = (bookingId: string) => {
    setCancellingBookingId(bookingId);
  };

  const confirmCancel = (reason: string) => {
    if (cancellingBookingId) {
      cancelMutation.mutate({ bookingId: cancellingBookingId, reason });
    }
  };

  const closeModal = () => {
    if (!cancelMutation.isPending) {
      setCancellingBookingId(null);
    }
  };

  const acceptMutation = useMutation({
    mutationFn: (bookingId: string) => authApi.updateBookingStatus(bookingId, 'accepted'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'owner'] });
      setAcceptingBookingId(null);
    },
    onError: () => {
      Alert.alert('Error', 'Failed to accept booking. Please try again.');
      setAcceptingBookingId(null);
    },
  });

  const handleAcceptClick = (bookingId: string) => {
    setAcceptingBookingId(bookingId);
  };

  const confirmAccept = () => {
    if (acceptingBookingId) {
      acceptMutation.mutate(acceptingBookingId);
    }
  };

  const closeAcceptModal = () => {
    if (!acceptMutation.isPending) {
      setAcceptingBookingId(null);
    }
  };

  const startNavigationMutation = useMutation({
    mutationFn: (bookingId: string) =>
      authApi.updateBookingStatus(bookingId, 'on_the_way', 'Harvester is starting navigation'),
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'owner'] });
      router.push({
        pathname: '/navigation',
        params: { bookingId }
      });
    },
  });

  const { data: serverBookings, isLoading, refetch } = useQuery({
    queryKey: ['bookings', 'owner'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await authApi.getMyBookings(user.id, 'owner');
      return res.data.data || [];
    },
    enabled: !!user?.id,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetch();
      }
    }, [user?.id, refetch])
  );

  const bookings = (serverBookings || []).map((b: any) => {
    let tabCategory = 'Pending';
    if (b.status === 'completed') tabCategory = 'Completed';
    else if (b.status === 'cancelled') tabCategory = 'Cancelled';
    else if (['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)) tabCategory = 'Active';

    const statusInfo = getBookingStatusInfo(b.status);

    return {
      id: b.id.toString(),
      name: b.customer_name || b.farmer?.name || 'Farmer',
      latitude: b.full_address?.latitude,
      longitude: b.full_address?.longitude,
      status: statusInfo.text,
      hexBg: statusInfo.hexBg,
      hexColor: statusInfo.hexColor,
      tabCategory: tabCategory,
      rawStatus: b.status,
      date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: `₹${b.price.toLocaleString()}`,
      amountLabel: b.status === 'completed' ? 'Earned' : 'Estimated',
      image: b.farmer?.avatar || 'https://via.placeholder.com/150',
      full_address: b.full_address,
      cancel_reason: b.cancel_reason,
      updated_by_user: b.updated_by_user,
      size: `${b.land_area} Ac`,
      farm_latitude: b.farm_latitude,
      farm_longitude: b.farm_longitude,
    };
  });

  const filteredBookings = activeFilter === 'All'
    ? bookings
    : bookings.filter((b: any) => b.tabCategory === activeFilter);

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" backgroundColor="#fafaf5" />

      {/* TopAppBar */}
      <View
        className="absolute top-0 w-full z-50 bg-[#fafaf5]/80 backdrop-blur-md border-b"
        style={{ paddingTop: insets.top, borderColor: 'rgba(191, 202, 186, 0.2)' }}
      >
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity className="active:scale-95 transition-transform">
              <MaterialIcons name="menu" size={24} color="#0d631b" />
            </TouchableOpacity>
            <Text className="font-headline font-bold text-xl text-primary">Booking History</Text>
          </View>
          <TouchableOpacity className="active:scale-95 transition-transform p-2 rounded-full bg-[#f4f4ef]">
            <MaterialIcons name="filter-list" size={24} color="#0d631b" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 80,
          paddingBottom: 110,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-2xl mx-auto w-full">
          {/* Filter Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-8"
            contentContainerStyle={{ gap: 8 }}
          >
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full active:scale-95 duration-200 transition-colors ${activeFilter === filter
                  ? 'bg-primary'
                  : 'bg-surface-container-high hover:bg-surface-container-highest'
                  }`}
              >
                <Text className={`text-sm font-bold whitespace-nowrap ${activeFilter === filter ? 'text-on-primary' : 'text-on-surface-variant'
                  }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Bookings List */}
          <View className="space-y-6">
            {isLoading ? (
              <View className="flex-1 items-center justify-center py-10">
                <ActivityIndicator size="large" color="#0d631b" />
              </View>
            ) : filteredBookings.length === 0 ? (
              <View className="items-center justify-center py-20 opacity-50">
                <Text className="text-on-surface-variant text-base">No bookings found</Text>
              </View>
            ) : (
              filteredBookings.map((booking: any) => {
                const isCompleted = booking.status === 'Completed';
                return (
                  <TouchableOpacity
                    key={booking.id}
                    onPress={() => setSelectedBookingForDetails(booking)}
                    activeOpacity={0.85}
                    className="bg-surface-container-lowest rounded-[32px] p-6 mb-4"
                    style={{
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.06,
                      shadowRadius: 24,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-6 w-full">
                      <View className="flex-row gap-4 items-center flex-1">
                        <View className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden ${isCompleted ? 'bg-primary/10' : 'bg-[#fcab28]/10'}`}>
                          <Image source={{ uri: booking.image }} className="w-full h-full" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-xl font-headline font-bold text-on-surface">{booking.name}</Text>
                          <View className="flex-row items-center gap-1 mt-1">
                            <MaterialIcons name="location-on" size={16} color="#40493d" />
                            <Text className="text-sm font-medium text-on-surface-variant flex-1" numberOfLines={1}>
                              {booking.size} • {(() => {
                                const targetLat = booking.latitude || booking.farm_latitude;
                                const targetLng = booking.longitude || booking.farm_longitude;
                                if (!currentLocation || !targetLat || !targetLng) return 'View Location';
                                const d = calculateDistance(
                                  currentLocation.coords.latitude,
                                  currentLocation.coords.longitude,
                                  targetLat,
                                  targetLng
                                );
                                return `${d} km away`;
                              })()}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        className="px-4 py-1.5 rounded-full"
                        style={{ backgroundColor: booking.hexBg }}
                      >
                        <Text
                          className="font-headline font-bold text-xs tracking-wider uppercase"
                          style={{ color: booking.hexColor }}
                        >
                          {booking.status}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between border-t pt-6" style={{ borderColor: 'rgba(191,202,186,0.3)', opacity: isCompleted ? 1 : 0.6 }}>
                      <View className="flex-col">
                        <Text className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Date & Time</Text>
                        <View className="flex-row items-center gap-1.5">
                          <MaterialIcons name="calendar-today" size={20} color={isCompleted ? "#0d631b" : "#444941"} />
                          <Text className="font-body font-bold text-on-surface">{booking.date}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{booking.amountLabel || 'Earning'}</Text>
                        <Text className={`text-2xl font-headline font-black ${isCompleted ? 'text-primary' : 'text-on-surface'}`}>{booking.amount}</Text>
                      </View>
                    </View>

                    {/* Action buttons — Pending status: Cancel + Accept side-by-side */}
                    {booking.status === 'Pending' && (
                      <View className="mt-4 flex-row gap-3">
                        <TouchableOpacity
                          onPress={(e) => { e.stopPropagation?.(); handleCancelClick(booking.id); }}
                          activeOpacity={0.8}
                          disabled={(cancellingBookingId === booking.id && cancelMutation.isPending) || (acceptingBookingId === booking.id && acceptMutation.isPending)}
                          className="flex-1 flex-row items-center justify-center gap-2 border rounded-2xl py-3"
                          style={{ borderColor: 'rgba(186,26,26,0.4)' }}
                        >
                          {cancellingBookingId === booking.id && cancelMutation.isPending ? (
                            <ActivityIndicator size="small" color="#ba1a1a" />
                          ) : (
                            <MaterialIcons name="cancel" size={18} color="#ba1a1a" />
                          )}
                          <Text className="text-error font-bold text-sm">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={(e) => { e.stopPropagation?.(); handleAcceptClick(booking.id); }}
                          activeOpacity={0.8}
                          disabled={(cancellingBookingId === booking.id && cancelMutation.isPending) || (acceptingBookingId === booking.id && acceptMutation.isPending)}
                          className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3"
                          style={{ backgroundColor: '#0d631b' }}
                        >
                          {acceptingBookingId === booking.id && acceptMutation.isPending ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            <MaterialIcons name="check-circle" size={18} color="#ffffff" />
                          )}
                          <Text className="text-white font-bold text-sm">Accept</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Cancel button only — for active non-pending statuses */}
                    {booking.status !== 'Completed' && booking.status !== 'Cancelled' && booking.status !== 'Pending' && (
                      <TouchableOpacity
                        onPress={(e) => { e.stopPropagation?.(); handleCancelClick(booking.id); }}
                        activeOpacity={0.8}
                        disabled={cancellingBookingId === booking.id && cancelMutation.isPending}
                        className="mt-4 flex-row items-center justify-center gap-2 border rounded-2xl py-3"
                        style={{ borderColor: 'rgba(186,26,26,0.4)' }}
                      >
                        {cancellingBookingId === booking.id && cancelMutation.isPending ? (
                          <ActivityIndicator size="small" color="#ba1a1a" />
                        ) : (
                          <MaterialIcons name="cancel" size={18} color="#ba1a1a" />
                        )}
                        <Text className="text-error font-bold text-sm">Cancel Booking</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      <CancelBookingModal
        visible={!!cancellingBookingId}
        onClose={closeModal}
        onConfirm={confirmCancel}
        isLoading={cancelMutation.isPending}
      />
      <AcceptBookingModal
        visible={!!acceptingBookingId}
        onClose={closeAcceptModal}
        onConfirm={confirmAccept}
        isLoading={acceptMutation.isPending}
      />
      <BookingDetailsModal
        visible={!!selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
        booking={selectedBookingForDetails}
        onNavigateToTrack={() => {
          if (selectedBookingForDetails) {
            const { id, rawStatus } = selectedBookingForDetails;
            if (['arrived', 'in_progress'].includes(rawStatus)) {
              router.push({
                pathname: '/work_tracker',
                params: { bookingId: id }
              });
            } else if (rawStatus === 'on_the_way') {
              router.push({
                pathname: '/navigation',
                params: { bookingId: id }
              });
            } else {
              startNavigationMutation.mutate(id);
            }
          }
        }}
      />
    </View>
  );
}
