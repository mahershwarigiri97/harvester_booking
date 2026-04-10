import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
};

const LANGUAGE_KEY = 'user-language';

// Define the async init function to setup i18n
export const initI18n = async () => {
  let initialLanguage = 'en';

  try {
    // 1. Try to get saved language from storage
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    
    if (savedLanguage && resources.hasOwnProperty(savedLanguage)) {
      initialLanguage = savedLanguage;
    } else {
      // 2. If no saved pref, use device settings
      const deviceLocales = Localization.getLocales();
      if (deviceLocales && deviceLocales.length > 0) {
        const systemLang = deviceLocales[0].languageCode;
        if (systemLang && resources.hasOwnProperty(systemLang)) {
          initialLanguage = systemLang;
        }
      }
    }
  } catch (err) {
    console.warn('[i18n] Error loading initial language:', err);
  }

  return i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: 'v4',
    });
};

// Start initialization immediately
initI18n();

// Listen for language changes and persist them to AsyncStorage
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem(LANGUAGE_KEY, lng).catch(err => 
    console.warn('[i18n] Failed to persist language change:', err)
  );
});

export default i18n;
