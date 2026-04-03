import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OtpCounterProps {
  initialSeconds?: number;
  onResend: () => void;
}

export function OtpCounter({ initialSeconds = 24, onResend }: OtpCounterProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (seconds === 0 && !canResend) {
      setCanResend(true);
    }
  }, [seconds, canResend]);

  const handleResend = () => {
    setSeconds(initialSeconds);
    setCanResend(false);
    onResend();
  };

  return (
    <View className="flex-row justify-between items-center px-1 mb-6 w-full">
      <View>
        {canResend && (
          <TouchableOpacity 
            style={{ outlineStyle: 'none' } as any}
            onPress={handleResend}
            activeOpacity={0.8}
          >
            <Text className="font-bold text-sm text-primary">
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-on-surface-variant text-xs font-medium">
        {seconds > 0 ? `0:${seconds.toString().padStart(2, '0')} remaining` : ''}
      </Text>
    </View>
  );
}
