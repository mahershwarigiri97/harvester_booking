import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Stepper } from '../components/Stepper';
import { Step1BasicInfo } from '../components/registration/Step1BasicInfo';
import { Step2MachineDetails } from '../components/registration/Step2MachineDetails';
import { Step3WorkCapability } from '../components/registration/Step3WorkCapability';
import { useLocation } from '../hooks/useLocation';
import { authApi } from '../utils/api';
import { useAuthStore } from '../utils/authStore';
import { useMemo } from 'react';

export default function OwnerRegistrationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { userId } = useLocalSearchParams<{ userId: string }>();


  useEffect(() => {
    console.log('[OwnerRegistrationScreen] Received userId:', userId);
    console.log('[OwnerRegistrationScreen] AuthStore user:', useAuthStore.getState().user?.id);
  }, [userId]);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { locationStr: location, setLocationStr: setLocation, fetchLiveLocation, loadingLocation } = useLocation(
    React.useCallback((data: any) => {
      if (data.city) setVillage(data.city);
      if (data.street) setStreetAddress(data.street);
      if (data.pincode) setPincode(data.pincode);
    }, [])
  );

  const user = useAuthStore((state) => state.user);

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
    1: { title: t('registration.basicInfoStep'), desc: t('registration.basicInfoDesc'), cta: t('registration.ctaContinueMachine'), ctaIcon: 'arrow-forward' },
    2: { title: t('registration.machineDetailsStep'), desc: t('registration.machineDetailsDesc'), cta: t('registration.ctaContinuePhotos'), ctaIcon: 'photo-camera' },
    3: { title: t('registration.workCapabilityStep'), desc: t('registration.workCapabilityDesc'), cta: t('registration.ctaComplete'), ctaIcon: 'check-circle' }
  } as const;

  const currentStatus = stepContent[step as keyof typeof stepContent];

  // Validate current step - useMemo to prevent frequent recalculation and flickering
  const isStepValid = useMemo(() => {
    if (step === 1) {
      const isFullName = name.trim().split(/\s+/).length >= 2;
      return isFullName && location.trim().length > 0 && village.trim().length > 0 && pincode.trim().length >= 6;
    } else if (step === 2) {
      return machineType.trim().length > 0 && brand.trim().length > 0 && year.trim().length > 0 && pricingModel.trim().length > 0 && rate.trim().length > 0;
    } else if (step === 3) {
      return workSpeed.trim().length > 0 && images.filter(Boolean).length > 0;
    }
    return false;
  }, [step, name, location, village, pincode, machineType, brand, year, pricingModel, rate, workSpeed, images]);

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        // Upload images first
        const formData = new FormData();
        images.filter(Boolean).forEach((uri) => {
          const name = uri.split('/').pop() || 'image.jpg';
          const match = /\.(\w+)$/.exec(name);
          let type = match ? `image/${match[1].toLowerCase()}` : `image/jpeg`;
          if (type === 'image/jpg') type = 'image/jpeg';

          const uploadUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');

          console.log('[Registration] Appending image:', { name, type, uri: uploadUri });
          formData.append('images', {
            uri: uploadUri,
            name: name,
            type: typeof type === 'string' ? type : 'image/jpeg'
          } as any);
        });

        const uploadRes = await authApi.uploadImages(formData, 'machine');
        const imageUrls = uploadRes.data.data.urls;
        // Upload Profile Image if selected
        let avatarUrl = '';
        if (profileImage) {
          const profileFormData = new FormData();
          const pName = profileImage.split('/').pop() || 'profile.jpg';
          const pMatch = /\.(\w+)$/.exec(pName);
          let pType = pMatch ? `image/${pMatch[1].toLowerCase()}` : `image/jpeg`;
          if (pType === 'image/jpg') pType = 'image/jpeg';

          const pUploadUri = Platform.OS === 'android' ? profileImage : profileImage.replace('file://', '');

          console.log('[Registration] Appending profile image:', { name: pName, type: pType, uri: pUploadUri });
          profileFormData.append('images', {
            uri: pUploadUri,
            name: pName,
            type: typeof pType === 'string' ? pType : 'image/jpeg'
          } as any);

          const profileRes = await authApi.uploadImages(profileFormData, 'profile');
          avatarUrl = profileRes.data.data.urls[0];
        }

        const [dist, st] = location.split(',').map(s => s.trim());
        const currentUserId = userId || useAuthStore.getState().user?.id;

        if (!currentUserId) {
          console.error('[Registration] No User ID found in params or store');
          setLoading(false);
          return;
        }

        const res = await authApi.completeOwnerProfile({
          userId: parseInt(currentUserId.toString()),
          name,
          avatar: avatarUrl,
          address: {
            village,
            street_address: streetAddress,
            pincode,
            district: dist,
            state: st,
          },
          type: machineType === 'combine' ? t('registration.combine') : t('registration.tractor'),
          brand,
          model: year,
          pricePerHour: rate,
          pricePerAcre: rate,
          images: imageUrls,
          lang: i18n.language
        });

        console.log('[Registration] Profile completed successfully');

        const { redirectTo, user, token } = res.data.data;

        // Sync local auth store with updated profile data
        await useAuthStore.getState().setAuth(user, token);

        router.replace({ pathname: redirectTo as any, params: { userId: user.id.toString() } });
      } catch (error: any) {
        console.error('Failed to complete profile', error);
        if (error.response) {
          console.error('[Registration] Server Error Data:', error.response.data);
          console.error('[Registration] Server Status:', error.response.status);
        }
      } finally {
        setLoading(false);
      }
    }
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
            {step === 1 ? t('registration.step1Title') : step === 2 ? t('registration.step2Title') : t('registration.step3Title')}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
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
              profileImage={profileImage} setProfileImage={setProfileImage}
              loadingLocation={loadingLocation} onUseLocation={fetchLiveLocation}
              phone={user?.phone}
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
                <Text style={{ fontWeight: 'bold', color: '#1a1c19', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('registration.whyNeedThis')}</Text>
                <Text style={{ fontSize: 14, color: '#40493d', lineHeight: 22 }}>
                  {t('registration.locationReason')}
                </Text>
              </View>
            </View>
          )}

        </ScrollView>

        {/* Fixed Bottom Action Container */}
        <View style={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 24), paddingTop: 16, backgroundColor: '#fafaf5', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }}>
          <TouchableOpacity
            disabled={!isStepValid || loading}
            activeOpacity={0.8}
            onPress={handleNextStep}
            style={{
              opacity: isStepValid && !loading ? 1 : 0.5,
              borderRadius: 16,
              overflow: 'hidden',
              elevation: isStepValid ? 2 : 0,
              shadowColor: '#0d631b',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isStepValid ? 0.2 : 0,
              shadowRadius: 8
            }}
          >
            <LinearGradient colors={['#0d631b', '#2e7d32']} style={{ height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Text style={{ color: '#fff', fontFamily: 'headline', fontWeight: 'bold', fontSize: 20 }}>
                {loading ? t('registration.uploading') : currentStatus.cta}
              </Text>
              {!loading && (currentStatus as any).ctaIcon && (
                <MaterialIcons name={(currentStatus as any).ctaIcon} size={24} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
