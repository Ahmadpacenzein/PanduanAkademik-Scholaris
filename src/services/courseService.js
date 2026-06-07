// src/services/courseService.js
// Service untuk mengakses data mata kuliah

import { MOCK_COURSES } from '../constants/mockData';

/**
 * Get semua mata kuliah
 */
export const getAllCourses = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_COURSES);
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
  return new Promise((resolve) => {
    setTimeout(() => {
      const enrolled = MOCK_COURSES.filter((c) => c.isEnrolled);
      resolve(enrolled);
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
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = MOCK_COURSES.find((c) => c.id === courseId);
      
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

      // Simulate enrollment
      course.isEnrolled = true;
      course.registered += 1;

      resolve({
        success: true,
        message: `Successfully enrolled in ${course.name}`,
        course: course,
      });
    }, 800);
  });
};

/**
 * Unenroll dari mata kuliah
 * @param {string} courseId
 * @param {string} studentId
 */
export const unenrollCourse = async (courseId, studentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = MOCK_COURSES.find((c) => c.id === courseId);
      
      if (!course) {
        reject(new Error('Course not found'));
        return;
      }

      if (!course.isEnrolled) {
        reject(new Error('Not enrolled in this course'));
        return;
      }

      // Simulate unenrollment
      course.isEnrolled = false;
      course.registered -= 1;

      resolve({
        success: true,
        message: `Successfully unenrolled from ${course.name}`,
        course: course,
      });
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

export default {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getAvailableCourses,
  enrollCourse,
  unenrollCourse,
  searchCourses,
  getCoursesWithFilters,
};