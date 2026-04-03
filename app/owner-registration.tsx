import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stepper } from '../components/Stepper';
import { Step1BasicInfo } from '../components/registration/Step1BasicInfo';
import { Step2MachineDetails } from '../components/registration/Step2MachineDetails';
import { Step3WorkCapability } from '../components/registration/Step3WorkCapability';
import { useLocation } from '../hooks/useLocation';

export default function OwnerRegistrationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const { locationStr: location, setLocationStr: setLocation, fetchLiveLocation, loadingLocation } = useLocation((data) => {
    if (data.city) setVillage(data.city);
    if (data.street) setStreetAddress(data.street);
    if (data.pincode) setPincode(data.pincode);
  });

  // Automatically fetch layout details instantly on load
  useEffect(() => {
    fetchLiveLocation();
  }, []);

  const [machineType, setMachineType] = useState('combine');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [pricingModel, setPricingModel] = useState('per_acre');
  const [rate, setRate] = useState('');

  const [workSpeed, setWorkSpeed] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const stepContent = {
    1: { title: 'Basic Info', desc: "Let's start with your profile to get your fleet registered.", cta: 'Continue to Machine Details', ctaIcon: 'arrow-forward' },
    2: { title: 'Machine Details', desc: 'Add your vehicle details & licenses to match with farmers.', cta: 'Continue to Photos', ctaIcon: 'photo-camera' },
    3: { title: 'Work Capability', desc: 'Add your vehicle details & licenses to match with farmers.', cta: 'Complete Registration', ctaIcon: 'check-circle' }
  } as const;

  const currentStatus = stepContent[step as keyof typeof stepContent];

  // Validate current step
  let isStepValid = false;
  if (step === 1) {
    const isFullName = name.trim().split(/\s+/).length >= 2;
    isStepValid = isFullName && location.trim().length > 0 && village.trim().length > 0 && pincode.trim().length >= 6;
  } else if (step === 2) {
    isStepValid = machineType.trim().length > 0 && brand.trim().length > 0 && year.trim().length > 0 && pricingModel.trim().length > 0 && rate.trim().length > 0;
  } else if (step === 3) {
    isStepValid = workSpeed.trim().length > 0 && images.filter(Boolean).length > 0;
  }

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.replace('/(tabs)' as any);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fafaf5' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />

      {/* Dynamic Top Nav Bar */}
      <View style={{ paddingTop: insets.top, backgroundColor: '#fafaf5', zIndex: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, height: 64 }}>
          {step > 1 && (
            <TouchableOpacity onPress={handleBack} style={{ padding: 8, marginLeft: -8, marginRight: 8, borderRadius: 20 }}>
              <MaterialIcons name="arrow-back" size={24} color="#0d631b" />
            </TouchableOpacity>
          )}
          <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 20, color: '#0d631b', letterSpacing: -0.5 }}>
            {step === 1 ? 'User Details' : step === 2 ? 'Machine Details' : 'Work Capability'}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 64 }}>

          {/* Step Indicator & Header */}
          <View style={{ marginBottom: 40 }}>
            <Stepper currentStep={step} />
          </View>

          {/* Form Section */}
          {step === 1 ? (
            <Step1BasicInfo 
              name={name} setName={setName} 
              location={location} setLocation={setLocation} 
              village={village} setVillage={setVillage}
              streetAddress={streetAddress} setStreetAddress={setStreetAddress}
              pincode={pincode} setPincode={setPincode}
              loadingLocation={loadingLocation} onUseLocation={fetchLiveLocation}
            />
          ) : step === 2 ? (
            <Step2MachineDetails 
              machineType={machineType} setMachineType={setMachineType}
              brand={brand} setBrand={setBrand}
              year={year} setYear={setYear}
              pricingModel={pricingModel} setPricingModel={setPricingModel}
              rate={rate} setRate={setRate}
            />
          ) : (
            <Step3WorkCapability 
              workSpeed={workSpeed} setWorkSpeed={setWorkSpeed} 
              images={images} setImages={setImages} 
            />
          )}

          {/* Helping Text - Adaptive to Step */}
          {step === 1 && (
            <View style={{ marginTop: 48, backgroundColor: '#f4f4ef', padding: 24, borderRadius: 24, flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
              <View style={{ backgroundColor: '#a3f69c', padding: 8, borderRadius: 12 }}>
                <MaterialIcons name="info" size={20} color="#005312" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: '#1a1c19', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Why we need this?</Text>
                <Text style={{ fontSize: 14, color: '#40493d', lineHeight: 22 }}>
                  Your location helps farmers nearby find your machinery quickly during harvest peak seasons.
                </Text>
              </View>
            </View>
          )}

        </ScrollView>

        {/* Fixed Bottom Action Container */}
        <View style={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 24), paddingTop: 16, backgroundColor: '#fafaf5', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }}>
          <TouchableOpacity 
             disabled={!isStepValid}
             activeOpacity={0.88} 
             onPress={handleNextStep} 
             style={{ opacity: isStepValid ? 1 : 0.4, borderRadius: 16, overflow: 'hidden', elevation: isStepValid ? 4 : 0, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isStepValid ? 0.2 : 0, shadowRadius: 8 }}
          >
            <LinearGradient colors={['#0d631b', '#2e7d32']} style={{ height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Text style={{ color: '#fff', fontFamily: 'headline', fontWeight: 'bold', fontSize: 20 }}>
                {currentStatus.cta}
              </Text>
              {(currentStatus as any).ctaIcon && (
                <MaterialIcons name={(currentStatus as any).ctaIcon} size={24} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
