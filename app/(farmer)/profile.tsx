import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../utils/authStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await useAuthStore.getState().clearAuth();
    router.replace('/login');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
        <MaterialIcons name="person" size={40} color="#0d631b" />
      </View>
      
      <Text className="font-headline font-bold text-2xl text-on-surface mb-2">
        {user?.name || 'Farmer'}
      </Text>
      <Text className="text-on-surface-variant font-medium mb-12">
        +91 {user?.phone}
      </Text>

      <TouchableOpacity 
        onPress={handleLogout}
        className="flex-row items-center gap-3 bg-error/10 px-8 py-4 rounded-2xl"
      >
        <MaterialIcons name="logout" size={20} color="#ba1a1a" />
        <Text className="text-error font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

