import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../utils/authStore';
import { GeocodedAddress } from '../../components/GeocodedAddress';

export default function BookingHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Completed', 'Cancelled'];

  const { data: serverBookings, isLoading } = useQuery({
    queryKey: ['bookings', 'owner'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await authApi.getMyBookings(user.id, 'owner');
      return res.data.data || [];
    },
    enabled: !!user?.id,
  });

  const bookings = (serverBookings || []).map((b: any) => {
    let statusText = 'Pending';
    if (b.status === 'completed') statusText = 'Completed';
    else if (b.status === 'cancelled') statusText = 'Cancelled';
    else if (['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)) statusText = 'Active';

    return {
      id: b.id.toString(),
      name: b.customer_name || b.farmer?.name || 'Farmer',
      latitude: b.farm_latitude,
      longitude: b.farm_longitude,
      status: statusText,
      date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: `₹${b.price.toLocaleString()}`,
      amountLabel: b.status === 'completed' ? 'Earned' : 'Estimated',
      image: b.farmer?.avatar || 'https://via.placeholder.com/150',
    };
  });

  const filteredBookings = activeFilter === 'All' 
    ? bookings 
    : bookings.filter((b: any) => b.status === activeFilter);

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
                className={`px-6 py-2.5 rounded-full active:scale-95 duration-200 transition-colors ${
                  activeFilter === filter 
                    ? 'bg-primary' 
                    : 'bg-surface-container-high hover:bg-surface-container-highest'
                }`}
              >
                <Text className={`text-sm font-bold whitespace-nowrap ${
                  activeFilter === filter ? 'text-on-primary' : 'text-on-surface-variant'
                }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Summary Widget */}
          <View className="mb-10 bg-surface-container-low rounded-[32px] p-8" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-on-surface-variant font-bold text-sm mb-1">Total Earnings</Text>
                <Text className="text-4xl font-headline font-black text-primary tracking-tight">₹12,850</Text>
              </View>
              <View className="items-end">
                <Text className="text-on-surface-variant font-bold text-sm mb-1">Bookings</Text>
                <Text className="text-4xl font-headline font-black text-on-surface tracking-tight">08</Text>
              </View>
            </View>
          </View>

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
                  onPress={() => router.push({ pathname: '/navigation', params: { bookingId: booking.id } })}
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
                          <GeocodedAddress 
                            latitude={booking.latitude} 
                            longitude={booking.longitude} 
                            className="text-sm font-medium text-on-surface-variant flex-1" 
                          />
                        </View>
                      </View>
                    </View>
                    <View className={`px-4 py-1.5 rounded-full ${isCompleted ? 'bg-primary/10' : 'bg-error/10'}`}>
                      <Text className={`font-headline font-bold text-xs tracking-wider uppercase ${isCompleted ? 'text-primary' : 'text-error'}`}>
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
                </TouchableOpacity>
              );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
