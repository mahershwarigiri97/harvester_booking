import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

function OwnerTabBar({ state, descriptors, navigation }: any) {
  return (
    <View
      className="absolute bottom-0 left-0 right-0 w-full flex-row justify-around items-center px-4 pt-3 pb-6 bg-surface dark:bg-inverse-surface rounded-t-3xl z-50"
      style={{
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 24,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Force exactly 4 strict tabs, block everything else (index, _sitemap, cached ghosts)
        const allowedRoutes = ['dashboard', 'bookings', 'earnings', 'profile'];
        if (!allowedRoutes.includes(route.name)) {
          return null;
        }

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

        let iconName: any = 'home';
        let label = 'Home';
        if (route.name === 'bookings') {
          iconName = 'history';
          label = 'Bookings';
        } else if (route.name === 'earnings') {
          iconName = 'payments';
          label = 'Earnings';
        } else if (route.name === 'profile') {
          iconName = 'person';
          label = 'Profile';
        }

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.88}
            onPress={onPress}
            style={{ outlineStyle: 'none' } as any}
            className={`flex flex-col items-center justify-center px-5 py-2 ${isFocused
              ? 'bg-primary/10 dark:bg-primary/20 rounded-2xl'
              : 'bg-transparent'
              }`}
          >
            <MaterialIcons
              name={iconName}
              size={24}
              color={isFocused ? '#0d631b' : '#444941'}
            />
            <Text
              className={`font-body text-xs font-semibold tracking-wide mt-1 ${isFocused ? 'text-primary dark:text-inverse-primary' : 'text-on-surface-variant dark:text-outline-variant'
                }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function OwnerLayout() {
  return (
    <Tabs
      tabBar={props => <OwnerTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      {/* Explicitly hide the redirect index from rendering a tab */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="earnings" options={{ title: 'Earnings' }} />
      <Tabs.Screen name="profile" options={{ title: 'Account' }} />
    </Tabs>
  );
}
