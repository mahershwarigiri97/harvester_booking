import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
}

export default function SuccessModal({ 
  visible, 
  onClose, 
  title, 
  message, 
  buttonLabel = 'Great!', 
  onButtonPress 
}: SuccessModalProps) {
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleValue.setValue(0.8);
      opacityValue.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <BlurView intensity={20} className="absolute inset-0" tint="dark" />
        
        <Animated.View 
          style={{ 
            transform: [{ scale: scaleValue }], 
            opacity: opacityValue,
            width: '100%',
            maxWidth: 400
          }}
          className="bg-surface rounded-[48px] overflow-hidden shadow-2xl"
        >
          {/* Decorative background element */}
          <View className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
          
          <View className="p-8 items-center">
            {/* Icon Circle */}
            <View 
              className="w-24 h-24 bg-primary-container rounded-full items-center justify-center mb-6 shadow-lg shadow-primary/20"
              style={{ elevation: 8 }}
            >
              <MaterialIcons name="check-circle" size={56} color="#0d631b" />
            </View>

            <Text className="font-headline font-extrabold text-3xl text-on-surface text-center mb-3">
              {title}
            </Text>
            
            <Text className="text-on-surface-variant text-center text-lg leading-relaxed mb-8 px-4">
              {message}
            </Text>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => {
                if (onButtonPress) onButtonPress();
                onClose();
              }}
              className="w-full h-16 rounded-3xl overflow-hidden shadow-lg shadow-primary/30"
              style={{ elevation: 12 }}
            >
              <LinearGradient
                colors={['#0d631b', '#2e7d32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-full items-center justify-center"
              >
                <Text className="text-white font-headline font-bold text-lg">{buttonLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
