import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, savePushToken } from '../utils/notificationUtils';
import { useAuthStore } from '../utils/authStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>(undefined);
  const responseListener = useRef<Notifications.Subscription>(undefined);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          setExpoPushToken(token);
          savePushToken(user.id, token);
        }
      });
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, [user?.id]);

  return { expoPushToken, notification };
};
