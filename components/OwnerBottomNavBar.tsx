import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function OwnerBottomNavBar({ state, descriptors, navigation }: any) {
  return (
    <View 
      className="absolute bottom-0 left-0 right-0 w-full flex-row justify-around items-center px-4 pt-3 pb-6 bg-white dark:bg-[#1a1c19] rounded-t-3xl z-50 elevation-5"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 24,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: any = 'home';
        let label = 'Home';
        
        // mapping routes based on layout
        if (route.name === 'dashboard' || route.name === 'dashboard/index') {
            iconName = 'home-max';
            label = 'Home';
        } else if (route.name === 'index') {
          iconName = 'home-max';
          label = 'Home';
        } else if (route.name === 'bookings' || route.name === 'machines') {
          iconName = 'agriculture';
          label = 'Bookings';
        } else if (route.name === 'earnings') {
          iconName = 'payments';
          label = 'Earnings';
        } else if (route.name === 'profile') {
          iconName = 'person';
          label = 'Profile';
        }

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.88}
            onPress={onPress}
            style={{ outlineStyle: 'none' } as any}
            className={`flex flex-col items-center justify-center px-5 py-2 ${
              isFocused 
                ? 'bg-[#2e7d32]/10 dark:bg-[#2e7d32]/20 rounded-2xl' 
                : 'bg-transparent'
            }`}
          >
            <MaterialIcons 
              name={iconName} 
              size={24} 
              color={isFocused ? '#0d631b' : '#444941'} 
            />
            <Text 
              className={`font-['Inter'] text-xs font-semibold tracking-wide ${
                isFocused ? 'text-[#0d631b] dark:text-[#4caf50]' : 'text-[#444941] dark:text-[#c4c8ba]'
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
