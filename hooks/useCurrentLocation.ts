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

export function useCurrentLocation(shouldWatch: boolean = false) {
  const [locationName, setLocationName] = useState<string>('Fetching location...');
  const [locationData, setLocationData] = useState<LocationDetail | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let watchSubscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLocationName('Permission denied');
          setLoading(false);
          return;
        }

        const handleLocationUpdate = async (locationResp: Location.LocationObject) => {
          setLocation(locationResp);
          const { latitude, longitude } = locationResp.coords;

          try {
            let response = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });

            if (response.length > 0) {
              const place = response[0];
              const district = place.district || place.subregion || place.city || 'Unknown District';
              const state = place.region || 'Unknown State';
              setLocationName(`${district}, ${state}`);
              setLocationData({
                street: place.street || null,
                city: place.city || null,
                district: place.district || null,
                subregion: place.subregion || null,
                region: place.region || null,
                postalCode: place.postalCode || null,
                country: place.country || null,
                isoCountryCode: place.isoCountryCode || null,
                name: place.name || null,
              });
            }
          } catch (e) {}
        };

        // Initial fetch
        let locationResp = await Location.getCurrentPositionAsync({});
        await handleLocationUpdate(locationResp);

        // Optional watching
        if (shouldWatch) {
          watchSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.BestForNavigation,
              timeInterval: 1000, // Update every second
              distanceInterval: 1, // Or every 1 meter
            },
            handleLocationUpdate
          );
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error fetching location');
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (watchSubscription) {
        watchSubscription.remove();
      }
    };
  }, [shouldWatch]);

  return { locationName, locationData, errorMsg, loading, currentLocation: location };
}
