// src/services/courseService.js
// Service untuk mengakses data mata kuliah

import { MOCK_COURSES } from '../constants/mockData';
import storageManager from '../utils/storageManager';

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
    setTimeout(() => {
      const course = MOCK_COURSES.find((c) => c.id === courseId);
      if (course) {
        resolve(course);
      } else {
        reject(new Error('Course not found'));
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
    setTimeout(() => {
      const available = MOCK_COURSES.filter((c) => !c.isEnrolled && c.status === 'open');
      resolve(available);
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

        // Update enrollment status and registered count
        await storageManager.updateCourseEnrollment(courseId, true);
        await storageManager.updateCourseRegistration(courseId, 1);

        resolve({
          success: true,
          message: `Successfully enrolled in ${course.name}`,
          course: { ...course, isEnrolled: true, registered: course.registered + 1 },
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

        // Update enrollment status and registered count
        await storageManager.updateCourseEnrollment(courseId, false);
        await storageManager.updateCourseRegistration(courseId, -1);

        resolve({
          success: true,
          message: `Successfully unenrolled from ${course.name}`,
          course: { ...course, isEnrolled: false, registered: course.registered - 1 },
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
    setTimeout(() => {
      const results = MOCK_COURSES.filter(
        (course) =>
          course.name.toLowerCase().includes(keyword.toLowerCase()) ||
          course.code.toLowerCase().includes(keyword.toLowerCase()) ||
          course.lecturer.toLowerCase().includes(keyword.toLowerCase())
      );
      resolve(results);
    }, 300);
  });
};

/**
 * Get courses dengan filter
 * @param {object} filters
 */
export const getCoursesWithFilters = async (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...MOCK_COURSES];

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
        const courses = await storageManager.getCourseData();

        const newCourse = {
          id: `IF-${Date.now()}`,
          ...courseData,
          schedule: courseData.schedule || 'Jadwal akan ditentukan',
          room: courseData.room || 'Ruang akan ditentukan',
          capacity: courseData.capacity || 30,
          registered: 0,
          isEnrolled: false,
          status: 'open',
        };

        courses.push(newCourse);
        await storageManager.saveCourseData(courses);

        resolve({
          success: true,
          message: `Successfully added course ${newCourse.name}`,
          course: newCourse,
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
        const courses = await storageManager.getCourseData();
        const courseIndex = courses.findIndex((c) => c.id === courseId);

        if (courseIndex === -1) {
          reject(new Error('Course not found'));
          return;
        }

        courses[courseIndex] = { ...courses[courseIndex], ...updates };
        await storageManager.saveCourseData(courses);

        resolve({
          success: true,
          message: `Successfully updated course ${courses[courseIndex].name}`,
          course: courses[courseIndex],
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
        const courses = await storageManager.getCourseData();
        const course = courses.find((c) => c.id === courseId);

        if (!course) {
          reject(new Error('Course not found'));
          return;
        }

        if (course.isEnrolled) {
          reject(new Error('Cannot delete enrolled course. Please unenroll first.'));
          return;
        }

        const filteredCourses = courses.filter((c) => c.id !== courseId);
        await storageManager.saveCourseData(filteredCourses);

        resolve({
          success: true,
          message: `Successfully deleted course ${course.name}`,
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