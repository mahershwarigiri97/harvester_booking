import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface NavigationMapProps {
  navigationStarted: boolean;
  farmerCoords?: { latitude: number; longitude: number };
  ownerCoords?: { latitude: number; longitude: number };
}

export function NavigationMapView({ navigationStarted, farmerCoords, ownerCoords }: NavigationMapProps) {
  const center = farmerCoords || ownerCoords || { latitude: 20.5937, longitude: 78.9629 };

  const routeCoords = ownerCoords && farmerCoords
    ? [ownerCoords, farmerCoords]
    : [
        { latitude: 20.59, longitude: 78.96 },
        { latitude: 20.60, longitude: 78.97 },
        { latitude: 20.61, longitude: 78.98 },
      ];

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
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
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {/* Destination marker */}
        {farmerCoords && (
          <Marker coordinate={farmerCoords} title="Farmer's Field" pinColor="#ba1a1a" />
        )}

        {/* Current location marker */}
        {ownerCoords && (
          <Marker coordinate={ownerCoords} title="Your Location" pinColor="#0d631b" />
        )}

        {/* Route polyline */}
        <Polyline
          coordinates={routeCoords}
          strokeColor={navigationStarted ? '#0d631b' : '#fcab28'}
          strokeWidth={6}
          lineDashPattern={navigationStarted ? undefined : [10, 10]}
        />
      </MapView>

      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'transparent', 'transparent', 'rgba(26,28,25,0.6)']}
        locations={[0, 0.2, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    </View>
  );
}
