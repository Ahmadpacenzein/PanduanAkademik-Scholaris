import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import apiService from '../services/apiService';
import storageManager from '../utils/storageManager';
import notificationService from '../services/notificationService';

export const BACKGROUND_SYNC_TASK = 'background-course-sync';

// Define the background task
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log('[Background Fetch] Running sync task...');
    
    // 1. Fetch current local courses (before merge)
    const localCourses = await storageManager.getCourseData();
    const localIds = new Set(localCourses.map(c => c.id));
    
    // 2. Fetch server courses
    const serverCourses = await apiService.getCoursesFromServer();
    
    // 3. Find if there are any new courses from server
    const newCourses = serverCourses.filter(course => !localIds.has(course.id));
    
    // 4. Merge server & local (this saves to @scholaris_courses)
    await apiService.mergeServerAndLocal();
    
    // 5. Send notifications for any new courses if permission granted
    if (newCourses.length > 0) {
      console.log(`[Background Fetch] Found ${newCourses.length} new course(s)`);
      for (const course of newCourses) {
        await notificationService.sendCourseNotification(course);
      }
    }
    
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('[Background Fetch] Task failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Function to register the task
export const registerBackgroundTask = async () => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: 30 * 60, // 30 minutes in seconds
        stopOnTerminate: false, // keep running after app closed
        startOnBoot: true, // keep running after device reboot
      });
      console.log('[Background Fetch] Task registered successfully');
    } else {
      console.log('[Background Fetch] Task already registered');
    }
  } catch (error) {
    console.error('[Background Fetch] Failed to register task:', error);
  }
};
