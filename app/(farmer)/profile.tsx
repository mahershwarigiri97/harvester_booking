import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../utils/authStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await useAuthStore.getState().clearAuth();
    router.replace('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
        <MaterialIcons name="person" size={40} color="#0d631b" />
      </View>
      
      <Text className="font-headline font-bold text-2xl text-on-surface mb-2">
        {user?.name || t('common.profile')}
      </Text>
      <Text className="text-on-surface-variant font-medium mb-8">
        +91 {user?.phone}
      </Text>

      {/* Language Selection */}
      <View className="w-full bg-surface-container-low p-6 rounded-3xl mb-12">
        <Text className="text-xs font-bold text-primary uppercase tracking-widest mb-4 px-1">
          {t('common.language')}
        </Text>
        <View className="flex-row gap-2">
          {['en', 'hi', 'mr'].map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() => changeLanguage(lang)}
              className={`flex-1 py-3 rounded-xl items-center justify-center border ${
                i18n.language === lang 
                ? 'bg-primary border-primary' 
                : 'bg-white border-outline-variant'
              }`}
            >
              <Text className={`font-bold ${
                i18n.language === lang ? 'text-white' : 'text-on-surface'
              }`}>
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        className="flex-row items-center gap-3 bg-error/10 px-8 py-4 rounded-2xl active:scale-95"
      >
        <MaterialIcons name="logout" size={20} color="#ba1a1a" />
        <Text className="text-error font-bold text-lg">{t('auth.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}
