import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LocationDropdowns } from './LocationDropdowns';

interface Step1Props {
  name: string;
  setName: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  village: string;
  setVillage: (val: string) => void;
  streetAddress: string;
  setStreetAddress: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
  profileImage: string | null;
  setProfileImage: (val: string | null) => void;
  loadingLocation?: boolean;
  onUseLocation?: () => void;
}

export function Step1BasicInfo({ name, setName, location, setLocation, village, setVillage, streetAddress, setStreetAddress, pincode, setPincode, profileImage, setProfileImage, loadingLocation, onUseLocation }: Step1Props) {
  return (
    <View style={{ gap: 32 }}>
      {/* Profile Picture Upload */}
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={async () => {
             // Basic image picker directly here for simplicity or use a shared hook
             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
             if (status !== 'granted') return;
             const result = await ImagePicker.launchImageLibraryAsync({
               mediaTypes: ImagePicker.MediaTypeOptions.Images,
               allowsEditing: true,
               aspect: [1, 1],
               quality: 0.5,
             });
             if (!result.canceled) {
               setProfileImage(result.assets[0].uri);
             }
          }}
          style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#f4f4ef', borderStyle: 'dashed', borderWidth: 2, borderColor: '#0d631b', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="add-a-photo" size={32} color="#0d631b" />
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#0d631b', marginTop: 4 }}>PHOTO</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={{ marginTop: 12, fontSize: 14, fontWeight: '700', color: '#1a1c19' }}>Profile Picture</Text>
      </View>

      {/* Name Input */}
      <View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#0d631b', marginBottom: 8, paddingHorizontal: 4 }}>Owner Name <Text style={{ color: 'red' }}>*</Text></Text>
        <View style={{ backgroundColor: '#e8e8e3', borderRadius: 16, overflow: 'hidden' }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            placeholderTextColor="#bfcaba"
            style={{ paddingHorizontal: 20, paddingVertical: 20, fontSize: 18, color: '#1a1c19', fontWeight: '500' }}
          />
        </View>
      </View>

      {/* Phone Input (Pre-filled) */}
      <View style={{ opacity: 0.8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#40493d', marginBottom: 8, paddingHorizontal: 4 }}>Phone Number</Text>
        <View style={{ backgroundColor: '#f4f4ef', borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#40493d', marginRight: 8 }}>+91</Text>
          <TextInput
            value="98765 43210"
            editable={false}
            style={{ flex: 1, paddingVertical: 20, fontSize: 18, color: '#40493d', fontWeight: '500' }}
          />
          <MaterialIcons name="verified" size={20} color="#0d631b" />
        </View>
        <Text style={{ marginTop: 8, paddingHorizontal: 4, fontSize: 12, color: '#40493d' }}>Phone number verified during login</Text>
      </View>

      {/* Location Section */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8, paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#0d631b' }}>Operating Location <Text style={{ color: 'red' }}>*</Text></Text>
          <TouchableOpacity onPress={onUseLocation} disabled={loadingLocation} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {loadingLocation ? (
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#835400' }}>Fetching...</Text>
            ) : (
              <>
                <MaterialIcons name="my-location" size={16} color="#835400" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#835400' }}>Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <LocationDropdowns location={location} setLocation={setLocation} />

        {/* Street & Village Inputs */}
        <View style={{ marginTop: 16, gap: 16 }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#40493d', marginBottom: 8, paddingHorizontal: 4 }}>Village / City Segment <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={{ backgroundColor: '#e8e8e3', borderRadius: 16, overflow: 'hidden' }}>
              <TextInput
                value={village}
                onChangeText={setVillage}
                placeholder="Enter village e.g. Khamano"
                placeholderTextColor="#bfcaba"
                style={{ paddingHorizontal: 20, paddingVertical: 18, fontSize: 16, color: '#1a1c19', fontWeight: '500' }}
              />
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#40493d', marginBottom: 8, paddingHorizontal: 4 }}>Street Address</Text>
            <View style={{ backgroundColor: '#e8e8e3', borderRadius: 16, overflow: 'hidden' }}>
              <TextInput
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholder="Enter detailed street address"
                placeholderTextColor="#bfcaba"
                style={{ paddingHorizontal: 20, paddingVertical: 18, fontSize: 16, color: '#1a1c19', fontWeight: '500' }}
              />
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#40493d', marginBottom: 8, paddingHorizontal: 4 }}>Pincode / Postal Code <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={{ backgroundColor: '#e8e8e3', borderRadius: 16, overflow: 'hidden' }}>
              <TextInput
                value={pincode}
                onChangeText={setPincode}
                placeholder="Enter 6-digit Pincode"
                placeholderTextColor="#bfcaba"
                keyboardType="number-pad"
                maxLength={6}
                style={{ paddingHorizontal: 20, paddingVertical: 18, fontSize: 16, color: '#1a1c19', fontWeight: '500' }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Map Preview */}
      <View style={{ height: 192, borderRadius: 24, overflow: 'hidden', position: 'relative', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE8UHOAl0mOn_3vF9l3RFpgfkqD4Ti8DZIOANbi_8M-vUuImclt5GuNhVtTyKPqo8rGaFf4VGahj5_scPt3FR3-Fj0rht_RAAlh2THoAecrbpKrdEKy0Q-MebebCIU1EsqXRD3ocojgUG5o17PeIUpITqenI2XwUMIskueQFgg_MBs2oPWSILdCP99pUuIkTFXbouwVJD5Av3udRsxjf3arPtV08xhFhKniEeMXYIM1G4-vIxajva6UavOl0JIgdP1g-Oo6zQFEPIA' }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        <View style={{ position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(250, 250, 245, 0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
          <MaterialIcons name="location-pin" size={16} color="#0d631b" />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#1a1c19', maxWidth: 200 }} numberOfLines={1}>
            {location || 'Unknown Region'} {pincode ? `• ${pincode}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}
