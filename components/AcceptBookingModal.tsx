import React from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

interface AcceptBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function AcceptBookingModal({ visible, onClose, onConfirm, isLoading }: AcceptBookingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent>
      <View style={StyleSheet.absoluteFill} className="justify-center items-center">
        {/* Fallback dark tint + blur */}
        <BlurView 
          intensity={20} 
          tint="dark" 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} 
        />
        
        {/* Click outside to close (disabled when loading) */}
        {!isLoading && (
          <TouchableOpacity 
            activeOpacity={1} 
            style={StyleSheet.absoluteFill}
            onPress={onClose} 
          />
        )}

        <View 
          className="bg-surface-container-lowest w-[85%] rounded-[32px] p-6"
          style={{
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 30,
          }}
        >
          <Text className="text-2xl font-headline font-bold text-on-surface mb-2">
            Accept Booking?
          </Text>
          <Text className="text-base text-on-surface-variant font-body mb-8 leading-relaxed">
            Are you ready to accept this booking request? The farmer will be notified immediately.
          </Text>

          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-full active:scale-95 transition-transform bg-surface-container-high"
            >
              <Text className="text-on-surface font-bold text-sm">Not yet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              className="px-6 py-3 rounded-full active:scale-95 transition-transform flex-row items-center justify-center min-w-[120px]"
              style={{ backgroundColor: '#0d631b' }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-sm">Yes, Accept</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
