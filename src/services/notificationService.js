import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set notification handler to show alerts while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Ask for notification permission and set up Android channels if needed.
 */
export const registerNotification = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error registering notification permissions:', error);
    return false;
  }
};

/**
 * Send local notification immediately for a new course.
 * @param {object} course 
 */
export const sendCourseNotification = async (course) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Mata Kuliah Baru',
        body: `${course.name} - ${course.credits} SKS tersedia`,
        data: { courseId: course.id },
      },
      trigger: null, // Deliver immediately
    });
  } catch (error) {
    console.error('Error sending course notification:', error);
  }
};

export default {
  registerNotification,
  sendCourseNotification,
};
