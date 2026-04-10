import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, StyleSheet, TextInput, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export interface CancelBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function CancelBookingModal({ visible, onClose, onConfirm, isLoading }: CancelBookingModalProps) {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');

  const REASONS = [
    { id: 'breakdown', label: t('cancel.reasons.breakdown') },
    { id: 'not_available', label: t('cancel.reasons.not_available') },
    { id: 'already_booked', label: t('cancel.reasons.already_booked') },
    { id: 'weather', label: t('cancel.reasons.weather') },
    { id: 'too_far', label: t('cancel.reasons.too_far') },
    { id: 'emergency', label: t('cancel.reasons.emergency') },
    { id: 'other', label: t('cancel.reasons.other') },
  ];

  const handleConfirm = () => {
    let finalReason = selectedReason;
    if (selectedReason === 'other') {
      finalReason = otherReason.trim() || t('cancel.reasons.other');
    } else {
      finalReason = REASONS.find(r => r.id === selectedReason)?.label || finalReason;
    }

    onConfirm(finalReason);
  }

  // Reset state when modal is closed/opened
  useEffect(() => {
    if (visible) {
      setSelectedReason('');
      setOtherReason('');
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent>
      <View style={StyleSheet.absoluteFill} className="justify-center items-center px-4">
        <BlurView
          intensity={20}
          tint="dark"
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        />

        <View
          className="bg-[#FFFFFF] w-full max-w-sm rounded-xl p-5 space-y-4 my-auto"
          style={{
            elevation: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 30,
          }}
        >
          {/* Modal Header */}
          <View className="space-y-1 mb-4">
            <Text className="text-[#111827] text-xl font-bold font-headline">{t('cancel.title')}</Text>
            <Text className="text-[#6B7280] text-sm leading-relaxed">{t('cancel.reasonSubtitle')}</Text>
          </View>

          {/* Selectable Reasons List */}
          <View className="space-y-1">
            {REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                onPress={() => setSelectedReason(reason.id)}
                activeOpacity={0.7}
                className="flex-row items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: selectedReason === reason.id ? '#f4f4ef' : 'transparent' }}
              >
                <View
                  className="w-5 h-5 rounded-full border items-center justify-center mt-[-2]"
                  style={{
                    borderColor: selectedReason === reason.id ? '#0d631b' : '#707a6c',
                    backgroundColor: selectedReason === reason.id ? '#0d631b' : 'transparent'
                  }}
                >
                  {selectedReason === reason.id && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>
                <Text className="text-[#1a1c19] font-medium text-sm">{reason.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Other Input Field (Conditional) */}
          {selectedReason === 'other' && (
            <View className="mt-2 mb-2 p-1">
              <TextInput
                value={otherReason}
                onChangeText={setOtherReason}
                placeholder={t('cancel.specifyReason')}
                placeholderTextColor="#707a6c"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                className="w-full p-3 bg-[#f4f4ef] border border-[#bfcaba] rounded-lg text-sm text-[#1a1c19]"
                style={{ minHeight: 100, paddingTop: 12 }}
              />
            </View>
          )}


          {/* Action Buttons */}
          <View className="space-y-3 pt-2">
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={isLoading || !selectedReason || (selectedReason === 'other' && !otherReason.trim())}
              className="w-full py-3.5 rounded-xl flex-row items-center justify-center shadow-md active:scale-95 transition-transform"
              style={{
                backgroundColor: (!selectedReason || (selectedReason === 'other' && !otherReason.trim())) ? '#e3e3de' : '#DC2626',
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base" style={{ opacity: (!selectedReason || (selectedReason === 'other' && !otherReason.trim())) ? 0.6 : 1 }}>{t('bookings.cancelBooking')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className="w-full border border-outline-variant py-3.5 rounded-xl items-center justify-center active:bg-[#f4f4ef] transition-colors mt-3"
            >
              <Text className="text-[#374151] font-semibold text-sm">{t('common.goBack')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
