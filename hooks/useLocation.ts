import * as Location from 'expo-location';
import { useState } from 'react';

export function useLocation(onLocationFetched?: (data: { street: string; city: string; pincode?: string }) => void) {
  const [locationStr, setLocationStr] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLiveLocation = async () => {
    setLoadingLocation(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      // Reverse geocode to get a readable address string
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const addressParts = [
          place.name || place.street,
          place.subregion || place?.district || place.city,
          place.region,
          place.postalCode
        ].filter(Boolean); // removes undefined or null values

        setLocationStr(addressParts.join(', '));

        // Pass specific strings back for autocompletion
        if (onLocationFetched) {
          onLocationFetched({
            street: place.street || place.name || '',
            city: place.city || place.subregion || place.district || '',
            pincode: place.postalCode || ''
          });
        }
      } else {
        setLocationStr(`${location.coords.latitude}, ${location.coords.longitude}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Error fetching location.');
    } finally {
      setLoadingLocation(false);
    }
  };

  return { locationStr, setLocationStr, fetchLiveLocation, loadingLocation, errorMsg };
}
