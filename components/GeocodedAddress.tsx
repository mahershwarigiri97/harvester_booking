import React, { useState, useEffect } from 'react';
import { Text, TextProps } from 'react-native';
import * as Location from 'expo-location';

interface GeocodedAddressProps extends TextProps {
  latitude?: number;
  longitude?: number;
  fallback?: string;
}

export function GeocodedAddress({ latitude, longitude, fallback = 'Location not specified', style, ...props }: GeocodedAddressProps) {
  const [address, setAddress] = useState<string>('Loading...');

  useEffect(() => {
    if (!latitude || !longitude) {
      setAddress(fallback);
      return;
    }

    let isMounted = true;

    const fetchAddress = async () => {
      try {
        const response = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (isMounted && response.length > 0) {
          const place = response[0];
          console.log(place, "place")
          const loc = place.district || place.city || place.subregion || place.name || 'Unknown Zone';
          const state = place.region || '';
          setAddress(state && loc !== state ? `${loc}, ${state}` : loc);
        } else if (isMounted) {
          setAddress('Location not found');
        }
      } catch (error) {
        if (isMounted) setAddress('Error fetching location');
      }
    };

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude, fallback]);

  return (
    <Text style={style} {...props} numberOfLines={1}>
      {address}
    </Text>
  );
}
