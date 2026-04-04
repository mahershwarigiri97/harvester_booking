import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function BookingHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Completed', 'Cancelled'];

  const bookings = [
    {
      id: 1,
      name: 'Amandeep Singh',
      location: 'Nakodar, Punjab',
      status: 'Completed',
      date: '24 Oct 2024, 10:00 AM',
      amount: '₹4,500',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjskoHm3EtNMT1LfRGfOIlYHz12K70pi9emt7Q-w8PWn_HRUn2yO7FD8gbY_GRGzd-ExBJB0GMalAJbgHB5Cvs7gZLJQ8gqDzTl-X-FQt7ATGwNMVin0guYV3MKfHLX7pCbONIGLUTUEi1GaStCocfoJ-tknY1cuILGxjd4cFNY6nCRCBwdtg-tS3CFZlviqU8SBrC8ohuhWIao4VBXSBS28iQWPN3zBDNdxLwH68JU4NFzM1HPwelTP1Jk_f-QmEG6Ji4clFHejIA',
    },
    {
      id: 2,
      name: 'Gurpreet Bajwa',
      location: 'Jalandhar, Punjab',
      status: 'Cancelled',
      date: '23 Oct 2024, 02:30 PM',
      amount: '₹3,200',
      amountLabel: 'Estimated',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdRgiKPIYo_0LUNUKA6AO2wyLprd267NTizkC8aozhHyVOTceEehVDdIsjlgkGzxtMLX_BzzTa0xSBz2rA52V-JyPBhrV7p4fIyDYWoDa93jMqrKErxcolrXEZ5pPs4K46NGwq-ogSXLnM6VTw-Klw2vpv825TXGT-b62WjYGd3gI-rXTp-lZk3KapMjQOm0adAtHJ4nf_zxQyTO3Zj31-VGa9U7facqsj8ECw_-cGIXGWd8_XqUkJiAh5W71RxSZokhuHIbEd55GK',
    },
    {
      id: 3,
      name: 'Rajbir Mann',
      location: 'Phagwara, Punjab',
      status: 'Completed',
      date: '22 Oct 2024, 09:15 AM',
      amount: '₹5,150',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD11w7bWIm396zDOMzjuXr_PLv1TxlfdIfAjrfwrEhzl8Kp6X0dbextXgg0FRdsNJSwvlLWBhPkcD2fV4Y-VH3rPILat4TVqtkyMmFdESKVXZExOdjaBSNOjn1wg19kj10kviGUyVz9H6_SJFZUPl-9ZqjPCvDV5INmIt1ETnaJIsk3fpER24X89jA1BylFZzlXYxS7n0knAzeZUXz_cHc4t7-6aAcdfRX1BoA8F-4HqsGW2IHOgLZAFB5NaQ2lbGghw5r1rEpqtqo-',
    }
  ];

  const filteredBookings = activeFilter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

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
            {filteredBookings.map((booking) => {
              const isCompleted = booking.status === 'Completed';
              return (
                <TouchableOpacity 
                  key={booking.id}
                  onPress={() => router.push('/navigation')}
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
                          <Text className="text-sm font-medium text-on-surface-variant">{booking.location}</Text>
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
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
