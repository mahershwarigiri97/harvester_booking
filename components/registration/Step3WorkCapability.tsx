import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Step3Props {
  workSpeed: string;
  setWorkSpeed: (val: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
}

export function Step3WorkCapability({ workSpeed, setWorkSpeed, images, setImages }: Step3Props) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [activeSlot, setActiveSlot] = React.useState<number | null>(null);

  const handleImageResult = (result: ImagePicker.ImagePickerResult, index: number) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const pickImage = async (index: number) => {
    setActiveSlot(index);
    setModalVisible(true);
  };

  const executeImagePick = async (type: 'camera' | 'gallery') => {
    setModalVisible(false);
    if (activeSlot === null) return;
    const index = activeSlot;

    // Small delay to let modal close before opening camera/gallery
    setTimeout(async () => {
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(t('common.tryAgain'), t('registration.snapFresh'));
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.8,
        });
        handleImageResult(result, index);
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.8,
        });
        handleImageResult(result, index);
      }
    }, 300);
  };
  return (
    <View style={{ gap: 32 }}>
      {/* Work Speed Input */}
      <View style={{ backgroundColor: '#f4f4ef', borderRadius: 24, padding: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#707a6c', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{t('registration.workSpeedLabel')} <Text style={{ color: 'red', textTransform: 'none' }}>*</Text></Text>
        <View style={{ position: 'relative' }}>
          <TextInput value={workSpeed} onChangeText={setWorkSpeed} keyboardType="numeric" placeholder="0.0" style={{ width: '100%', height: 64, backgroundColor: '#e3e3de', borderRadius: 16, paddingHorizontal: 24, fontSize: 20, fontWeight: 'bold', color: '#1a1c19' }} />
          <View style={{ position: 'absolute', right: 24, top: '50%', marginTop: -10 }}>
            <Text style={{ color: '#707a6c', fontWeight: 'bold', fontSize: 16 }}>{t('registration.acresPerHour')}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <MaterialIcons name="info" size={16} color="#707a6c" />
          <Text style={{ fontSize: 14, color: '#707a6c' }}>{t('registration.workSpeedHint')}</Text>
        </View>
      </View>

      {/* Image Upload Section */}
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 20, color: '#1a1c19' }}>{t('registration.uploadImages')}</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0d631b' }}>{t('registration.photosRequired')}</Text>
        </View>

        {/* Bento-style Upload Grid */}
        <View style={{ flexDirection: 'row', gap: 16, height: 256 }}>
          {/* Main Feature Upload Slot */}
          <TouchableOpacity onPress={() => pickImage(0)} activeOpacity={0.8} style={{ flex: 2, backgroundColor: '#f4f4ef', borderRadius: 32, borderWidth: 2, borderStyle: images[0] ? 'solid' : 'dashed', borderColor: images[0] ? '#0d631b' : '#bfcaba', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {images[0] ? (
              <Image source={{ uri: images[0] }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            ) : (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(46, 125, 50, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <MaterialIcons name="add-a-photo" size={32} color="#0d631b" />
                </View>
                <Text style={{ fontWeight: 'bold', color: '#1a1c19', fontSize: 16 }}>{t('registration.frontSideView')}</Text>
                <Text style={{ fontSize: 14, color: '#707a6c', marginTop: 4 }}>{t('registration.primaryPhoto')}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Side Upload Slots */}
          <View style={{ flex: 1, gap: 16 }}>
            <TouchableOpacity onPress={() => pickImage(1)} activeOpacity={0.8} style={{ flex: 1, backgroundColor: '#f4f4ef', borderRadius: 24, borderWidth: 2, borderStyle: images[1] ? 'solid' : 'dashed', borderColor: images[1] ? '#0d631b' : '#bfcaba', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {images[1] ? (
                <Image source={{ uri: images[1] }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
              ) : (
                <MaterialIcons name="photo-camera" size={24} color="#0d631b" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage(2)} activeOpacity={0.8} style={{ flex: 1, backgroundColor: '#f4f4ef', borderRadius: 24, borderWidth: 2, borderStyle: images[2] ? 'solid' : 'dashed', borderColor: images[2] ? '#0d631b' : '#bfcaba', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {images[2] ? (
                <Image source={{ uri: images[2] }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
              ) : (
                <MaterialIcons name="photo-camera" size={24} color="#0d631b" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Guidance Card */}
      <View style={{ backgroundColor: '#f4f4ef', padding: 20, borderRadius: 24, flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
        <View style={{ padding: 12, backgroundColor: '#ffddb5', borderRadius: 16 }}>
          <MaterialIcons name="lightbulb" size={20} color="#694300" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: '#1a1c19', marginBottom: 4 }}>{t('registration.photoTipTitle')}</Text>
          <Text style={{ fontSize: 14, color: '#40493d', lineHeight: 22 }}>{t('registration.photoTipDesc')}</Text>
        </View>
      </View>

      {/* Upload Modal (Stitch Target Design) */}
      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVisible(false)} activeOpacity={1} />
          <View style={{ backgroundColor: '#fafaf5', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 48, elevation: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 24, color: '#1a1c19' }}>{t('registration.uploadPhotoModal')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 8, backgroundColor: '#f4f4ef', borderRadius: 20 }}>
                <MaterialIcons name="close" size={24} color="#707a6c" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16, color: '#40493d', marginBottom: 24 }}>{t('registration.uploadPhotoDesc')}</Text>

            <View style={{ gap: 16 }}>
              {/* Gallery Option */}
              <TouchableOpacity activeOpacity={0.8} onPress={() => executeImagePick('gallery')} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#ffffff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(13, 99, 27, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="photo-library" size={24} color="#0d631b" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 18, color: '#1a1c19' }}>{t('registration.chooseGallery')}</Text>
                  <Text style={{ fontSize: 14, color: '#707a6c', marginTop: 2 }}>{t('registration.pickSaved')}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#bfcaba" />
              </TouchableOpacity>

              {/* Camera Option */}
              <TouchableOpacity activeOpacity={0.8} onPress={() => executeImagePick('camera')} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#ffffff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(13, 99, 27, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="camera-alt" size={24} color="#0d631b" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'headline', fontWeight: 'bold', fontSize: 18, color: '#1a1c19' }}>{t('registration.takeNew')}</Text>
                  <Text style={{ fontSize: 14, color: '#707a6c', marginTop: 2 }}>{t('registration.snapFresh')}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#bfcaba" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
