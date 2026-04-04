import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'owner' | null>(null);

  const handleContinue = () => {
    if (selectedRole === 'owner') {
      router.replace('/(owner)' as any);
    } else if (selectedRole === 'farmer') {
      router.replace('/(farmer)' as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafaf5' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 48 }}>
        {/* Roles */}
        <View style={{ gap: 24 }}>

          {/* Farmer Card */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setSelectedRole('farmer')}
            style={[
              { backgroundColor: '#ffffff', borderRadius: 32, padding: 32, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 24, overflow: 'hidden' },
              selectedRole === 'farmer' ? { borderWidth: 4, borderColor: '#0d631b' } : { borderWidth: 4, borderColor: 'transparent' }
            ]}
          >
            {/* Background Icon */}
            <View style={{ position: 'absolute', top: 24, right: 24, opacity: 0.05 }}>
              <MaterialIcons name="agriculture" size={120} color="#0d631b" />
            </View>

            <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#cbe6cb', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <MaterialIcons name="eco" size={36} color="#005312" />
            </View>

            <Text style={{ fontFamily: 'headline', fontSize: 26, fontWeight: 'bold', color: '#0d631b', marginBottom: 12 }}>Farmer</Text>
            <Text style={{ fontSize: 16, color: '#40493d', lineHeight: 24, marginBottom: 32 }}>
              Book harvesters and manage your crops with ease. Access modern machinery for your fields.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#0d631b', marginRight: 8 }}>Select Role</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#0d631b" />
            </View>
          </TouchableOpacity>

          {/* Owner Card */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setSelectedRole('owner')}
            style={[
              { backgroundColor: '#ffffff', borderRadius: 32, padding: 32, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 24, overflow: 'hidden' },
              selectedRole === 'owner' ? { borderWidth: 4, borderColor: '#fcab28' } : { borderWidth: 4, borderColor: 'transparent' }
            ]}
          >
            {/* Background Icon */}
            <View style={{ position: 'absolute', top: 24, right: 24, opacity: 0.05 }}>
              <MaterialIcons name="settings-input-component" size={120} color="#835400" />
            </View>

            <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#ffddb5', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <MaterialIcons name="precision-manufacturing" size={36} color="#694300" />
            </View>

            <Text style={{ fontFamily: 'headline', fontSize: 26, fontWeight: 'bold', color: '#835400', marginBottom: 12 }}>Harvester Owner</Text>
            <Text style={{ fontSize: 16, color: '#40493d', lineHeight: 24, marginBottom: 32 }}>
              Register your machines and manage bookings. Grow your business by reaching more farmers.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#835400', marginRight: 8 }}>Select Role</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#835400" />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Fixed Bottom Action Container */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', backgroundColor: '#fafaf5' }}>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={!selectedRole}
          onPress={handleContinue}
          style={[
            { width: '100%', height: 64, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
            selectedRole ? { backgroundColor: '#0d631b', shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 } : { backgroundColor: '#e8e8e3' }
          ]}
        >
          <Text style={{ fontFamily: 'headline', fontSize: 20, fontWeight: 'bold', color: selectedRole ? '#ffffff' : '#707a6c' }}>
            Continue
          </Text>
          {!selectedRole && <MaterialIcons name="lock" size={20} color="#707a6c" />}
        </TouchableOpacity>
        <Text style={{ marginTop: 12, fontSize: 13, color: '#707a6c', fontWeight: '500', textAlign: 'center' }}>
          {selectedRole ? 'Press continue to enter Harvester Hub' : 'Please select a role to proceed'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
