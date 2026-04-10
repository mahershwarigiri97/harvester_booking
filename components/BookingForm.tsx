import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { DatePicker } from './DatePicker';

const PLATFORM_FEE = 150;

export interface BookingFormData {
  customer_name: string;
  customer_phone: string;
  crop_type: string;
  land_area: number;
  price: number;
  start_time?: string;
}

interface BookingFormProps {
  harvester: any;
  pricePerAcre?: number;
  initialName?: string;
  initialPhone?: string;
  onFormChange?: (data: BookingFormData) => void;
}

export function BookingForm({
  harvester,
  pricePerAcre = 2400,
  initialName = '',
  initialPhone = '',
  onFormChange,
}: BookingFormProps) {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [cropType, setCropType] = useState('Wheat');
  const [landSize, setLandSize] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const acres = parseFloat(landSize) || 0;
  const baseAmount = pricePerAcre * acres;
  const total = baseAmount + PLATFORM_FEE;

  const notifyParent = (updates: Partial<{ name: string; phone: string; cropType: string; landSize: string; date: Date | null }>) => {
    const n = updates.name ?? name;
    const p = updates.phone ?? phone;
    const c = updates.cropType ?? cropType;
    const l = updates.landSize ?? landSize;
    const d = updates.date !== undefined ? updates.date : selectedDate;
    const a = parseFloat(l) || 0;
    const tVal = pricePerAcre * a + PLATFORM_FEE;
    onFormChange?.({
      customer_name: n,
      customer_phone: p,
      crop_type: c,
      land_area: a,
      price: tVal,
      start_time: d?.toISOString(),
    });
  };

  const CROPS = [
    { key: 'Wheat', label: t('crops.wheat') },
    { key: 'Rice', label: t('crops.rice') },
    { key: 'Mustard', label: t('crops.mustard') },
    { key: 'Soybean', label: t('crops.soybean') },
    { key: 'Maize', label: t('crops.maize') },
    { key: 'Other', label: t('crops.other') }
  ];

  return (
    <View style={{ gap: 24 }}>
      {/* ── Machine Summary Card ── */}
      <View
        className="bg-white rounded-[2rem] p-4 flex-col gap-4 border border-[#e3e3de]"
        style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20 }}
      >
        <View className="h-40 rounded-2xl overflow-hidden relative">
          <Image source={{ uri: harvester.image }} className="w-full h-full" resizeMode="cover" />
          <View className="absolute top-2 left-2 bg-[#fcab28] px-3 py-1 rounded-full">
            <Text className="text-[10px] font-bold text-[#694300] tracking-wider uppercase">{t('bookings.process.selected')}</Text>
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

      {/* ── Customer Name ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 items-center justify-center">
            <MaterialIcons name="person" size={24} color="#0d631b" />
          </View>
          <View>
            <Text className="text-lg font-bold text-[#1a1c19] font-headline">{t('bookings.process.nameLabel')}</Text>
            <Text className="text-sm text-[#40493d]">{t('bookings.process.nameHint')}</Text>
          </View>
        </View>
        <TextInput
          placeholder="e.g. Harpreet Singh"
          placeholderTextColor="#707a6c"
          value={name}
          onChangeText={(text) => { setName(text); notifyParent({ name: text }); }}
          className="w-full h-16 bg-[#e3e3de] rounded-2xl px-6 text-lg font-bold text-[#1a1c19]"
          style={{ outlineStyle: 'none' } as any}
        />
      </View>

      {/* ── Customer Phone ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 items-center justify-center">
            <MaterialIcons name="phone" size={24} color="#0d631b" />
          </View>
          <View>
            <Text className="text-lg font-bold text-[#1a1c19] font-headline">{t('bookings.process.phoneLabel')}</Text>
            <Text className="text-sm text-[#40493d]">{t('bookings.process.phoneHint')}</Text>
          </View>
        </View>
        <View className="flex-row items-center bg-[#e3e3de] rounded-2xl px-4 h-16">
          <Text className="font-bold text-[#40493d] text-lg mr-3">+91</Text>
          <View className="w-[1px] h-6 bg-[#bfcaba] mr-3" />
          <TextInput
            placeholder="00000 00000"
            placeholderTextColor="#707a6c"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={(text) => { setPhone(text.replace(/[^0-9]/g, '')); notifyParent({ phone: text }); }}
            className="flex-1 text-lg font-bold text-[#1a1c19]"
            style={{ outlineStyle: 'none' } as any}
          />
        </View>
      </View>

      {/* ── Crop Type ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 items-center justify-center">
            <MaterialIcons name="grass" size={24} color="#0d631b" />
          </View>
          <View>
            <Text className="text-lg font-bold text-[#1a1c19] font-headline">{t('bookings.process.cropLabel')}</Text>
            <Text className="text-sm text-[#40493d]">{t('bookings.process.cropHint')}</Text>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-3">
          {CROPS.map(crop => (
            <TouchableOpacity
              key={crop.key}
              activeOpacity={0.7}
              onPress={() => { setCropType(crop.key); notifyParent({ cropType: crop.key }); }}
              className={`px-5 py-3 rounded-2xl border ${cropType === crop.key ? 'bg-[#0d631b] border-[#0d631b]' : 'bg-[#e3e3de] border-transparent'}`}
            >
              <Text className={`font-bold text-sm ${cropType === crop.key ? 'text-white' : 'text-[#1a1c19]'}`}>{crop.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Harvest Date ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 items-center justify-center">
            <MaterialIcons name="calendar-today" size={24} color="#0d631b" />
          </View>
          <View>
            <Text className="text-lg font-bold text-[#1a1c19] font-headline">{t('bookings.process.dateLabel')}</Text>
            <Text className="text-sm text-[#40493d]">{t('bookings.process.dateHint')}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowDatePicker(true)}
          className="w-full h-20 bg-[#e3e3de] rounded-2xl px-6 flex-row items-center justify-between"
        >
          <Text className={`text-2xl font-bold ${selectedDate ? 'text-[#1a1c19]' : 'text-[#707a6c]'}`}>
            {selectedDate ? selectedDate.toLocaleDateString(i18n.language === 'mr' ? 'mr-IN' : 'en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : t('bookings.process.selectDate')}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#707a6c" />
        </TouchableOpacity>
      </View>

      {/* ── Date Picker Modal ── */}
      <Modal visible={showDatePicker} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setShowDatePicker(false)}>
        <Pressable className="flex-1 justify-center items-center bg-black/40 px-3 absolute inset-0" onPress={() => setShowDatePicker(false)}>
          <Pressable className="w-full max-w-lg" onPress={(e) => e.stopPropagation()}>
            <DatePicker
              pricePerAcre={pricePerAcre}
              selectedDate={selectedDate}
              disablePreviousDates={true}
              onSelectDate={(date) => {
                setSelectedDate(date);
                notifyParent({ date });
                setShowDatePicker(false);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Land Size ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8">
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 items-center justify-center">
            <MaterialIcons name="straighten" size={24} color="#0d631b" />
          </View>
          <View>
            <Text className="text-lg font-bold text-[#1a1c19] font-headline">{t('bookings.process.landLabel')}</Text>
            <Text className="text-sm text-[#40493d]">{t('bookings.process.landHint')}</Text>
          </View>
        </View>
        <View className="relative">
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#707a6c"
            keyboardType="decimal-pad"
            value={landSize}
            onChangeText={(text) => { setLandSize(text); notifyParent({ landSize: text }); }}
            className="w-full h-20 bg-[#e3e3de] rounded-2xl px-8 text-3xl font-bold text-[#1a1c19]"
            style={{ outlineStyle: 'none' } as any}
          />
          <View className="absolute right-8 top-0 bottom-0 justify-center">
            <Text className="text-lg font-bold text-[#40493d]">{t('bookings.process.acres')}</Text>
          </View>
        </View>
        <View className="mt-6 flex-row flex-wrap gap-3">
          {['5', '10', '25'].map(val => (
            <TouchableOpacity
              key={val}
              activeOpacity={0.7}
              className="px-5 py-2.5 rounded-xl bg-[#e3e3de]"
              onPress={() => { setLandSize(val); notifyParent({ landSize: val }); }}
            >
              <Text className="text-sm font-semibold text-[#1a1c19]">{val} {t('bookings.process.acres').toLowerCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Price Breakdown ── */}
      <View className="bg-[#f4f4ef] rounded-[2rem] p-8 overflow-hidden relative">
        <Text className="text-lg font-bold text-[#1a1c19] font-headline mb-6">{t('bookings.process.paymentTitle')}</Text>
        <View style={{ gap: 16 }}>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#40493d]">{t('bookings.process.baseRate')}</Text>
              <Text className="text-xs text-[#707a6c]">(₹{pricePerAcre.toLocaleString()} × {acres} {t('common.acre')})</Text>
            </View>
            <Text className="font-bold text-[#1a1c19]">₹ {baseAmount.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-[#40493d]">{t('bookings.process.platformFee')}</Text>
              <MaterialIcons name="info-outline" size={16} color="#707a6c" />
            </View>
            <Text className="font-bold text-[#1a1c19]">₹ {PLATFORM_FEE}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[#40493d]">{t('bookings.process.insurance')}</Text>
            <Text className="font-bold text-[#0d631b]">FREE</Text>
          </View>
          <View className="h-[1px] bg-[#bfcaba]/30 my-2" />
          <View className="flex-row justify-between items-end pt-2">
            <View>
              <Text className="text-sm font-bold text-[#40493d] uppercase tracking-widest leading-loose">{t('bookings.process.totalEstimated')}</Text>
              <Text className="text-4xl font-extrabold text-[#0d631b] font-headline">₹ {total.toLocaleString()}</Text>
            </View>
            <View className="items-end">
              <View className="bg-[#ffddb5]/50 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-[#835400]">{t('bookings.process.bestPrice')}</Text>
              </View>
              <Text className="text-xs text-[#40493d]">{t('bookings.process.taxes')}</Text>
            </View>
          </View>
        </View>
        <View className="absolute -bottom-6 -right-6 opacity-[0.03]">
          <MaterialIcons name="eco" size={180} color="#1a1c19" />
        </View>
      </View>

      {/* ── Notice ── */}
      <View className="flex-row gap-4 p-4 rounded-2xl border border-[#bfcaba]/30 bg-white/50 mb-8">
        <MaterialIcons name="verified-user" size={24} color="#fcab28" />
        <Text className="flex-1 text-xs leading-relaxed text-[#40493d]">
          {t('bookings.process.policyNotice')}
        </Text>
      </View>
    </View>
  );
}
