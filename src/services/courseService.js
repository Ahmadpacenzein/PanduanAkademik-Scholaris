// src/services/courseService.js
// Service untuk mengakses data mata kuliah

import { MOCK_COURSES } from '../constants/mockData';
import storageManager from '../utils/storageManager';
import apiService from './apiService';

/**
 * Get semua mata kuliah
 */
export const getAllCourses = async () => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      try {
        const courses = await storageManager.getCourseData();
        resolve(courses);
      } catch (error) {
        console.error('Error getting courses:', error);
        resolve(MOCK_COURSES);
      }
    }, 500);
  });
};

/**
 * Get mata kuliah berdasarkan ID
 * @param {string} courseId
 */
export const getCourseById = async (courseId) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const course = await storageManager.getCourseById(courseId);
        if (course) {
          resolve(course);
        } else {
          reject(new Error('Course not found'));
        }
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

/**
 * Get mata kuliah yang sudah diambil (enrolled)
 */
export const getEnrolledCourses = async () => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      try {
        const courses = await storageManager.getCourseData();
        const enrolled = courses.filter((c) => c.isEnrolled);
        resolve(enrolled);
      } catch (error) {
        console.error('Error getting enrolled courses:', error);
        const enrolled = MOCK_COURSES.filter((c) => c.isEnrolled);
        resolve(enrolled);
      }
    }, 300);
  });
};

/**
 * Get mata kuliah yang tersedia (belum diambil)
 */
export const getAvailableCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const courses = await storageManager.getCourseData();
        const available = courses.filter((c) => !c.isEnrolled && c.status === 'open');
        resolve(available);
      } catch (error) {
        console.error('Error getting available courses:', error);
        const available = MOCK_COURSES.filter((c) => !c.isEnrolled && c.status === 'open');
        resolve(available);
      }
    }, 300);
  });
};

/**
 * Enroll ke mata kuliah
 * @param {string} courseId
 * @param {string} studentId
 */
export const enrollCourse = async (courseId, studentId) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const courses = await storageManager.getCourseData();
        const course = courses.find((c) => c.id === courseId);

        if (!course) {
          reject(new Error('Course not found'));
          return;
        }

        if (course.registered >= course.capacity) {
          reject(new Error('Course is full'));
          return;
        }

        if (course.isEnrolled) {
          reject(new Error('Already enrolled in this course'));
          return;
        }

        const updatedCourse = {
          ...course,
          isEnrolled: true,
          registered: course.registered + 1,
        };
        await storageManager.updateCourse(courseId, updatedCourse);

        resolve({
          success: true,
          message: `Successfully enrolled in ${course.name}`,
          course: updatedCourse,
        });
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
};

/**
 * Unenroll dari mata kuliah
 * @param {string} courseId
 * @param {string} studentId
 */
export const unenrollCourse = async (courseId, studentId) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const courses = await storageManager.getCourseData();
        const course = courses.find((c) => c.id === courseId);

        if (!course) {
          reject(new Error('Course not found'));
          return;
        }

        if (!course.isEnrolled) {
          reject(new Error('Not enrolled in this course'));
          return;
        }

        const updatedCourse = {
          ...course,
          isEnrolled: false,
          registered: Math.max(0, course.registered - 1),
        };
        await storageManager.updateCourse(courseId, updatedCourse);

        resolve({
          success: true,
          message: `Successfully unenrolled from ${course.name}`,
          course: updatedCourse,
        });
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
};

/**
 * Search mata kuliah berdasarkan keyword
 * @param {string} keyword
 */
export const searchCourses = async (keyword) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const courses = await storageManager.getCourseData();
        const query = keyword.toLowerCase();
        const results = courses.filter(
          (course) =>
            course.name.toLowerCase().includes(query) ||
            course.code.toLowerCase().includes(query) ||
            course.lecturer.toLowerCase().includes(query)
        );
        resolve(results);
      } catch (error) {
        console.error('Error searching courses:', error);
        resolve([]);
      }
    }, 300);
  });
};

/**
 * Get courses dengan filter
 * @param {object} filters
 */
export const getCoursesWithFilters = async (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const courses = await storageManager.getCourseData();
        let filtered = [...courses];

        // Filter by enrolled status
        if (filters.enrolled !== undefined) {
          filtered = filtered.filter((c) => c.isEnrolled === filters.enrolled);
        }

        // Filter by credits
        if (filters.credits) {
          filtered = filtered.filter((c) => c.credits === filters.credits);
        }

        // Filter by lecturer
        if (filters.lecturer) {
          filtered = filtered.filter((c) =>
            c.lecturer.toLowerCase().includes(filters.lecturer.toLowerCase())
          );
        }

        resolve(filtered);
      } catch (error) {
        console.error('Error filtering courses:', error);
        resolve([]);
      }
    }, 300);
  });
};

/**
 * Tambah mata kuliah baru
 * @param {object} courseData - {name, code, credits, lecturer, lecturerEmail, lecturerPhone, description, syllabus}
 */
export const addCourse = async (courseData) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const newCourse = {
          id: `IF-${Date.now()}`,
          ...courseData,
          schedule: courseData.schedule || 'Jadwal akan ditentukan',
          room: courseData.room || 'Ruang akan ditentukan',
          capacity: courseData.capacity || 30,
          syllabus: courseData.syllabus?.length ? courseData.syllabus : ['Materi akan ditentukan'],
          registered: 0,
          isEnrolled: false,
          status: 'open',
        };

        // Attempt to POST to server (retry once on failure, fallback to local storage)
        try {
          let postResponse;
          try {
            postResponse = await apiService.postCourseToServer(newCourse);
          } catch (postError) {
            console.warn('First POST attempt failed, retrying once...', postError);
            postResponse = await apiService.postCourseToServer(newCourse);
          }
          console.log('Course posted to server successfully:', postResponse);
        } catch (apiError) {
          console.error('Failed to post course to server, using local fallback:', apiError);
        }

        const savedCourse = await storageManager.addCourse(newCourse);
        const settings = await storageManager.getSettings();

        if (settings.notifications) {
          await storageManager.addNotification({
            title: 'Jadwal Mata Kuliah Baru',
            message: `${savedCourse.name} ditambahkan dengan jadwal ${savedCourse.schedule}.`,
          });
        }

        resolve({
          success: true,
          message: `Successfully added course ${savedCourse.name}`,
          course: savedCourse,
        });
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Update/Edit mata kuliah
 * @param {string} courseId
 * @param {object} updates
 */
export const updateCourse = async (courseId, updates) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const updatedCourse = await storageManager.updateCourse(courseId, updates);

        resolve({
          success: true,
          message: `Successfully updated course ${updatedCourse.name}`,
          course: updatedCourse,
        });
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Hapus mata kuliah
 * @param {string} courseId
 */
export const deleteCourse = async (courseId) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const deletedCourse = await storageManager.deleteCourse(courseId);

        resolve({
          success: true,
          message: `Successfully deleted course ${deletedCourse.name}`,
          course: deletedCourse,
        });
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

export default {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getAvailableCourses,
  enrollCourse,
  unenrollCourse,
  searchCourses,
  getCoursesWithFilters,
  addCourse,
  updateCourse,
  deleteCourse,
};
