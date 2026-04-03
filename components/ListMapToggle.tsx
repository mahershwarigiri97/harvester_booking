import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ToggleProps {
  viewMode: 'list' | 'map';
  onToggle: (mode: 'list' | 'map') => void;
}

export function ListMapToggle({ viewMode, onToggle }: ToggleProps) {
  return (
    <View className="flex-row justify-center my-4">
      <View className="bg-surface-container-low p-1 rounded-full flex-row w-full max-w-xs">
        <TouchableOpacity 
          className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-surface-container-lowest shadow-sm' : ''}`}
          onPress={() => onToggle('list')}
          style={{ outlineStyle: 'none' } as any}
        >
          <MaterialIcons name="format-list-bulleted" size={20} color={viewMode === 'list' ? '#0d631b' : '#40493d'} />
          <Text className={`font-bold ${viewMode === 'list' ? 'text-primary' : 'text-on-surface-variant'}`}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-full transition-all ${viewMode === 'map' ? 'bg-surface-container-lowest shadow-sm' : ''}`}
          onPress={() => onToggle('map')}
          style={{ outlineStyle: 'none' } as any}
        >
          <MaterialIcons name="map" size={20} color={viewMode === 'map' ? '#0d631b' : '#40493d'} />
          <Text className={`font-bold ${viewMode === 'map' ? 'text-primary' : 'text-on-surface-variant'}`}>Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
