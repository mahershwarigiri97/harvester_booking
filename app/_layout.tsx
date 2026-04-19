import { Inter_400Regular } from '@expo-google-fonts/inter';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { initI18n } from '../i18n';
import { useAuthStore } from '../utils/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(farmer)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
import { useNotifications } from '../hooks/useNotifications';

SplashScreen.preventAutoHideAsync();

function StackLayout() {
  const colorScheme = useColorScheme();
  useNotifications();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(farmer)" />
        <Stack.Screen name="(owner)" />
        <Stack.Screen name="details/[id]" />
        <Stack.Screen name="role" />
        <Stack.Screen name="owner-registration" />
        <Stack.Screen name="track/[id]" />
        <Stack.Screen name="navigation" />
        <Stack.Screen name="work_tracker" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);

  const [loaded, error] = useFonts({
    'Plus Jakarta Sans': PlusJakartaSans_700Bold,
    'Inter': Inter_400Regular,
  });

  useEffect(() => {
    const init = async () => {
      // 1. Initialize i18n from storage
      await initI18n();

      // 2. Load auth session
      // await useAuthStore.getState().clearAuth();
      await useAuthStore.getState().loadAuth();

      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    };
    init();
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StackLayout />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
