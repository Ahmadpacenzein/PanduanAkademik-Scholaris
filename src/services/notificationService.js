import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import storageManager from '../utils/storageManager';

const NOTIFICATION_CHANNEL_ID = 'academic-updates';
const PUSH_TOKEN_ENDPOINT = process.env.EXPO_PUBLIC_PUSH_TOKEN_ENDPOINT;

// SDK 54: show a banner/list entry even while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Create the Android channel before requesting permission (required on Android 13+).
 */
const configureNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Pembaruan Akademik',
      description: 'Mata kuliah dan informasi akademik terbaru',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6750A4',
      sound: 'default',
    });
  }
};

const sendPushTokenToBackend = async (expoPushToken) => {
  if (!PUSH_TOKEN_ENDPOINT) {
    return { registered: false, reason: 'backend_not_configured' };
  }

  const response = await fetch(PUSH_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: expoPushToken,
      platform: Platform.OS,
      deviceName: Device.deviceName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Push token endpoint returned HTTP ${response.status}`);
  }

  return { registered: true };
};

/**
 * Ask permission, obtain the Expo push token, save it locally, and optionally
 * send it to EXPO_PUBLIC_PUSH_TOKEN_ENDPOINT.
 */
export const registerNotification = async () => {
  try {
    await configureNotificationChannel();

    const existingPermissions = await Notifications.getPermissionsAsync();
    let finalStatus = existingPermissions.status;

    if (finalStatus !== 'granted') {
      const requestedPermissions = await Notifications.requestPermissionsAsync();
      finalStatus = requestedPermissions.status;
    }

    if (finalStatus !== 'granted') {
      return {
        permissionGranted: false,
        remotePushSupported: false,
        reason: 'permission_denied',
      };
    }

    // Remote push is unavailable in Expo Go on Android since SDK 53.
    const isExpoGoAndroid =
      Platform.OS === 'android' && Constants.appOwnership === 'expo';

    if (isExpoGoAndroid) {
      return {
        permissionGranted: true,
        remotePushSupported: false,
        reason: 'expo_go_android',
      };
    }

    if (!Device.isDevice) {
      return {
        permissionGranted: true,
        remotePushSupported: false,
        reason: 'physical_device_required',
      };
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      return {
        permissionGranted: true,
        remotePushSupported: false,
        reason: 'eas_project_id_missing',
      };
    }

    const expoPushToken = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    await storageManager.saveExpoPushToken(expoPushToken);
    const backend = await sendPushTokenToBackend(expoPushToken);

    return {
      permissionGranted: true,
      remotePushSupported: true,
      expoPushToken,
      backendRegistered: backend.registered,
      reason: backend.reason,
    };
  } catch (error) {
    console.error('Error registering push notifications:', error);
    return {
      permissionGranted: false,
      remotePushSupported: false,
      reason: 'registration_failed',
      error: error.message,
    };
  }
};

/**
 * Send local notification immediately for a new course.
 * @param {object} course 
 */
export const sendCourseNotification = async (course) => {
  try {
    const settings = await storageManager.getSettings();
    if (!settings.notifications) {
      return null;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Mata Kuliah Baru',
        body: `${course.name} - ${course.credits} SKS tersedia`,
        sound: 'default',
        data: {
          courseId: course.id,
          url: `scholaris://courses/${course.id}`,
        },
      },
      trigger: Platform.OS === 'android'
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
            channelId: NOTIFICATION_CHANNEL_ID,
          }
        : null,
    });
  } catch (error) {
    console.error('Error sending course notification:', error);
  }
};

export const sendEnrollmentNotification = async (course) => {
  try {
    const settings = await storageManager.getSettings();
    if (!settings.notifications) {
      return null;
    }

    await configureNotificationChannel();
    return Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pendaftaran Mata Kuliah Berhasil',
        body: `${course.name} (${course.code}) berhasil diambil.`,
        sound: 'default',
        data: {
          type: 'course-enrollment',
          courseId: course.id,
          url: `scholaris://courses/${course.id}`,
        },
      },
      trigger: Platform.OS === 'android'
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
            channelId: NOTIFICATION_CHANNEL_ID,
          }
        : null,
    });
  } catch (error) {
    console.error('Error sending enrollment notification:', error);
    return null;
  }
};

export const sendTestNotification = async () => {
  await configureNotificationChannel();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tes Notifikasi Scholaris',
      body: 'Popup notifikasi sudah aktif di perangkat ini.',
      sound: 'default',
      data: { type: 'notification-test' },
    },
    trigger: Platform.OS === 'android'
      ? {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
          channelId: NOTIFICATION_CHANNEL_ID,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
  });
};

export default {
  registerNotification,
  sendCourseNotification,
  sendEnrollmentNotification,
  sendTestNotification,
};
