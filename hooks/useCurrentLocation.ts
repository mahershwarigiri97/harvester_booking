import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export interface LocationDetail {
  street: string | null;
  city: string | null;
  district: string | null;
  subregion: string | null;
  region: string | null; // Often the State
  postalCode: string | null;
  country: string | null;
  isoCountryCode: string | null;
  name: string | null;
}

export function useCurrentLocation() {
  const [locationName, setLocationName] = useState<string>('Fetching location...');
  const [locationData, setLocationData] = useState<LocationDetail | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLocationName('Permission denied');
          setLoading(false);
          return;
        }

        let locationResp = await Location.getCurrentPositionAsync({});
        setLocation(locationResp);
        const { latitude, longitude } = locationResp.coords;

        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (response.length > 0) {
          const place = response[0];

          // Full object with all details
          const fullLocation: LocationDetail = {
            street: place.street,
            city: place.city,
            district: place.district,
            subregion: place.subregion,
            region: place.region,
            postalCode: place.postalCode,
            country: place.country,
            isoCountryCode: place.isoCountryCode,
            name: place.name,
          };
          setLocationData(fullLocation);

          // Dashboard display string: District, State
          const district = place.district || place.subregion || place.city || 'Unknown District';
          const state = place.region || 'Unknown State';
          setLocationName(`${district}, ${state}`);
        } else {
          setLocationName('Location not found');
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error fetching location');
        setLocationName('Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { locationName, locationData, errorMsg, loading, currentLocation: location };
}
