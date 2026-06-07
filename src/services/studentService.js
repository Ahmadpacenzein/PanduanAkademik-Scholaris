// src/services/studentService.js
// Service untuk mengakses data mahasiswa

import { MOCK_STUDENT } from '../constants/mockData';

/**
 * Get data mahasiswa
 */
export const getStudentProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STUDENT);
    }, 300);
  });
};

/**
 * Update data mahasiswa
 * @param {object} updates
 */
export const updateStudentProfile = async (updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const updated = { ...MOCK_STUDENT, ...updates };
        resolve({
          success: true,
          message: 'Profile updated successfully',
          student: updated,
        });
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

/**
 * Get student ID
 */
export const getStudentId = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STUDENT.id);
    }, 100);
  });
};

/**
 * Get student contact info
 */
export const getStudentContact = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: MOCK_STUDENT.email,
        phone: MOCK_STUDENT.phone,
        name: MOCK_STUDENT.name,
      });
    }, 100);
  });
};

/**
 * Get student academic info
 */
export const getStudentAcademic = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: MOCK_STUDENT.id,
        major: MOCK_STUDENT.major,
        semester: MOCK_STUDENT.semester,
        gpa: MOCK_STUDENT.gpa,
        faculty: MOCK_STUDENT.faculty,
        university: MOCK_STUDENT.university,
      });
    }, 100);
  });
};

/**
 * Get student campus location
 */
export const getStudentCampusLocation = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STUDENT.campus_location);
    }, 100);
  });
};

export default {
  getStudentProfile,
  updateStudentProfile,
  getStudentId,
  getStudentContact,
  getStudentAcademic,
  getStudentCampusLocation,
};