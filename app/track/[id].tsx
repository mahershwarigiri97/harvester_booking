import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookingStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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

        {/* Hero Status Card */}
        <View style={{ backgroundColor: '#ffffff', borderRadius: 32, padding: 24, marginBottom: 32, overflow: 'hidden', position: 'relative', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }}>
          <View style={{ zIndex: 10 }}>
            <View style={{ backgroundColor: '#fcab28', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 16 }}>
              <Text style={{ color: '#643f00', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Live Status</Text>
            </View>
            <Text style={{ fontFamily: 'headline', fontSize: 30, fontWeight: '900', color: '#0d631b', marginBottom: 8 }}>Harvester on the Way</Text>
            <Text style={{ color: '#40493d', fontWeight: '600', marginBottom: 24 }}>Estimated arrival in 45 mins</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#f4f4ef', padding: 16, borderRadius: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#a3f69c', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="agriculture" size={24} color="#005312" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1a1c19' }}>John's Mahindra Novo</Text>
                <Text style={{ fontSize: 12, color: '#40493d', marginTop: 2 }}>License: PB-10-CH-2024</Text>
              </View>
            </View>
          </View>

          <View style={{ position: 'absolute', right: -32, bottom: -32, opacity: 0.05 }}>
            <MaterialIcons name="local-shipping" size={160} color="#0d631b" />
          </View>
        </View>

        {/* Booking Timeline */}
        <View style={{ backgroundColor: '#f4f4ef', borderRadius: 40, padding: 32, marginBottom: 32 }}>
          <Text style={{ fontFamily: 'headline', fontSize: 20, color: '#0d631b', fontWeight: 'bold', marginBottom: 32 }}>Harvest Progress</Text>

          <View style={{ position: 'relative' }}>
            {/* Vertical Line Background */}
            <View style={{ position: 'absolute', left: 20, top: 16, bottom: 16, width: 8, backgroundColor: '#e8e8e3', borderRadius: 4 }} />
            {/* Vertical Line Foreground (Active) */}
            <View style={{ position: 'absolute', left: 20, top: 16, height: '55%', width: 8, backgroundColor: '#0d631b', borderRadius: 4, zIndex: 10 }} />

            {/* Step 1: Requested */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24, paddingBottom: 40, zIndex: 20 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0d631b', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                <MaterialIcons name="pending-actions" size={24} color="#fff" />
              </View>
              <View style={{ paddingTop: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1c19', lineHeight: 22 }}>Requested</Text>
                <Text style={{ fontSize: 14, color: '#40493d', marginTop: 4 }}>Oct 24, 09:15 AM</Text>
              </View>
            </View>

            {/* Step 2: Confirmed */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24, paddingBottom: 40, zIndex: 20 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0d631b', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                <MaterialIcons name="check-circle" size={24} color="#fff" />
              </View>
              <View style={{ paddingTop: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1c19', lineHeight: 22 }}>Confirmed</Text>
                <Text style={{ fontSize: 14, color: '#40493d', marginTop: 4 }}>Oct 24, 10:30 AM</Text>
              </View>
            </View>

            {/* Step 3: On the Way (Current) */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24, paddingBottom: 40, zIndex: 20 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#fcab28', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff', elevation: 4, shadowColor: '#fcab28', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}>
                <MaterialIcons name="local-shipping" size={20} color="#694300" />
              </View>
              <View style={{ paddingTop: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0d631b', lineHeight: 22 }}>Harvester on the Way</Text>
                <Text style={{ fontSize: 14, color: '#40493d', marginTop: 4 }}>Current Stage • 2.4km away</Text>
              </View>
            </View>

            {/* Step 4: Working */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24, paddingBottom: 40, zIndex: 20 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#e3e3de', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="precision-manufacturing" size={24} color="#707a6c" />
              </View>
              <View style={{ paddingTop: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#707a6c', lineHeight: 22 }}>Working</Text>
                <Text style={{ fontSize: 14, color: '#bfcaba', marginTop: 4 }}>Pending arrival</Text>
              </View>
            </View>

            {/* Step 5: Completed */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24, zIndex: 20 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#e3e3de', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="task-alt" size={24} color="#707a6c" />
              </View>
              <View style={{ paddingTop: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#707a6c', lineHeight: 22 }}>Completed</Text>
                <Text style={{ fontSize: 14, color: '#bfcaba', marginTop: 4 }}>Estimated today, 4:00 PM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Card */}
        <View style={{ gap: 16, marginBottom: 32 }}>
          <TouchableOpacity activeOpacity={0.88} style={{ borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }}>
            <LinearGradient colors={['#0d631b', '#2e7d32']} style={{ height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <MaterialIcons name="call" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Contact Owner</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.88} style={{ height: 64, borderRadius: 16, backgroundColor: '#e8e8e3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <MaterialIcons name="map" size={24} color="#1a1c19" />
            <Text style={{ color: '#1a1c19', fontWeight: 'bold', fontSize: 18 }}>Track Live Location</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary Bento */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#ffffff', padding: 20, borderRadius: 24, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#40493d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Area</Text>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#0d631b' }}>12 Acres</Text>
          </View>
          <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#ffffff', padding: 20, borderRadius: 24, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#40493d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Est. Cost</Text>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#835400' }}>₹18,400</Text>
          </View>
          <View style={{ width: '100%', backgroundColor: '#ffffff', padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4 }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#40493d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Crop Type</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1c19' }}>Premium Basmati Rice</Text>
            </View>
            <View style={{ width: 48, height: 48, backgroundColor: '#ffdbcf', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="eco" size={24} color="#993300" />
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
