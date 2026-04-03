import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { OtpCounter } from '../components/OtpCounter';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      // Optionally also clear the previous input when jumping back
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleSendOTP = () => {
    if (phoneNumber.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError('');
    setStep('otp');
  };

  const isOtpComplete = otp.every((digit) => digit.length === 1);
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar hidden />
      {/* Background Visual Elements (Simplified for React Native without heavy SVG blur) */}
      <View className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[#a3f69c] opacity-20 rounded-full" />
      <View className="absolute bottom-[-150px] left-[-150px] w-80 h-80 bg-[#ffddb5] opacity-20 rounded-full" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          
          {/* Logo Section */}
          <View className="mb-12 items-center">
            <View className="items-center justify-center w-20 h-20 rounded-[32px] bg-primary mb-6 shadow-sm">
              <MaterialIcons name="agriculture" size={40} color="white" />
            </View>
            <Text className="font-headline font-extrabold text-3xl text-primary tracking-tighter">
              Harvester Hub
            </Text>
            <Text className="text-on-surface-variant mt-2 font-medium">
              Welcome to your digital harvest partner
            </Text>
          </View>

          {step === 'phone' ? (
            /* Phone Number Step */
            <View className="w-full bg-surface-container-low p-8 rounded-[40px]" style={styles.cardShadow}>
              <View className="mb-6">
                <Text className="font-headline font-bold text-xl text-on-surface mb-2">
                  Get Started
                </Text>
                <Text className="text-on-surface-variant text-sm">
                  Enter your phone number to continue
                </Text>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-xs font-bold text-primary mb-2 uppercase tracking-widest px-1">
                    Mobile Number
                  </Text>
                  <View className={`flex-row items-center bg-surface-container-lowest rounded-xl px-4 h-16 border ${phoneError ? 'border-error' : 'border-transparent focus:border-primary/20'}`} style={styles.inputShadow}>
                    <View className="border-r border-outline-variant pr-4 mr-4">
                      <Text className="text-on-surface-variant font-bold">+91</Text>
                    </View>
                    <TextInput 
                      style={{ outlineStyle: 'none' } as any}
                      className="flex-1 text-lg font-bold tracking-widest text-on-surface"
                      placeholder="00000 00000"
                      placeholderTextColor="#bfcaba"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={(text) => {
                        setPhoneNumber(text.replace(/[^0-9]/g, ''));
                        setPhoneError('');
                      }}
                    />
                  </View>
                  {phoneError ? (
                    <Text className="text-error text-xs mt-2 px-1 font-medium">{phoneError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={handleSendOTP}
                  className="mt-6"
                  style={{ outlineStyle: 'none' } as any}
                >
                  <LinearGradient
                    colors={['#0d631b', '#2e7d32']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-16 rounded-xl flex-row items-center justify-center px-4"
                    style={styles.buttonShadow}
                  >
                    <Text className="text-on-primary font-headline font-bold text-lg mr-3">
                      Send OTP
                    </Text>
                    <MaterialIcons name="arrow-forward" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* OTP Verification Step */
            <View className="w-full bg-surface-container-low p-8 rounded-[40px]" style={styles.cardShadow}>
              <View className="mb-6">
                <Text className="font-headline font-bold text-xl text-on-surface mb-2">
                  Verify OTP
                </Text>
                <Text className="text-on-surface-variant text-sm">
                  Sent to +91 {phoneNumber.replace(/(\d{5})(\d{5})/, '$1 $2')}
                </Text>
              </View>

              <View className="space-y-6">
                <View className="flex-row justify-between gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <TextInput 
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      className="w-14 h-16 bg-surface-container-lowest text-center text-2xl font-bold rounded-xl border-b-2 border-transparent focus:border-secondary-container"
                      style={[styles.inputShadow, { outlineStyle: 'none' } as any]}
                      maxLength={1}
                      keyboardType="number-pad"
                      textAlign="center"
                      cursorColor="#0d631b"
                      selectionColor="#0d631b"
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    />
                  ))}
                </View>

                <OtpCounter onResend={() => {/* Handle resend logic */}} />

                <TouchableOpacity 
                  activeOpacity={0.8} 
                  onPress={() => router.replace('/role')} 
                  style={{ outlineStyle: 'none' } as any}
                  disabled={!isOtpComplete}
                >
                  <View 
                    className={`w-full h-16 rounded-xl flex items-center justify-center ${isOtpComplete ? 'bg-secondary-container' : 'bg-surface-variant'}`} 
                    style={isOtpComplete ? styles.buttonShadow : undefined}
                  >
                    <Text className={`font-headline font-bold text-lg ${isOtpComplete ? 'text-on-secondary-container' : 'text-outline-variant'}`}>
                      Verify & Login
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {/* Temp button to go back */}
                <TouchableOpacity onPress={() => setStep('phone')} className="mt-4 pt-2 items-center" style={{ outlineStyle: 'none' } as any}>
                   <Text className="text-outline text-xs underline">Change number</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer Links */}
          <View className="mt-12 items-center gap-4">
            <TouchableOpacity className="flex-row items-center px-6 py-3 rounded-full bg-surface-container mb-4">
              <MaterialIcons name="help-outline" size={20} color="#40493d" />
              <Text className="text-on-surface-variant font-bold text-sm ml-2">Need help?</Text>
            </TouchableOpacity>
            <Text className="text-xs text-on-surface-variant font-medium text-center leading-relaxed px-6">
              By signing in, you agree to Harvester Hub's{"\n"}
              <Text className="text-primary font-bold">Terms of Service</Text> & <Text className="text-primary font-bold">Privacy Policy</Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  }
});
