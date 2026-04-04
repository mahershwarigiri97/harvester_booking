import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../utils/api';
import { useAuthStore } from '../../utils/authStore';
import { GeocodedAddress } from '../../components/GeocodedAddress';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState('Active');

  const tabs = ['Active', 'Completed', 'Cancelled'];

  const { data: serverBookings, isLoading } = useQuery({
    queryKey: ['bookings', 'farmer'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await authApi.getMyBookings(user.id, 'farmer');
      return res.data.data || [];
    },
    enabled: !!user?.id,
  });

  const getStatusInfo = (dbStatus: string) => {
    switch (dbStatus) {
      case 'requested': return { text: 'Pending', icon: 'schedule', color: 'bg-orange-100 text-orange-700' };
      case 'accepted': 
      case 'on_the_way': 
      case 'arrived': return { text: 'Accepted', icon: 'check-circle', color: 'bg-green-100 text-green-700' };
      case 'in_progress': return { text: 'In Progress', icon: 'pending', color: 'bg-blue-100 text-blue-700' };
      case 'completed': return { text: 'Completed', icon: 'done-all', color: 'bg-green-100 text-green-700' };
      case 'cancelled': return { text: 'Cancelled', icon: 'cancel', color: 'bg-red-100 text-red-700' };
      default: return { text: 'Pending', icon: 'schedule', color: 'bg-orange-100 text-orange-700' };
    }
  };

  const bookings = (serverBookings || []).map((b: any) => {
    const statusInfo = getStatusInfo(b.status);
    return {
      id: b.id.toString(),
      title: b.harvester ? `${b.harvester.brand} ${b.harvester.model}` : 'Harvester',
      date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      latitude: b.farm_latitude,
      longitude: b.farm_longitude,
      status: statusInfo.text,
      size: `${b.land_area} acres`,
      cost: `₹${b.price.toLocaleString()}`,
      image: b.harvester?.images?.[0] || 'https://via.placeholder.com/600',
      statusColor: statusInfo.color,
      icon: statusInfo.icon,
    };
  });

  const filteredBookings = bookings.filter((b: any) => {
    if (activeTab === 'Active') {
      return ['In Progress', 'Accepted', 'Pending'].includes(b.status);
    }
    return b.status === activeTab;
  });

  return (
    <View className="flex-1 bg-[#fafaf5]">
      {/* Top Header Placeholder spacing since we have no physical NavBar inside Tabs usually, just the title */}
      <View style={{ paddingTop: insets.top + 24 }} className="px-6 pb-6">
        <Text className="font-headline font-extrabold text-4xl text-[#0d631b] tracking-tighter mb-6">
          My Bookings
        </Text>

        {/* Tab Navigation */}
        <View style={{ flexDirection: 'row', backgroundColor: '#eeeee9', padding: 6, borderRadius: 16 }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}
                style={[
                  { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
                  isActive && { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'headline',
                    fontWeight: 'bold',
                    fontSize: 14,
                    color: isActive ? '#0d631b' : '#40493d'
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center mt-20">
            <ActivityIndicator size="large" color="#0d631b" />
          </View>
        ) : filteredBookings.length > 0 ? (
          <View className="gap-6">
            {filteredBookings.map((booking: any) => (
              <View key={booking.id} className="bg-white rounded-[2rem] p-5 shadow-sm" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3 }}>
                <View className="flex-col gap-5">
                  
                  {/* Image & Header Status */}
                  <View className="w-full h-44 rounded-2xl overflow-hidden shrink-0">
                    <Image source={{ uri: booking.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  </View>

                  <View className="flex-1 flex-col">
                    <View className="flex-row justify-between items-start mb-2">
                      <View>
                        <Text className="font-headline font-bold text-2xl text-[#1a1c19]">{booking.title}</Text>
                        <View className="flex-row items-center gap-1.5 mt-1">
                          <MaterialIcons name="calendar-today" size={14} color="#40493d" />
                          <Text className="text-[#40493d] font-medium">{booking.date}</Text>
                        </View>
                        <View className="flex-row items-center gap-1.5 mt-1">
                          <MaterialIcons name="location-on" size={14} color="#40493d" />
                          <GeocodedAddress 
                            latitude={booking.latitude} 
                            longitude={booking.longitude} 
                            className="text-[#40493d] font-medium flex-1 text-sm" 
                            fallback="Farm Location"
                          />
                        </View>
                      </View>
                      
                      <View 
                        className="px-4 py-1.5 rounded-full flex-row items-center gap-1.5"
                        style={{
                          backgroundColor: booking.status === 'In Progress' ? '#dbeafe' : 
                                           booking.status === 'Accepted' || booking.status === 'Completed' ? '#dcfce7' : 
                                           booking.status === 'Cancelled' ? '#fee2e2' : '#ffedd5'
                        }}
                      >
                        <MaterialIcons name={booking.icon as any} size={14} color={
                          booking.status === 'In Progress' ? '#1d4ed8' : 
                          booking.status === 'Accepted' || booking.status === 'Completed' ? '#15803d' : 
                          booking.status === 'Cancelled' ? '#b91c1c' : '#c2410c'
                        } />
                        <Text 
                          className="text-sm font-bold"
                          style={{
                            color: booking.status === 'In Progress' ? '#1d4ed8' : 
                                   booking.status === 'Accepted' || booking.status === 'Completed' ? '#15803d' : 
                                   booking.status === 'Cancelled' ? '#b91c1c' : '#c2410c'
                          }}
                        >
                          {booking.status}
                        </Text>
                      </View>
                    </View>

                    {/* Stats Box */}
                    <View className="flex-row flex-wrap gap-4 my-4 p-4 bg-[#f4f4ef] rounded-2xl w-full justify-between items-center">
                      <View>
                        <Text className="text-[11px] font-bold text-[#40493d] uppercase tracking-widest mb-1">Land Size</Text>
                        <Text className="text-lg font-bold text-[#1a1c19]">{booking.size}</Text>
                      </View>
                      <View className="w-[1px] h-8 bg-[#bfcaba]/40"></View>
                      <View>
                        <Text className="text-[11px] font-bold text-[#40493d] uppercase tracking-widest mb-1">Total Cost</Text>
                        <Text className="text-lg font-bold text-[#0d631b]">{booking.cost}</Text>
                      </View>
                    </View>

                    {/* Action Button */}
                    <View className="mt-2 w-full">
                      {booking.status === 'In Progress' && (
                        <TouchableOpacity onPress={() => router.push(`/track/${booking.id}` as any)} activeOpacity={0.88} className="overflow-hidden rounded-2xl">
                          <LinearGradient colors={['#0d631b', '#2e7d32']} className="h-14 flex-row items-center justify-center gap-2 px-6">
                            <MaterialIcons name="my-location" size={20} color="#fff" />
                            <Text className="text-white font-headline font-bold text-[17px]">Track Live</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                      
                      {booking.status === 'Accepted' && (
                        <View className="flex-row gap-3">
                          <TouchableOpacity onPress={() => router.push(`/track/${booking.id}` as any)} activeOpacity={0.88} className="flex-1 overflow-hidden rounded-2xl">
                            <LinearGradient colors={['#0d631b', '#2e7d32']} className="h-14 flex-row items-center justify-center px-4">
                              <Text className="text-white font-headline font-bold text-[16px]">Track Harvester</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      )}

                      {booking.status === 'Pending' && (
                        <TouchableOpacity activeOpacity={0.88} className="h-14 rounded-2xl border-2 border-[#ba1a1a] flex-row items-center justify-center px-6">
                          <Text className="text-[#ba1a1a] font-headline font-bold text-[16px]">Cancel Booking</Text>
                        </TouchableOpacity>
                      )}
                      
                      {booking.status === 'Completed' && (
                        <TouchableOpacity activeOpacity={0.88} className="h-14 rounded-2xl bg-[#e3e3de] flex-row items-center justify-center px-6">
                          <Text className="text-[#1a1c19] font-headline font-bold text-[16px]">Download Receipt</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* Empty State for other tabs */
          <View className="mt-8 bg-[#f4f4ef] rounded-[2.5rem] p-10 items-center justify-center border-2 border-dashed border-[#bfcaba]/40">
            <View className="w-20 h-20 bg-[#e3e3de] rounded-full flex items-center justify-center mb-5">
              <MaterialIcons name="agriculture" size={36} color="#707a6c" />
            </View>
            <Text className="font-headline font-bold text-2xl text-[#1a1c19] mb-2">No bookings yet</Text>
            <Text className="text-[#40493d] mb-6 text-center leading-relaxed">Book your first harvester to start your seasonal harvest with ease. High-quality machines are waiting for you.</Text>
            
            <TouchableOpacity activeOpacity={0.88} className="w-full h-14 overflow-hidden rounded-[16px]">
              <LinearGradient colors={['#0d631b', '#2e7d32']} className="h-full items-center justify-center">
                <Text className="text-white font-headline font-bold text-lg">Browse Harvesters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
