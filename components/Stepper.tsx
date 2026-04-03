import React from 'react';
import { View, Text } from 'react-native';

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function Stepper({ 
  currentStep, 
  totalSteps = 3, 
  activeColor = '#0d631b', 
  inactiveColor = '#e3e3de' 
}: StepperProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index < currentStep;
        return (
          <View 
            key={index} 
            style={{ 
              height: 8, 
              width: 64, 
              backgroundColor: isActive ? activeColor : inactiveColor, 
              borderRadius: 4 
            }} 
          />
        );
      })}
      <Text 
        style={{ 
          marginLeft: 8, 
          fontSize: 12, 
          fontWeight: '700', 
          color: activeColor, 
          textTransform: 'uppercase', 
          letterSpacing: 1 
        }}
      >
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}
