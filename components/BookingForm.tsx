import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DatePicker } from './DatePicker';

const PLATFORM_FEE = 150;

export function BookingForm({ harvester, pricePerAcre = 2400 }: { harvester: any, pricePerAcre?: number }) {
  const [landSize, setLandSize] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const acres = parseFloat(landSize) || 0;
  const total = pricePerAcre * acres + PLATFORM_FEE;
  
  return (
    <View style={{ gap: 24 }}>
      {/* ── Machine Summary Card ── */}
      <View
        className="bg-white rounded-[2rem] p-4 flex-col gap-4 border border-[#e3e3de]"
        style={{
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.03,
          shadowRadius: 20,
        }}
      >
        <View className="h-40 rounded-2xl overflow-hidden relative">
          <Image source={{ uri: harvester.image }} className="w-full h-full" resizeMode="cover" />
          <View className="absolute top-2 left-2 bg-[#fcab28] px-3 py-1 rounded-full">
            <Text className="text-[10px] font-bold text-[#694300] tracking-wider uppercase">Selected</Text>
          </View>
        </View>
        <View className="px-1 flex-1">
          <Text className="text-2xl font-bold text-[#1a1c19] font-headline">{harvester.name}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <MaterialIcons name="stars" size={16} color="#0d631b" />
            <Text className="text-[#40493d]">Premium Performance Series</Text>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-4">
            <View className="bg-[#eeeee9] px-3 py-1.5 rounded-xl"><Text className="text-xs font-semibold text-[#40493d]">450 HP</Text></View>
            <View className="bg-[#eeeee9] px-3 py-1.5 rounded-xl"><Text className="text-xs font-semibold text-[#40493d]">12.5m Header</Text></View>
            <View className="bg-[#eeeee9] px-3 py-1.5 rounded-xl"><Text className="text-xs font-semibold text-[#40493d]">GPS Guided</Text></View>
          </View>
        </View>
      </View>

      {/* ── Select Date (Integrated gracefully) ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 items-center justify-center">
            <MaterialIcons name="calendar-today" size={24} color="#0d631b" />
          </View>
          <View>
            <Text className="text-lg font-bold text-[#1a1c19] font-headline">Harvest Date</Text>
            <Text className="text-sm text-[#40493d]">When do you need the machine?</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowDatePicker(true)}
          className="w-full h-20 bg-[#e3e3de] rounded-2xl px-6 flex-row items-center justify-between"
        >
          <Text className={`text-2xl font-bold ${selectedDate ? 'text-[#1a1c19]' : 'text-[#707a6c]'}`}>
            {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Date Picker Modal ── */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/40 px-3 absolute inset-0"
          onPress={() => setShowDatePicker(false)}
        >
          <Pressable className="w-full max-w-lg" onPress={(e) => e.stopPropagation()}>
            <DatePicker 
              pricePerAcre={pricePerAcre}
              selectedDate={selectedDate}
              disablePreviousDates={true}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setShowDatePicker(false);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Land Size Input ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 items-center justify-center">
            <MaterialIcons name="straighten" size={24} color="#0d631b" />
          </View>
          <View>
            <Text className="text-lg font-bold text-[#1a1c19] font-headline">Land Size</Text>
            <Text className="text-sm text-[#40493d]">Enter your total harvest area</Text>
          </View>
        </View>
        <View className="relative">
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#707a6c"
            keyboardType="decimal-pad"
            value={landSize}
            onChangeText={setLandSize}
            className="w-full h-20 bg-[#e3e3de] rounded-2xl px-8 text-3xl font-bold text-[#1a1c19]"
            style={{ outlineStyle: 'none' } as any}
          />
          <View className="absolute right-8 top-0 bottom-0 justify-center">
            <Text className="text-lg font-bold text-[#40493d]">acres</Text>
          </View>
        </View>
        <View className="mt-6 flex-row flex-wrap gap-3">
          {['5', '10', '25'].map(val => (
            <TouchableOpacity 
              key={val}
              activeOpacity={0.7}
              className="px-5 py-2.5 rounded-xl bg-[#e3e3de]"
              onPress={() => setLandSize(val)}
            >
              <Text className="text-sm font-semibold text-[#1a1c19]">{val} acres</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity activeOpacity={0.7} className="px-5 py-2.5 rounded-xl bg-[#e3e3de]">
            <Text className="text-sm font-semibold text-[#1a1c19]">Custom</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Price Breakdown Section ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8 overflow-hidden relative">
        <Text className="text-lg font-bold text-[#1a1c19] font-headline mb-6">Payment Summary</Text>
        <View style={{ gap: 16 }}>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#40493d]">Base Rate</Text>
              <Text className="text-xs text-[#707a6c]">(₹{pricePerAcre.toLocaleString()} × acre)</Text>
            </View>
            <Text className="font-bold text-[#1a1c19]">₹ {(pricePerAcre * acres).toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#40493d]">Platform Fee</Text>
              <MaterialIcons name="info-outline" size={16} color="#707a6c" />
            </View>
            <Text className="font-bold text-[#1a1c19]">₹ {PLATFORM_FEE}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[#40493d]">Insurance Cover</Text>
            <Text className="font-bold text-[#0d631b]">FREE</Text>
          </View>
          
          <View className="h-[1px] bg-[#bfcaba]/30 my-2" />
          
          <View className="flex-row justify-between items-end pt-2">
            <View>
              <Text className="text-sm font-bold text-[#40493d] uppercase tracking-widest leading-loose">Total Estimated</Text>
              <Text className="text-4xl font-extrabold text-[#0d631b] font-headline">₹ {total.toLocaleString()}</Text>
            </View>
            <View className="items-end">
              <View className="bg-[#ffddb5]/50 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-[#835400]">BEST PRICE</Text>
              </View>
              <Text className="text-xs text-[#40493d]">Incl. all taxes</Text>
            </View>
          </View>
        </View>
        <View className="absolute -bottom-6 -right-6 opacity-[0.03]">
          <MaterialIcons name="eco" size={180} color="#1a1c19" />
        </View>
      </View>

      {/* ── Important Info Notice ── */}
      <View className="flex-row gap-4 p-4 rounded-2xl border border-[#bfcaba]/30 bg-white/50 mb-8">
        <MaterialIcons name="verified-user" size={24} color="#fcab28" />
        <Text className="flex-1 text-xs leading-relaxed text-[#40493d]">
          By booking, you agree to our <Text className="font-bold">Fair Crop Policy</Text>. The operator will reach your location within 24 hours of the scheduled time. Payments are held in escrow until completion.
        </Text>
      </View>
    </View>
  );
}
