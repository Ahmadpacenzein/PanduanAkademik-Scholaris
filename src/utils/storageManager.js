import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_STUDENT, MOCK_COURSES } from '../constants/mockData';

const DEFAULT_SETTINGS = {
  darkMode: false,
  notifications: true,
  language: 'id',
};

const STORAGE_KEYS = {
  STUDENT: '@scholaris_student',
  COURSES: '@scholaris_courses',
  ENROLLMENTS: '@scholaris_enrollments',
  SETTINGS: '@scholaris_settings',
  NOTIFICATIONS: '@scholaris_notifications',
  LAST_SYNC: '@scholaris_last_sync',
};

const parseStoredJson = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Error parsing stored JSON:', error);
    return fallback;
  }
};

const storageManager = {
  // Initialize storage with mock data on first app load
  initializeStorage: async () => {
    try {
      const existingCourses = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
      const existingStudent = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT);
      const existingSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (!existingCourses) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.COURSES,
          JSON.stringify(MOCK_COURSES)
        );
      }

      if (!existingStudent) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.STUDENT,
          JSON.stringify(MOCK_STUDENT)
        );
      }

      if (!existingSettings) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(DEFAULT_SETTINGS)
        );
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  },

  // Get local notifications
  getNotifications: async () => {
    try {
      const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return parseStoredJson(notifications, []);
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Save a local notification
  addNotification: async (notification) => {
    try {
      const notifications = await storageManager.getNotifications();
      const newNotification = {
        id: notification.id || `notif-${Date.now()}`,
        title: notification.title,
        message: notification.message,
        date: notification.date || new Date().toISOString(),
        read: notification.read ?? false,
      };

      const updatedNotifications = [newNotification, ...notifications];
      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(updatedNotifications)
      );
      return newNotification;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  },

  // Get student data from storage or fallback to mock
  getStudentData: async () => {
    try {
      const studentData = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT);
      return parseStoredJson(studentData, MOCK_STUDENT);
    } catch (error) {
      console.error('Error getting student data:', error);
      return MOCK_STUDENT;
    }
  },

  // Save student data to storage
  saveStudentData: async (studentData) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.STUDENT,
        JSON.stringify(studentData)
      );
      return true;
    } catch (error) {
      console.error('Error saving student data:', error);
      return false;
    }
  },

  // Get all courses from storage or fallback to mock
  getCourseData: async () => {
    try {
      const coursesData = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
      return parseStoredJson(coursesData, MOCK_COURSES);
    } catch (error) {
      console.error('Error getting course data:', error);
      return MOCK_COURSES;
    }
  },

  // Save all courses to storage
  saveCourseData: async (coursesArray) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.COURSES,
        JSON.stringify(coursesArray)
      );
      return true;
    } catch (error) {
      console.error('Error saving course data:', error);
      return false;
    }
  },

  // Update single course enrollment status
  updateCourseEnrollment: async (courseId, isEnrolled) => {
    try {
      const courses = await storageManager.getCourseData();
      const updatedCourses = courses.map((course) =>
        course.id === courseId ? { ...course, isEnrolled } : course
      );
      await storageManager.saveCourseData(updatedCourses);
      return true;
    } catch (error) {
      console.error('Error updating course enrollment:', error);
      return false;
    }
  },

  // Update course registered count
  updateCourseRegistration: async (courseId, delta) => {
    try {
      const courses = await storageManager.getCourseData();
      const updatedCourses = courses.map((course) =>
        course.id === courseId
          ? { ...course, registered: Math.max(0, course.registered + delta) }
          : course
      );
      await storageManager.saveCourseData(updatedCourses);
      return true;
    } catch (error) {
      console.error('Error updating course registration:', error);
      return false;
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      const courses = await storageManager.getCourseData();
      return courses.find((course) => course.id === courseId) || null;
    } catch (error) {
      console.error('Error getting course by ID:', error);
      return null;
    }
  },

  // Add a new course
  addCourse: async (courseData) => {
    try {
      const courses = await storageManager.getCourseData();
      const newCourse = {
        id: courseData.id || `IF-${Date.now()}`,
        ...courseData,
        registered: courseData.registered ?? 0,
        isEnrolled: courseData.isEnrolled ?? false,
        status: courseData.status || 'open',
      };

      const updatedCourses = [newCourse, ...courses];
      await storageManager.saveCourseData(updatedCourses);
      return newCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },

  // Update an existing course
  updateCourse: async (courseId, updates) => {
    try {
      const courses = await storageManager.getCourseData();
      const courseIndex = courses.findIndex((course) => course.id === courseId);

      if (courseIndex === -1) {
        throw new Error('Course not found');
      }

      const updatedCourse = {
        ...courses[courseIndex],
        ...updates,
        id: courses[courseIndex].id,
      };
      const updatedCourses = [...courses];
      updatedCourses[courseIndex] = updatedCourse;
      await storageManager.saveCourseData(updatedCourses);
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    try {
      const courses = await storageManager.getCourseData();
      const course = courses.find((item) => item.id === courseId);

      if (!course) {
        throw new Error('Course not found');
      }

      const updatedCourses = courses.filter((item) => item.id !== courseId);
      await storageManager.saveCourseData(updatedCourses);
      return course;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Save app settings
  saveSettings: async (settings) => {
    try {
      const currentSettings = await storageManager.getSettings();
      const nextSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(nextSettings)
      );
      return nextSettings;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  // Get app settings
  getSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return {
        ...DEFAULT_SETTINGS,
        ...parseStoredJson(settings, DEFAULT_SETTINGS),
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  // Clear all data (for logout or reset)
  clearAllData: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.STUDENT,
        STORAGE_KEYS.COURSES,
        STORAGE_KEYS.ENROLLMENTS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.NOTIFICATIONS,
        STORAGE_KEYS.LAST_SYNC,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  },

  // Get last sync timestamp
  getLastSync: async () => {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      console.error('Error getting last sync:', error);
      return null;
    }
  },

  // Update last sync timestamp
  setLastSync: async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
      return true;
    } catch (error) {
      console.error('Error setting last sync:', error);
      return false;
    }
  },
};

export default storageManager;
