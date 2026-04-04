import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeHeader } from '../../components/HomeHeader';
import { SearchBar } from '../../components/SearchBar';
import { ListMapToggle } from '../../components/ListMapToggle';
import { ListingCard } from '../../components/ListingCard';
import { SmallListingCard } from '../../components/SmallListingCard';
import { HARVESTERS } from '../../constants/harvesterData';

const mockData = HARVESTERS.filter(h => !h.isNew);
const newArrival = HARVESTERS.find(h => h.isNew)!;

export default function HomeScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <HomeHeader location="Punjab, IN" />
      
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <SearchBar />
        <ListMapToggle viewMode={viewMode} onToggle={setViewMode} />
        
        {viewMode === 'list' ? (
          <View className="pt-2">
            <View className="flex-row items-baseline justify-between mb-4">
              <Text className="text-2xl font-headline font-extrabold text-primary tracking-tight">Available Near You</Text>
              <Text className="text-sm font-bold text-secondary">24 Units</Text>
            </View>
            
            {mockData.map(item => (
              <ListingCard key={item.id} {...item} />
            ))}
            
            <SmallListingCard {...newArrival} />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <MaterialIcons name="map" size={64} color="#bfcaba" />
            <Text className="text-on-surface-variant mt-4 font-bold text-lg">Map view coming soon...</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-28 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center active:scale-95 z-40"
        style={{ shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
