import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { fetchRouteCoordinates, calculateDistance } from '../utils/locationUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NavigationMapProps {
  navigationStarted: boolean;
  farmerCoords?: { latitude: number; longitude: number };
  ownerCoords?: { latitude: number; longitude: number };
  ownerHeading?: number | null;
}

export function NavigationMapView({ navigationStarted, farmerCoords, ownerCoords, ownerHeading }: NavigationMapProps) {
  const mapRef = React.useRef<MapView>(null);
  const [routeCoordinates, setRouteCoordinates] = React.useState<{ latitude: number; longitude: number }[]>([]);
  const [navigationSteps, setNavigationSteps] = React.useState<any[]>([]);
  const [stableHeading, setStableHeading] = React.useState<number>(0);
  const center = ownerCoords || farmerCoords || { latitude: 20.5937, longitude: 78.9629 };

  // Smoothing the heading to prevent flickering
  React.useEffect(() => {
    if (ownerHeading !== null && ownerHeading !== undefined) {
      if (Math.abs(ownerHeading - stableHeading) > 3) {
        setStableHeading(ownerHeading);
      }
    }
  }, [ownerHeading]);

  React.useEffect(() => {
    if (ownerCoords && mapRef.current) {
      mapRef.current.animateToRegion({
        ...ownerCoords,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }
  }, [ownerCoords?.latitude, ownerCoords?.longitude]);

  const lastRouteFetchPos = React.useRef<{ latitude: number; longitude: number } | null>(null);

  React.useEffect(() => {
    async function getRoute() {
      if (!ownerCoords || !farmerCoords) return;

      const shouldFetch = !lastRouteFetchPos.current || 
        Math.abs(ownerCoords.latitude - lastRouteFetchPos.current.latitude) > 0.0005 || 
        Math.abs(ownerCoords.longitude - lastRouteFetchPos.current.longitude) > 0.0005;

      if (shouldFetch) {
        const result = await fetchRouteCoordinates(ownerCoords, farmerCoords);
        if (result.coordinates) {
          setRouteCoordinates(result.coordinates);
          setNavigationSteps(result.steps || []);
          lastRouteFetchPos.current = ownerCoords;
        }
      }
    }
    getRoute();
  }, [farmerCoords?.latitude, farmerCoords?.longitude, ownerCoords?.latitude, ownerCoords?.longitude]);

  // Filter out steps that have already been passed
  const upcomingSteps = React.useMemo(() => {
    if (!ownerCoords || navigationSteps.length === 0) return [];
    
    let startIndex = 0;
    for (let i = 0; i < navigationSteps.length; i++) {
       const step = navigationSteps[i];
       const distToStep = calculateDistance(
         ownerCoords.latitude, 
         ownerCoords.longitude, 
         step.location.latitude, 
         step.location.longitude
       ) * 1000;

       if (distToStep > 40) { // If > 40 meters away, this is definitely ahead
         startIndex = i;
         break;
       }
       if (i === navigationSteps.length - 1) startIndex = i;
    }

    return navigationSteps.slice(startIndex).map(step => {
       const d = calculateDistance(
         ownerCoords.latitude, 
         ownerCoords.longitude, 
         step.location.latitude, 
         step.location.longitude
       ) * 1000;
       return { ...step, liveDistance: d };
    });
  }, [ownerCoords?.latitude, ownerCoords?.longitude, navigationSteps]);

  const renderFarmerMarker = React.useMemo(() => {
    if (!farmerCoords) return null;
    return (
      <Marker coordinate={farmerCoords} title="Farmer's Field">
        <View className="items-center justify-center">
          <View className="bg-red-500 p-2 rounded-full border-2 border-white shadow-lg">
            <MaterialIcons name="location-on" size={20} color="white" />
          </View>
        </View>
      </Marker>
    );
  }, [farmerCoords?.latitude, farmerCoords?.longitude]);

  const renderOwnerMarker = React.useMemo(() => {
    if (!ownerCoords) return null;
    return (
      <Marker 
        coordinate={ownerCoords} 
        title="Your Location"
        anchor={{ x: 0.5, y: 0.5 }}
        rotation={stableHeading}
        flat={true}
      >
        <View className="items-center justify-center">
          <View 
            className="bg-primary p-2 rounded-full border-2 border-white shadow-lg"
            style={{ 
              shadowColor: '#0d631b',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8
            }}
          >
            <MaterialIcons 
              name="navigation" 
              size={20} 
              color="white" 
              style={{ transform: [{ rotate: '-45deg' }] }} 
            />
          </View>
        </View>
      </Marker>
    );
  }, [ownerCoords?.latitude, ownerCoords?.longitude, stableHeading]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        mapType="none"
      >
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
          maximumZ={19}
          flipY={false}
          tileSize={512}
        />

        {renderFarmerMarker}
        {renderOwnerMarker}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={navigationStarted ? '#0d631b' : '#fcab28'}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Single Navigation Guidance Card (Focused) */}
      {navigationStarted && upcomingSteps.length > 0 && (
        <View className="absolute top-12 left-6 right-6 z-50">
          <View 
            className="bg-primary/95 p-5 rounded-3xl flex-row items-center gap-5 shadow-2xl border-2 border-white/20"
            style={{ 
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20
            }}
          >
            <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center">
              <MaterialIcons 
                name={upcomingSteps[0].instruction.includes('left') ? 'turn-left' : 
                      upcomingSteps[0].instruction.includes('right') ? 'turn-right' : 'straight'} 
                size={36} 
                color="white" 
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                  Next Step
                </Text>
              </View>
              <Text className="text-white text-xl font-headline font-black leading-6" numberOfLines={1}>
                {upcomingSteps[0].instruction.replace('turn ', '').replace('straight', 'Keep Straight')}
              </Text>
              <Text className="text-white/90 text-sm font-bold mt-1">
                {(upcomingSteps[0].liveDistance > 1000 ? (upcomingSteps[0].liveDistance/1000).toFixed(1) + ' km' : upcomingSteps[0].liveDistance.toFixed(0) + ' m')}
              </Text>
              <Text className="text-white/50 text-[11px] font-medium mt-0.5 uppercase" numberOfLines={1}>
                onto {upcomingSteps[0].name || 'Main Road'}
              </Text>
            </View>
          </View>
        </View>
      )}

      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'transparent', 'transparent', 'rgba(26,28,25,0.6)']}
        locations={[0, 0.2, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    </View>
  );
}
