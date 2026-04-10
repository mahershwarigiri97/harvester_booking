import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { BookingAddress } from './BookingAddress';

interface BookingDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  booking: any;
  onNavigateToTrack?: () => void;
}

export function BookingDetailsModal({ visible, onClose, booking, onNavigateToTrack }: BookingDetailsModalProps) {
  const { t } = useTranslation();
  if (!booking) return null;

  const isOwner = booking.updated_by_user === 'owner';

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent navigationBarTranslucent>
      <View style={StyleSheet.absoluteFill} className="justify-end">
        <BlurView
          intensity={30}
          tint="dark"
          style={StyleSheet.absoluteFill}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={StyleSheet.absoluteFill} 
            onPress={onClose} 
          />
        </BlurView>

        <View 
          className="bg-surface rounded-t-[40px] p-8 pb-12"
          style={{
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
          }}
        >
          {/* Handle bar */}
          <View className="items-center mb-6">
            <View className="w-12 h-1.5 bg-[#e3e3de] rounded-full" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header Info */}
            <View className="flex-row justify-between items-start mb-8">
              <View className="flex-row gap-4 items-center flex-1">
                <View className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-high">
                  <Image source={{ uri: booking.image }} className="w-full h-full" />
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-headline font-bold text-on-surface">{booking.name}</Text>
                  <Text className="text-on-surface-variant font-medium">{t('role.farmerTitle')} • {booking.date}</Text>
                </View>
              </View>
              <View 
                className="px-4 py-1.5 rounded-full"
                style={{ backgroundColor: booking.hexBg }}
              >
                <Text 
                  className="font-headline font-bold text-xs tracking-wider uppercase"
                  style={{ color: booking.hexColor }}
                >
                  {booking.status}
                </Text>
              </View>
            </View>

            {/* Details Grid */}
            <View className="flex-row flex-wrap gap-4 mb-8">
              <View className="flex-1 min-w-[140px] bg-surface-container-low p-5 rounded-3xl">
                <Text className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{t('common.landSize')}</Text>
                <Text className="text-xl font-headline font-bold text-on-surface">{booking.size || 'N/A'}</Text>
              </View>
              <View className="flex-1 min-w-[140px] bg-surface-container-low p-5 rounded-3xl">
                <Text className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{booking.amountLabel === 'Earned' ? t('owner.earned') : t('owner.estimated')}</Text>
                <Text className="text-xl font-headline font-bold text-primary">{booking.amount}</Text>
              </View>
              <View className="w-full bg-surface-container-low p-5 rounded-3xl">
                <Text className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{t('common.location')}</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <MaterialIcons name="location-on" size={20} color="#0d631b" />
                  <BookingAddress
                    address={booking.full_address}
                    className="text-base font-medium text-on-surface flex-1"
                    fallback={t('common.farmLocation')}
                  />
                </View>
              </View>
            </View>

            {/* Cancellation Reason if applicable */}
            {(booking.rawStatus === 'cancelled' || booking.cancel_reason) && (
              <View className="bg-error-container/20 p-6 rounded-3xl mb-8 border border-error-container/40">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="info" size={20} color="#ba1a1a" />
                  <Text className="text-error font-bold uppercase text-xs tracking-widest">{t('cancel.reasonTitle')}</Text>
                </View>
                <Text className="text-on-surface text-base leading-relaxed">
                  {booking.cancel_reason || t('cancel.noReason')}
                </Text>
                <Text className="text-on-surface-variant text-xs mt-3 italic">
                  {t('cancel.cancelledBy')} {isOwner ? t('role.ownerTitle') : t('role.farmerTitle')}
                </Text>
              </View>
            )}

            {/* Actions */}
            <View className="gap-4">
              {['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(booking.rawStatus) && onNavigateToTrack && (
                <TouchableOpacity 
                   onPress={() => { onClose(); onNavigateToTrack(); }}
                   style={{ 
                     backgroundColor: booking.rawStatus === 'accepted' ? '#0d631b' : '#835400',
                   }}
                   className="w-full h-16 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
                >
                  <MaterialIcons 
                    name={
                      booking.rawStatus === 'accepted' ? "navigation" : 
                      (['arrived', 'in_progress'].includes(booking.rawStatus) ? "speed" : "map")
                    } 
                    size={24} 
                    color="#fff" 
                  />
                  <Text className="text-white font-bold text-lg">
                    {booking.rawStatus === 'accepted' ? t('nav.startNavigation') : 
                     (['arrived', 'in_progress'].includes(booking.rawStatus) ? t('nav.viewProgress') : t('nav.viewRoute'))}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={onClose}
                className="w-full border border-outline-variant h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-on-surface font-bold">{t('bookings.closeDetails')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
