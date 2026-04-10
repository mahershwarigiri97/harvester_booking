import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';

interface BookingAddressProps extends TextProps {
  address: any;
  fallback?: string;
}

export function BookingAddress({ address, fallback, ...props }: BookingAddressProps) {
  const { t } = useTranslation();
  const defaultFallback = fallback || t('common.farmLocation');

  if (!address) {
    return <Text {...props}>{defaultFallback}</Text>;
  }

  // Extract the most relevant location details provided by Nominatim 
  const localArea = address.village || address.town || address.suburb || address.city || address.neighbourhood;
  const region = address.district || address.state_district || address.county || address.state;

  let displayAddress = '';
  if (localArea && region && localArea !== region) {
    displayAddress = `${localArea}, ${region}`;
  } else if (localArea) {
    displayAddress = localArea;
  } else if (region) {
    displayAddress = region;
  } else {
    displayAddress = defaultFallback;
  }

  // Ensure reasonable character length by truncating if needed
  return (
    <Text numberOfLines={1} ellipsizeMode="tail" {...props}>
      {displayAddress}
    </Text>
  );
}
