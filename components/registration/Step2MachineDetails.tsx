import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Step2Props {
  machineType: string;
  setMachineType: (val: string) => void;
  brand: string;
  setBrand: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  pricingModel: string;
  setPricingModel: (val: string) => void;
  rate: string;
  setRate: (val: string) => void;
}

export function Step2MachineDetails({
  machineType, setMachineType,
  brand, setBrand,
  year, setYear,
  pricingModel, setPricingModel,
  rate, setRate
}: Step2Props) {
  const { t } = useTranslation();
  return (
    <View style={{ gap: 32 }}>
      {/* Machine Type */}
      <View>
        <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 18, color: '#0d631b', marginBottom: 16 }}>{t('registration.machineTypeTitle')} <Text style={{ color: 'red' }}>*</Text></Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setMachineType('combine')} style={[{ flex: 1, padding: 24, borderRadius: 24, borderWidth: 2, alignItems: 'center' }, machineType === 'combine' ? { borderColor: '#0d631b', backgroundColor: 'rgba(163, 246, 156, 0.1)' } : { borderColor: 'transparent', backgroundColor: '#ffffff' }]}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#f4f4ef', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <MaterialIcons name="agriculture" size={32} color="#0d631b" />
            </View>
            <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 16, color: '#1a1c19' }}>{t('registration.combine')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setMachineType('tractor')} style={[{ flex: 1, padding: 24, borderRadius: 24, borderWidth: 2, alignItems: 'center' }, machineType === 'tractor' ? { borderColor: '#0d631b', backgroundColor: 'rgba(163, 246, 156, 0.1)' } : { borderColor: 'transparent', backgroundColor: '#ffffff' }]}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#f4f4ef', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <MaterialIcons name="tram" size={32} color="#0d631b" />
            </View>
            <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 16, color: '#1a1c19' }}>{t('registration.tractor')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Brand & Year */}
      <View style={{ gap: 24 }}>
        <View>
          <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 18, color: '#0d631b', marginBottom: 12 }}>{t('registration.brandLabel')} <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={{ backgroundColor: '#e3e3de', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
            <MaterialIcons name="branding-watermark" size={24} color="#707a6c" />
            <TextInput value={brand} onChangeText={setBrand} placeholder={t('registration.brandHint')} placeholderTextColor="#707a6c" style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 12, fontSize: 16, color: '#1a1c19' }} />
          </View>
        </View>
        <View>
          <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 18, color: '#0d631b', marginBottom: 12 }}>{t('registration.yearLabel')} <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={{ backgroundColor: '#e3e3de', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
            <MaterialIcons name="calendar-today" size={24} color="#707a6c" />
            <TextInput value={year} onChangeText={setYear} keyboardType="numeric" placeholder={t('registration.yearHint')} placeholderTextColor="#707a6c" style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 12, fontSize: 16, color: '#1a1c19' }} />
          </View>
        </View>
      </View>

      {/* Hero Image */}
      <View style={{ height: 192, borderRadius: 32, overflow: 'hidden', marginVertical: 8 }}>
        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_sf3gDX8F9mD-Js6aTY9lzmnFI-NqahUIAY4GSrkFY5dTxegHMJpHSG5ALaH0lsA0AhphQolgFAn6ikyL5I8RJbm_cFkkyK08rtMugQsZsdhstoBBVKlNc0vAjS2XeBOm_gcxgLSLu46wfVf64L8a3oVrKeGiezTUM8efhg8-bI95voT2IrGTqa3xT-YNyI7zP0cUrQKbGPoMbLEMMeA8uWdUnT34aOK2916721AvyXIvCEJiV3NBPhaOktez1V_FleQfz4lnWKyW' }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,34,4,0.6)', padding: 24, paddingTop: 64 }}>
          <Text style={{ color: '#fff', fontFamily: 'headline', fontWeight: '600', fontSize: 18, fontStyle: 'italic' }}>{t('registration.equipmentTip')}</Text>
        </View>
      </View>

      {/* Pricing Section */}
      <View style={{ backgroundColor: '#f4f4ef', padding: 24, borderRadius: 32 }}>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 20, color: '#0d631b', marginBottom: 16 }}>{t('registration.pricingModelTitle')} <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={{ flexDirection: 'row', backgroundColor: '#e3e3de', padding: 6, borderRadius: 32 }}>
            <TouchableOpacity onPress={() => setPricingModel('per_acre')} style={[{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 24 }, pricingModel === 'per_acre' ? { backgroundColor: '#0d631b', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 } : {}]}>
              <Text style={[{ fontWeight: 'bold' }, pricingModel === 'per_acre' ? { color: '#fff' } : { color: '#707a6c' }]}>{t('registration.perAcre')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPricingModel('per_hour')} style={[{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 24 }, pricingModel === 'per_hour' ? { backgroundColor: '#0d631b', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 } : {}]}>
              <Text style={[{ fontWeight: 'bold' }, pricingModel === 'per_hour' ? { color: '#fff' } : { color: '#707a6c' }]}>{t('registration.perHour')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: '#ffffff', borderRadius: 24, paddingVertical: 24, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'headline', fontWeight: '900', fontSize: 36, color: '#1a1c19', marginRight: 16 }}>₹</Text>
          <TextInput value={rate} onChangeText={setRate} keyboardType="numeric" placeholder="0.00" style={{ flex: 1, fontSize: 36, fontFamily: 'headline', fontWeight: '900', color: '#1a1c19' }} />
          <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 20, color: '#40493d', textTransform: 'uppercase' }}>/ {pricingModel === 'per_acre' ? t('common.acre') : t('common.perHour')}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 }}>
          <MaterialIcons name="info" size={20} color="#835400" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#40493d' }}>{t('registration.averageRateLabel')} <Text style={{ fontWeight: 'bold' }}>{t('registration.rateRange')}</Text></Text>
        </View>
      </View>
    </View>
  );
}
