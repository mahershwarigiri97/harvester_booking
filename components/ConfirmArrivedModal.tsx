import React from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

interface ConfirmArrivedModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmArrivedModal({ visible, onClose, onConfirm, isLoading }: ConfirmArrivedModalProps) {
  const { t } = useTranslation();
  
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent>
      <View style={StyleSheet.absoluteFill} className="justify-center items-center">
        {/* Background Blur */}
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
          className="bg-surface-container-lowest w-[85%] rounded-[32px] p-8"
          style={{
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 40,
          }}
        >
          <Text className="text-2xl font-headline font-bold text-on-surface mb-3 tracking-tight">
            {t('owner.confirmArrivalTitle')}
          </Text>
          <Text className="text-base text-on-surface-variant font-body mb-10 leading-relaxed">
            {t('owner.confirmArrivalDesc')}
          </Text>

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl items-center justify-center bg-surface-container-high active:scale-95 transition-transform"
            >
              <Text className="text-on-surface font-black text-sm uppercase tracking-widest">{t('common.wait')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              className="flex-2 h-14 rounded-2xl items-center justify-center active:scale-95 transition-transform min-w-[140px]"
              style={{ backgroundColor: '#835400' }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-black text-sm uppercase tracking-widest">{t('owner.yesArrived')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
