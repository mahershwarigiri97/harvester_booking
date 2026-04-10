import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { t } = useTranslation();
  return (
    <View 
      className="absolute bottom-0 left-0 w-full h-24 bg-white flex-row justify-around items-center px-4 pb-2 rounded-t-[32px] z-50"
      style={{
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 24,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = 'crop-square';
        let label = 'Tab';
        if (route.name === 'index') {
          iconName = 'home-work';
          label = t('common.home');
        } else if (route.name === 'bookings') {
          iconName = 'agriculture';
          label = t('common.bookings');
        } else if (route.name === 'profile') {
          iconName = 'person';
          label = t('common.profile');
        } else if (route.name === 'map') {
          iconName = 'map';
          label = t('common.map');
        }

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{ outlineStyle: 'none' } as any}
            className={`flex-col items-center justify-center px-6 py-2 pb-3 mb-2 rounded-[24px] ${isFocused ? 'bg-[#d3e8d3]' : 'bg-transparent'}`}
          >
            <MaterialIcons name={iconName as any} size={24} color={isFocused ? '#0d631b' : '#43493e'} />
            <Text className={`font-body font-bold text-xs mt-1 tracking-wide ${isFocused ? 'text-[#0d631b]' : 'text-[#43493e]'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
