import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_STUDENT, MOCK_COURSES } from '../constants/mockData';

const STORAGE_KEYS = {
  STUDENT: '@scholaris_student',
  COURSES: '@scholaris_courses',
  ENROLLMENTS: '@scholaris_enrollments',
  SETTINGS: '@scholaris_settings',
  LAST_SYNC: '@scholaris_last_sync',
};

const storageManager = {
  // Initialize storage with mock data on first app load
  initializeStorage: async () => {
    try {
      const existingCourses = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
      const existingStudent = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT);

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
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  },

  // Get student data from storage or fallback to mock
  getStudentData: async () => {
    try {
      const studentData = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT);
      if (studentData) {
        return JSON.parse(studentData);
      }
      return MOCK_STUDENT;
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
      if (coursesData) {
        return JSON.parse(coursesData);
      }
      return MOCK_COURSES;
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

  // Save app settings
  saveSettings: async (settings) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  // Get app settings
  getSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settings) {
        return JSON.parse(settings);
      }
      return {
        darkMode: false,
        notifications: true,
        language: 'id',
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        darkMode: false,
        notifications: true,
        language: 'id',
      };
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
