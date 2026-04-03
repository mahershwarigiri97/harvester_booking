import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DatePickerProps {
  pricePerAcre: number;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  disablePreviousDates?: boolean;
}

export function DatePicker({ pricePerAcre, selectedDate, onSelectDate, disablePreviousDates }: DatePickerProps) {
  const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  
  // State for the currently viewed month
  const [currentViewDate, setCurrentViewDate] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    d.setDate(1); // Always point to 1st of month to avoid overflow issues
    return d;
  });

  const goNextMonth = () => {
    setCurrentViewDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const goPrevMonth = () => {
    setCurrentViewDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const monthYearString = currentViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Calculate calendar grid properties
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptyStarts = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Simulate some booked days in the current view for demonstration
  // Real app would fetch availability per month
  const bookedDays = [2, 14, 21];

  return (
    <View 
      className="bg-white rounded-[32px] p-6 w-full shadow-2xl"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(203, 213, 225, 0.4)',
      }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="font-headline font-extrabold text-[#1a1c19] text-xl">
          {monthYearString}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity 
            className="p-2 rounded-full bg-[#f4f4ef] items-center justify-center active:bg-zinc-200"
            onPress={goPrevMonth}
          >
            <MaterialIcons name="chevron-left" size={24} color="#1a1c19" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="p-2 rounded-full bg-[#f4f4ef] items-center justify-center active:bg-zinc-200"
            onPress={goNextMonth}
          >
            <MaterialIcons name="chevron-right" size={24} color="#1a1c19" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* WeekDays Header */}
      <View className="flex-row w-full mb-3">
        {daysOfWeek.map((day) => (
          <View key={day} style={{ width: '14.28%', alignItems: 'center' }}>
            <Text className="text-[11px] font-bold text-zinc-400">{day}</Text>
          </View>
        ))}
      </View>
      
      {/* Calendar Grid */}
      <View className="flex-row flex-wrap w-full">
        {/* Empty Start Days */}
        {Array.from({ length: emptyStarts }).map((_, i) => (
          <View key={`empty-${i}`} style={{ width: '14.28%', paddingVertical: 16 }} />
        ))}
        
        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const currentDate = new Date(year, month, dayNumber);
          
          let isPast = false;
          if (disablePreviousDates) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            isPast = currentDate < today;
          }

          const isBooked = bookedDays.includes(dayNumber);
          const isDisabled = isBooked || isPast;
          const isSelected = selectedDate?.getDate() === dayNumber && 
                             selectedDate?.getMonth() === month &&
                             selectedDate?.getFullYear() === year;
          
          return (
            <TouchableOpacity 
              key={`day-${dayNumber}`}
              activeOpacity={isDisabled ? 1 : 0.7}
              onPress={() => {
                if (!isDisabled) {
                  onSelectDate(currentDate);
                }
              }}
              style={{ width: '14.28%', alignItems: 'center', marginVertical: 3 }}
            >
              {isSelected ? (
                <View 
                  className="w-[96%] py-2 rounded-2xl items-center"
                  style={{
                    backgroundColor: 'rgba(13, 99, 27, 0.1)', // primary-container/10
                    borderWidth: 2,
                    borderColor: '#0d631b', // primary
                  }}
                >
                  <Text className="text-sm font-bold" style={{ color: '#0d631b' }}>{dayNumber}</Text>
                  <Text className="text-[9px] font-bold" style={{ color: '#2e7d32' }}>₹{pricePerAcre}</Text>
                </View>
              ) : (
                <View className="w-[96%] py-2 items-center">
                  <Text className={`text-sm ${isDisabled ? 'font-semibold text-zinc-300' : 'font-semibold text-[#1a1c19]'}`}>
                    {dayNumber}
                  </Text>
                  <Text className={`text-[9px]`} style={{ color: isDisabled ? '#d4d4d8' : '#0d631b' }}>
                    {isBooked ? 'Booked' : isDisabled ? '-' : `₹${pricePerAcre}`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
