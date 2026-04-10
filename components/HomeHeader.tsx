import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function HomeHeader({ location, title }: { location: string; title?: string }) {
  return (
    <View className="w-full z-50 pt-16 pb-4 px-6 bg-[#fafaf5]/90 border-b border-surface-container-high/50">
      <View className="flex-row items-center justify-between w-full max-w-screen-xl mx-auto">
        <View className="flex-row items-center gap-2 flex-1">
          {title ? (
            <Text className="font-headline font-extrabold text-2xl tracking-tighter text-primary">
              {title}
            </Text>
          ) : (
            <>
              <MaterialIcons name="location-on" size={24} color="#0d631b" />
              <View className="flex-1">
                <Text className="font-headline font-bold text-lg tracking-tight text-primary leading-tight" numberOfLines={1}>
                  {location}
                </Text>
              </View>
            </>
          )}
        </View>
        
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95">
            <MaterialIcons name="notifications-none" size={24} color="#43493e" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
