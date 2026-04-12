import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';

export interface LocationData {
  state: string;
  district: string;
}

interface LocationDropdownsProps {
  location: string;
  setLocation: (val: string) => void;
}

export function LocationDropdowns({ location, setLocation }: LocationDropdownsProps) {
  const { t } = useTranslation();
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // We decode the location string to map it back to structured state if needed
  // For simplicity, we just manage internal state and update the parent string on change.
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'state' | 'district'>('state');

  // Trigger parent update
  useEffect(() => {
    if (selectedState || selectedDistrict) {
      const parts = [selectedDistrict, selectedState].filter(Boolean);
      setLocation(parts.join(', '));
    }
  }, [selectedState, selectedDistrict]);

  // Fetch States initially
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json');
        if (response.ok) {
          const data = await response.json();
          const stateList = data.states.map((s: any) => s.state);
          setStates(stateList);
        } else {
          setStates(['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra']);
        }
      } catch (e) {
        setStates(['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra']);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  const loadDistrictsForState = async (stateName: string) => {
    setLoadingDistricts(true);
    try {
      const response = await fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json');
      if (response.ok) {
        const data = await response.json();
        const stateData = data.states.find((s: any) => s.state === stateName);
        if (stateData) {
          setDistricts(stateData.districts);
        }
      } else {
        setDistricts(['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala']);
      }
    } catch {
      setDistricts(['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala']);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Sync external location changes (like GPS fetch) into dropdown states
  useEffect(() => {
    if (!location) return;

    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').replace(/,+/g, ',');
    const currentGenerated = [selectedDistrict, selectedState].filter(Boolean).join(', ');
    
    // If location is provided but it doesn't match what we generated, it came from outside!
    if (normalize(location) !== normalize(currentGenerated)) {
      const parts = location.split(',').map(s => s.trim());
      
      let matchedState = '';
      let matchedDistrict = '';
      
      // Attempt to identify state from known states or context
      if (states.length > 0) {
        for (let part of parts) {
          const sFound = states.find(s => s.toLowerCase() === part.toLowerCase());
          if (sFound) {
            matchedState = sFound;
            break;
          }
        }
      }

      // Identify district based on state position
      if (matchedState) {
         const stateIndex = parts.findIndex(p => p.toLowerCase() === matchedState.toLowerCase());
         if (stateIndex > 0) {
            matchedDistrict = parts[stateIndex - 1];
         }
      }
      
      // Commit recognized chunks only if they actually changed
      if (matchedState && matchedState !== selectedState) {
        setSelectedState(matchedState);
        loadDistrictsForState(matchedState);
      }
      if (matchedDistrict && matchedDistrict !== selectedDistrict) {
        setSelectedDistrict(matchedDistrict);
      }
    }
  }, [location, states, selectedState, selectedDistrict]); // Added dependencies for stability

  const handleStateSelect = async (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setDistricts([]);
    setModalVisible(false);
    loadDistrictsForState(state);
  };

  const handleDistrictSelect = async (district: string) => {
    setSelectedDistrict(district);
    setModalVisible(false);
  };

  const openSelection = (type: 'state' | 'district') => {
    setModalType(type);
    setModalVisible(true);
  };

  const getModalData = () => {
    if (modalType === 'state') return states;
    return districts;
  };

  const getModalLoading = () => {
    if (modalType === 'state') return loadingStates;
    return loadingDistricts;
  };

  return (
    <View style={{ gap: 16 }}>
      {/* State Selection */}
      <View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#40493d', marginBottom: 8, paddingHorizontal: 4 }}>{t('registration.state')} <Text style={{ color: 'red' }}>*</Text></Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => openSelection('state')}
          style={{ backgroundColor: '#e8e8e3', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20 }}
        >
          <Text style={{ fontSize: selectedState ? 18 : 16, color: selectedState ? '#1a1c19' : '#bfcaba', fontWeight: '500' }}>
            {selectedState || t('registration.selectState')}
          </Text>
          {loadingStates ? <ActivityIndicator color="#0d631b" /> : <MaterialIcons name="keyboard-arrow-down" size={24} color="#707a6c" />}
        </TouchableOpacity>
      </View>

      {/* District Selection */}
      <View style={{ opacity: selectedState ? 1 : 0.5 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#40493d', marginBottom: 8, paddingHorizontal: 4 }}>{t('registration.district')} <Text style={{ color: 'red' }}>*</Text></Text>
        <TouchableOpacity
          disabled={!selectedState}
          activeOpacity={0.8}
          onPress={() => openSelection('district')}
          style={{ backgroundColor: '#e8e8e3', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20 }}
        >
          <Text style={{ fontSize: selectedDistrict ? 18 : 16, color: selectedDistrict ? '#1a1c19' : '#bfcaba', fontWeight: '500' }}>
            {selectedDistrict || t('registration.selectDistrict')}
          </Text>
          {loadingDistricts ? <ActivityIndicator color="#0d631b" /> : <MaterialIcons name="keyboard-arrow-down" size={24} color="#707a6c" />}
        </TouchableOpacity>
      </View>

      {/* Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: '70%', padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1c19', textTransform: 'capitalize' }}>
                {t('common.select')} {modalType === 'state' ? t('registration.state') : t('registration.district')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#707a6c" />
              </TouchableOpacity>
            </View>

            {getModalLoading() ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0d631b" />
              </View>
            ) : (
              <FlatList
                data={getModalData()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (modalType === 'state') handleStateSelect(item);
                      if (modalType === 'district') handleDistrictSelect(item);
                    }}
                    style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f4f4ef' }}
                  >
                    <Text style={{ fontSize: 18, color: '#1a1c19' }}>{item}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <View style={{ padding: 20, alignItems: 'center' }}><Text style={{ color: '#707a6c' }}>{t('common.noOptions')}</Text></View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
