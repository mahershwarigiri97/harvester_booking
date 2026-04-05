import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../utils/api';
import { getBookingStatusInfo } from '../../utils/bookingHelpers';

export default function BookingStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const { data: response, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => authApi.getBookingById(id as string),
    enabled: !!id,
    refetchInterval: 3000,
  });

  const { data: trackingResponse } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => authApi.getBookingTracking(id as string),
    enabled: !!id,
    refetchInterval: 3000,
  });

  const booking = response?.data?.data;
  const trackingData = trackingResponse?.data?.data || [];

  const timelineSteps = [
    { key: 'requested', icon: 'pending-actions', title: 'Requested', desc: 'Booking sent to owner' },
    { key: 'accepted', icon: 'check-circle', title: 'Confirmed', desc: 'Harvester owner accepted' },
    { key: 'on_the_way', icon: 'local-shipping', title: 'On the Way', desc: 'Harvester is en route' },
    { key: 'arrived', icon: 'place', title: 'Arrived', desc: 'Harvester at location' },
    { key: 'in_progress', icon: 'precision-manufacturing', title: 'Working', desc: 'Harvesting in progress' },
    { key: 'completed', icon: 'task-alt', title: 'Completed', desc: 'Work finished' },
  ];

  const currentStepIndex = timelineSteps.findIndex(s => s.key === booking?.status);
  const activeLineHeight = currentStepIndex >= 0 ? `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` : '0%';

  return (
    <View style={{ flex: 1, backgroundColor: '#fafaf5' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* TopAppBar */}
      <View style={{ paddingTop: insets.top, backgroundColor: 'rgba(250, 250, 245, 0.6)', zIndex: 50 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, height: 64 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, borderRadius: 20 }}>
              <MaterialIcons name="arrow-back" size={24} color="#0d631b" />
            </TouchableOpacity>
            <MaterialIcons name="location-pin" size={24} color="#0d631b" />
            <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 18, color: '#0d631b', letterSpacing: -0.5 }}>
              Harvester Hub
            </Text>
          </View>
          <TouchableOpacity style={{ padding: 8, borderRadius: 20, backgroundColor: '#f4f4ef' }}>
            <MaterialIcons name="notifications" size={24} color="#43493e" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}>
        {isLoading || !booking ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
            <ActivityIndicator size="large" color="#0d631b" />
          </View>
        ) : (
          <View>
            {/* Hero Status Card */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 32, padding: 24, marginBottom: 32, overflow: 'hidden', position: 'relative', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }}>
              <View style={{ zIndex: 10 }}>
                <View style={{ backgroundColor: getBookingStatusInfo(booking.status).hexBg, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 16 }}>
                  <Text style={{ color: getBookingStatusInfo(booking.status).hexColor, fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Live Status</Text>
                </View>
                <Text style={{ fontFamily: 'headline', fontSize: 30, fontWeight: '900', color: '#0d631b', marginBottom: 8 }}>{getBookingStatusInfo(booking.status).text}</Text>
                <Text style={{ color: '#40493d', fontWeight: '600', marginBottom: 24 }}>Booked with {booking.owner?.name || 'Owner'}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#f4f4ef', padding: 16, borderRadius: 16 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#a3f69c', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="agriculture" size={24} color="#005312" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1c19' }}>{booking.harvester?.brand} {booking.harvester?.model}</Text>
                    <Text style={{ fontSize: 12, color: '#40493d', marginTop: 2 }}>Operated by: {booking.harvester?.brand ? 'Certified Pro' : 'N/A'}</Text>
                  </View>
                </View>
              </View>

              <View style={{ position: 'absolute', right: -32, bottom: -32, opacity: 0.05 }}>
                <MaterialIcons name={getBookingStatusInfo(booking.status).icon as any} size={160} color="#0d631b" />
              </View>
            </View>

            {/* Cancellation Notice (Only if accepted earlier) */}
            {booking.status === 'cancelled' && trackingData.some((t: any) => t.status === 'accepted') && (
              <View 
                style={{ 
                  backgroundColor: '#fee2e2', 
                  borderRadius: 24, 
                  padding: 24, 
                  marginBottom: 32, 
                  borderWidth: 1, 
                  borderColor: '#ef4444',
                  flexDirection: 'row',
                  gap: 16
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="cancel" size={24} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#991b1b', marginBottom: 4 }}>Booking Cancelled</Text>
                  <Text style={{ fontSize: 14, color: '#b91c1c', fontWeight: '600' }}>Reason: {booking.cancel_reason || 'No reason provided'}</Text>
                  <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Cancelled by {booking.updated_by_user === 'owner' ? 'Harvester Owner' : 'Farmer'}</Text>
                </View>
              </View>
            )}

            {/* Booking Timeline */}
            <View style={{ backgroundColor: '#f4f4ef', borderRadius: 40, padding: 32, marginBottom: 32 }}>
              <Text style={{ fontFamily: 'headline', fontSize: 20, color: '#0d631b', fontWeight: 'bold', marginBottom: 32 }}>Harvest Progress</Text>

              <View style={{ position: 'relative' }}>
                {/* Vertical Line Background */}
                <View style={{ position: 'absolute', left: 20, top: 16, bottom: 16, width: 8, backgroundColor: '#e8e8e3', borderRadius: 4 }} />
                {/* Vertical Line Foreground (Active) */}
                <View style={{ position: 'absolute', left: 20, top: 16, height: activeLineHeight as any, width: 8, backgroundColor: '#0d631b', borderRadius: 4, zIndex: 10 }} />

                {timelineSteps.map((step, index) => {
                  const isPast = currentStepIndex > index;
                  const isCurrent = currentStepIndex === index;
                  const isFuture = currentStepIndex < index && booking.status !== 'cancelled';
                  const isCancelled = booking.status === 'cancelled';

                  const trackRecord = trackingData.find((t: any) => t.status === step.key);
                  const timeString = trackRecord ? `${new Date(trackRecord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(trackRecord.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : '';

                  let bgColor = '#e3e3de'; // Future
                  let iconColor = '#707a6c';
                  if (isPast) {
                    bgColor = '#0d631b';
                    iconColor = '#fff';
                  } else if (isCurrent) {
                    bgColor = '#fcab28';
                  } else if (isCancelled) {
                    bgColor = '#fee2e2';
                    iconColor = '#ba1a1a';
                  }

                  return (
                    <View key={step.key} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24, paddingBottom: index === timelineSteps.length - 1 ? 0 : 40, zIndex: 20 }}>
                      <View style={{ 
                        width: 48, height: 48, borderRadius: 24, 
                        backgroundColor: bgColor, 
                        alignItems: 'center', justifyContent: 'center', 
                        ...(isCurrent ? { borderWidth: 4, borderColor: '#fff', elevation: 4, shadowColor: '#fcab28', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {}),
                        ...(isPast ? { elevation: 4, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 } : {})
                      }}>
                        {isCurrent ? (
                          <MaterialIcons name={step.icon as any} size={20} color="#694300" />
                        ) : (
                          <MaterialIcons name={isCancelled && isCurrent ? 'cancel' : step.icon as any} size={24} color={iconColor} />
                        )}
                      </View>
                      <View style={{ paddingTop: 4, flex: 1 }}>
                        <Text style={{ 
                          fontSize: 18, fontWeight: 'bold', 
                          color: isCurrent ? '#0d631b' : (isPast ? '#1a1c19' : '#707a6c'), 
                          lineHeight: 22 
                        }}>
                          {step.title}
                        </Text>
                        <Text style={{ fontSize: 14, color: isFuture ? '#bfcaba' : '#40493d', marginTop: 4 }}>
                          {timeString || step.desc}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Action Card */}
            <View style={{ gap: 16, marginBottom: 32 }}>
              <TouchableOpacity onPress={() => {/* call action logic placeholder */}} activeOpacity={0.88} style={{ borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}>
                <LinearGradient colors={['#0d631b', '#2e7d32']} style={{ height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <MaterialIcons name="call" size={24} color="#fff" />
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Contact Owner ({booking.owner?.phone || 'Loading'})</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.88} style={{ height: 64, borderRadius: 16, backgroundColor: '#e8e8e3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <MaterialIcons name="map" size={24} color="#1a1c19" />
                <Text style={{ color: '#1a1c19', fontWeight: 'bold', fontSize: 18 }}>View Address Location</Text>
              </TouchableOpacity>
            </View>

            {/* Order Summary Bento */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#ffffff', padding: 20, borderRadius: 24, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#40493d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Area</Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#0d631b' }}>{booking.land_area} Ac</Text>
              </View>
              <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#ffffff', padding: 20, borderRadius: 24, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#40493d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Est. Cost</Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#835400' }}>₹{booking.price?.toLocaleString() || '0'}</Text>
              </View>
              <View style={{ width: '100%', backgroundColor: '#ffffff', padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 }}>
                <View>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#40493d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Crop Type</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1c19' }}>{booking.crop_type || 'General Crop'}</Text>
                </View>
                <View style={{ width: 48, height: 48, backgroundColor: '#ffdbcf', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="eco" size={24} color="#993300" />
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
