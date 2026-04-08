import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Animated, Easing, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../utils/api';
import { Alert } from 'react-native';
import SuccessModal from './SuccessModal';

interface BookingRequestPopupProps {
  visible: boolean;
  onClose: () => void;
  booking: any;
}

export default function BookingRequestPopup({ visible, onClose, booking }: BookingRequestPopupProps) {
  const queryClient = useQueryClient();
  const { currentLocation } = useCurrentLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  const statusMutation = useMutation({
    mutationFn: (status: 'accepted' | 'cancelled') => 
      authApi.updateBookingStatus(booking?.id, status, undefined, status === 'cancelled' ? 'Owner rejected mapping' : undefined, 'owner'),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['harvesters'] });
      
      if (status === 'accepted') {
        setShowSuccess(true);
      } else {
        onClose();
      }
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update booking. Please check your connection.');
    }
  });

  if (!booking && visible) return null;

  const destLat = booking?.full_address?.latitude;
  const destLng = booking?.full_address?.longitude;
  const sourceLat = currentLocation?.coords?.latitude;
  const sourceLng = currentLocation?.coords?.longitude;

  const initialRegion = sourceLat && sourceLng && destLat && destLng ? {
    latitude: (sourceLat + destLat) / 2,
    longitude: (sourceLng + destLng) / 2,
    latitudeDelta: Math.abs(sourceLat - destLat) * 1.5 + 0.01,
    longitudeDelta: Math.abs(sourceLng - destLng) * 1.5 + 0.01,
  } : {
    latitude: destLat || 20.5937,
    longitude: destLng || 78.9629,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const [routeCoords, setRouteCoords] = useState<{latitude: number, longitude: number}[]>([]);

  useEffect(() => {
    if (sourceLat && sourceLng && destLat && destLng) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${sourceLng},${sourceLat};${destLng},${destLat}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c: any) => ({
              latitude: c[1],
              longitude: c[0]
            }));
            setRouteCoords(coords);
          } else {
             setRouteCoords([{ latitude: sourceLat, longitude: sourceLng }, { latitude: destLat, longitude: destLng }]);
          }
        } catch (e) {
          setRouteCoords([{ latitude: sourceLat, longitude: sourceLng }, { latitude: destLat, longitude: destLng }]);
        }
      };
      fetchRoute();
    }
  }, [sourceLat, sourceLng, destLat, destLng]);
  const mapRef = React.useRef<MapView>(null);

  useEffect(() => {
    if (routeCoords.length > 0 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(routeCoords, {
          edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
          animated: true,
        });
      }, 500);
    }
  }, [routeCoords]);

  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="slide" 
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(26,28,25,0.4)' }}>
        <View 
          className="bg-surface w-full overflow-hidden"
          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.12,
            shadowRadius: 40,
            elevation: 20,
            maxHeight: 795,
          }}
        >
          {/* Header & Timer Section */}
          <View className="p-6 bg-primary-container flex-row justify-between items-center overflow-hidden gap-4">
            <View className="z-10 flex-1">
              <Text className="font-headline font-bold text-lg text-on-primary-container leading-tight">Incoming Request</Text>
              <Text className="text-xs font-medium mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Respond immediately to secure the booking</Text>
            </View>
            <TouchableOpacity 
              onPress={onClose} 
              className="z-10 w-10 h-10 items-center justify-center rounded-full bg-white/20 active:scale-95"
            >
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>

            {/* Decorative background circle */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          </View>

          {/* Details Content */}
          <View className="p-6 space-y-6">
            {/* Farmer & Crop Bento Header */}
            <View className="flex-row gap-4 w-full">
              <View className="flex-1 bg-surface-container-low p-4 rounded-3xl flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center">
                  <MaterialIcons name="person" size={24} color="#002204" />
                </View>
                <View className="flex-shrink">
                  <Text className="text-xs text-on-surface-variant font-medium">Farmer</Text>
                  <Text className="font-headline font-bold text-on-surface" numberOfLines={1}>
                    {booking?.farmer?.name || booking?.customer_name || 'Farmer'}
                  </Text>
                </View>
              </View>
              <View className="flex-1 bg-surface-container-low p-4 rounded-3xl flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center">
                  <MaterialIcons name="grass" size={24} color="#2a1800" />
                </View>
                <View className="flex-shrink">
                  <Text className="text-xs text-on-surface-variant font-medium">Crop Type</Text>
                  <Text className="font-headline font-bold text-on-surface" numberOfLines={1}>
                    {booking?.crop_type || 'General'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Map & Location Section */}
            <View className="mt-6 mb-2">
              <View className="flex-row items-center gap-2 mb-3 px-2">
                <MaterialIcons name="location-on" size={24} color="#0d631b" />
                <Text className="font-headline font-bold text-on-surface text-lg">
                  {booking?.full_address?.village || booking?.full_address?.district || 'Location Details'}
                </Text>
              </View>
              <View className="h-48 w-full rounded-[32px] overflow-hidden bg-surface-container-highest relative">
                <MapView
                  ref={mapRef}
                  style={{ width: '100%', height: '100%' }}
                  initialRegion={initialRegion}
                  scrollEnabled={true}
                  zoomEnabled={true}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  mapType="none"
                >
                  <UrlTile
                    urlTemplate="https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
                    maximumZ={19}
                    flipY={false}
                    tileSize={512}
                  />
                  {(booking?.full_address?.latitude && booking?.full_address?.longitude && currentLocation?.coords) && (
                    <>
                      <Polyline 
                        coordinates={routeCoords.length > 0 ? routeCoords : [
                          {
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                          },
                          {
                            latitude: booking.full_address.latitude,
                            longitude: booking.full_address.longitude,
                          }
                        ]}
                        strokeColor="#0d631b"
                        strokeWidth={4}
                      />
                      <Marker
                        coordinate={{
                          latitude: currentLocation.coords.latitude,
                          longitude: currentLocation.coords.longitude,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                        title="Your Location"
                      >
                        <View className="items-center justify-center">
                          <View className="w-6 h-6 bg-secondary-fixed rounded-full border-[3px] border-white flex items-center justify-center shadow-sm">
                            <View className="w-2 h-2 bg-[#2a1800] rounded-full" />
                          </View>
                        </View>
                      </Marker>
                    </>
                  )}
                  <Marker
                    coordinate={{
                      latitude: booking?.full_address?.latitude || 20.5937,
                      longitude: booking?.full_address?.longitude || 78.9629,
                    }}
                    title="Farmer's Location"
                  >
                    <View className="items-center justify-center">
                      <View 
                        className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-white" 
                        style={{ elevation: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                      >
                        <MaterialIcons name="agriculture" size={20} color="white" />
                      </View>
                      <View className="mt-1 w-4 h-1 bg-black/40 rounded-full" />
                    </View>
                  </Marker>
                </MapView>
                <LinearGradient 
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} 
                  className="absolute inset-x-0 bottom-0 h-1/3" 
                  pointerEvents="none"
                />
              </View>
            </View>

            {/* Financials & Duration Bento */}
            <View className="flex-row gap-4 w-full mt-4">
              <View className="flex-1 bg-surface-container-low p-5 rounded-[32px]">
                <Text className="text-xs text-on-surface-variant font-medium mb-1">Total land Area</Text>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="map" size={22} color="#0d631b" />
                  <Text className="font-headline font-extrabold text-xl text-on-surface">{booking?.land_area} Ac</Text>
                </View>
              </View>
              <View className="flex-1 bg-secondary-container/10 border-[2px] p-5 rounded-[32px]" style={{ borderColor: 'rgba(252, 171, 40, 0.2)' }}>
                <Text className="text-xs font-medium mb-1" style={{ color: '#694300' }}>Total Earning</Text>
                <Text className="font-headline font-extrabold text-2xl mt-1" style={{ color: '#694300' }}>₹{booking?.price?.toLocaleString() || '0'}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="p-6 bg-surface-container-low flex-row gap-4 border-t" style={{ borderColor: 'rgba(191,202,186,0.1)' }}>
            <TouchableOpacity 
              onPress={() => statusMutation.mutate('cancelled')}
              disabled={statusMutation.isPending}
              className="flex-1 h-16 rounded-3xl bg-surface-container-highest flex-row items-center justify-center gap-2 active:scale-95"
            >
              <MaterialIcons name="close" size={24} color="#1a1c19" />
              <Text className="font-headline font-bold text-on-surface text-lg">Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => statusMutation.mutate('accepted')}
              disabled={statusMutation.isPending}
              className="flex-1 h-16 rounded-3xl flex-row items-center justify-center gap-2 active:scale-95"
              style={{ elevation: 8, shadowColor: '#0d631b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 }}
            >
              <View className="absolute inset-0 rounded-3xl overflow-hidden">
                <LinearGradient colors={['#0d631b', '#2e7d32']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="w-full h-full" />
              </View>
              {statusMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="check-circle" size={24} color="white" />
                  <Text className="font-headline font-extrabold text-white text-lg ml-1">Accept</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <SuccessModal 
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        title="Accepted!"
        message={`You've successfully accepted ${booking?.farmer?.name || booking?.customer_name}'s request.`}
        buttonLabel="Go to Dashboard"
      />
    </Modal>
  );
}
