import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const langs = ['en', 'hi', 'mr'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  const getLangLabel = (code: string) => {
    switch (code) {
      case 'en': return 'EN';
      case 'hi': return 'HI';
      case 'mr': return 'MR';
      default: return code.toUpperCase();
    }
  };

  return (
    <TouchableOpacity 
      onPress={toggleLanguage}
      className="flex-row items-center bg-[#f4f4ef] px-3 py-1.5 rounded-full border border-[#bfcaba]/30 active:scale-95"
    >
      <MaterialIcons name="translate" size={16} color="#0d631b" />
      <Text className="ml-1.5 font-bold text-[11px] text-[#0d631b] uppercase">
        {getLangLabel(i18n.language)}
      </Text>
    </TouchableOpacity>
  );
}
