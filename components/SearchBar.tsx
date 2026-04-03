import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function SearchBar() {
  return (
    <View className="bg-surface-container-highest rounded-3xl p-2 flex-row items-center shadow-inner mt-2">
      <View className="flex-1 flex-row items-center px-4 gap-3">
        <MaterialIcons name="search" size={24} color="#bfcaba" />
        <TextInput 
          className="flex-1 font-body text-lg py-3 text-on-surface"
          placeholder="Search for harvesters..."
          placeholderTextColor="#bfcaba"
          style={{ outlineStyle: 'none' } as any}
        />
      </View>
      <TouchableOpacity className="bg-primary p-3 rounded-2xl flex items-center justify-center active:scale-95">
        <MaterialIcons name="tune" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
