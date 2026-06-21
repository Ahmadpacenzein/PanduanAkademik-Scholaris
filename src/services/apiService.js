import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storageManager from '../utils/storageManager';

const CACHE_KEY = 'courses_cache';
const PRODUCTS_URL = 'https://dummyjson.com/products';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

/**
 * Fetch courses from the server (dummyjson.com) or fallback to local cache if offline/error.
 */
export const getCoursesFromServer = async () => {
  try {
    // Retry once on failure
    let response;
    try {
      response = await axios.get(PRODUCTS_URL, { timeout: 10000 });
    } catch (firstErr) {
      console.warn('First fetch attempt failed, retrying once...', firstErr);
      response = await axios.get(PRODUCTS_URL, { timeout: 10000 });
    }

    if (response.data && Array.isArray(response.data.products)) {
      const mapped = response.data.products.map((item) => ({
        id: `SRV-${item.id}`,
        name: item.title,
        code: item.sku || `SRV${item.id}`,
        credits: Math.max(1, Math.min(6, Math.round(item.rating || 3))),
        lecturer: item.brand || 'Dosen Tamu',
        description: item.description || '',
        schedule: 'Senin 08:00 - 10:30',
        room: 'LMS Online / Gedung C',
        capacity: 30,
        registered: Math.floor(Math.random() * 15),
        isEnrolled: false,
        status: 'open',
        syllabus: [
          item.category || 'Materi Umum',
          'Pengantar dan Teori Dasar',
          'Praktek Implementasi',
          'Evaluasi Akhir'
        ]
      }));

      // Save to local cache
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      return mapped;
    }
    return [];
  } catch (error) {
    console.error('Error in getCoursesFromServer:', error);
    // Offline fallback: load from cache
    const cache = await AsyncStorage.getItem(CACHE_KEY);
    if (cache) {
      try {
        return JSON.parse(cache);
      } catch (parseErr) {
        console.error('Error parsing courses_cache:', parseErr);
      }
    }
    return [];
  }
};

/**
 * POST a course to the server (jsonplaceholder.typicode.com)
 */
export const postCourseToServer = async (course) => {
  try {
    const response = await axios.post(POSTS_URL, course, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('Error in postCourseToServer:', error);
    throw error;
  }
};

/**
 * Merge local courses (AsyncStorage courses) and Server courses.
 * Avoid duplicate IDs.
 */
export const mergeServerAndLocal = async () => {
  try {
    const serverCourses = await getCoursesFromServer();
    const localCourses = await storageManager.getCourseData();

    // Create a Map of local courses by ID to maintain local overrides/registrations/enrollments
    const mergedMap = new Map();

    // Add local courses first to preserve user data and state
    localCourses.forEach((course) => {
      mergedMap.set(course.id, course);
    });

    // Add server courses if they do not exist already in local courses
    serverCourses.forEach((course) => {
      if (!mergedMap.has(course.id)) {
        mergedMap.set(course.id, course);
      }
    });

    const mergedList = Array.from(mergedMap.values());
    await storageManager.saveCourseData(mergedList);
    return mergedList;
  } catch (error) {
    console.error('Error in mergeServerAndLocal:', error);
    // Return existing local data if everything fails
    return await storageManager.getCourseData();
  }
};

export default {
  getCoursesFromServer,
  postCourseToServer,
  mergeServerAndLocal,
};
