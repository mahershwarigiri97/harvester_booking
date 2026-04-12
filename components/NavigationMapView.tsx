import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LeafletMap } from './LeafletMap';

import { fetchRouteCoordinates, calculateDistance } from '../utils/locationUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NavigationMapProps {
  navigationStarted: boolean;
  farmerCoords?: { latitude: number; longitude: number };
  ownerCoords?: { latitude: number; longitude: number };
  ownerHeading?: number | null;
}


export function NavigationMapView({ navigationStarted, farmerCoords, ownerCoords, ownerHeading }: NavigationMapProps) {
  const [routeCoordinates, setRouteCoordinates] = React.useState<{ latitude: number; longitude: number }[]>([]);
  const [navigationSteps, setNavigationSteps] = React.useState<any[]>([]);
  const [stableHeading, setStableHeading] = React.useState<number>(0);
  const [mapInitialized, setMapInitialized] = React.useState(false);
  
  // Set the map center - prioritize owner position for navigation focus
  const center = React.useMemo(() => {
    if (ownerCoords) return ownerCoords;
    if (farmerCoords) return farmerCoords;
    return { latitude: 20.5937, longitude: 78.9629 };
  }, [ownerCoords?.latitude, ownerCoords?.longitude, farmerCoords?.latitude, farmerCoords?.longitude]);

  // Handle auto-focus on screen open
  React.useEffect(() => {
    if (ownerCoords && !mapInitialized) {
      setMapInitialized(true);
    }
  }, [ownerCoords, mapInitialized]);

  // Smoothing the heading to prevent flickering
  React.useEffect(() => {
    if (ownerHeading !== null && ownerHeading !== undefined) {
      if (Math.abs(ownerHeading - stableHeading) > 3) {
        setStableHeading(ownerHeading);
      }
    }
  }, [ownerHeading]);

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

  // Sync polyline with current position - trim already passed points
  const syncedPolyline = React.useMemo(() => {
    if (!ownerCoords || routeCoordinates.length === 0) return routeCoordinates;

    // Find the closest point index on the polyline
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < Math.min(routeCoordinates.length, 10); i++) { // Only check first 10 points to avoid jumping to nearby parallel roads
      const p = routeCoordinates[i];
      const dist = calculateDistance(ownerCoords.latitude, ownerCoords.longitude, p.latitude, p.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    // Slice from closest point and prepend current position for perfect sync
    const trimmed = routeCoordinates.slice(closestIndex);
    return [ownerCoords, ...trimmed];
  }, [ownerCoords, routeCoordinates]);

  const markers = React.useMemo(() => {
    const list = [];
    if (farmerCoords) {
      list.push({
        id: 'farmer',
        latitude: farmerCoords.latitude,
        longitude: farmerCoords.longitude,
        icon: 'farmer' as const
      });
    }
    if (ownerCoords) {
      list.push({
        id: 'owner',
        latitude: ownerCoords.latitude,
        longitude: ownerCoords.longitude,
        icon: 'owner' as const,
        heading: stableHeading
      });
    }
    return list;
  }, [farmerCoords, ownerCoords, stableHeading]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LeafletMap
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        markers={markers}
        polyLine={syncedPolyline}
      />

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
