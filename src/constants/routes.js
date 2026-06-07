// src/constants/routes.js
// Navigation route names

export const ROUTES = {
  // Stack Navigator
  SPLASH: 'Splash',
  MAIN_TABS: 'MainTabs',
  
  // Bottom Tab Navigator
  HOME: 'Home',
  COURSES: 'Courses',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',

  // Stack Screens (nested in tabs)
  COURSE_DETAIL: 'CourseDetail',
  ENROLL_CONFIRMATION: 'EnrollConfirmation',
  
  // Drawer (optional)
  DRAWER: 'Drawer',
};

export const TAB_ROUTES = [ROUTES.HOME, ROUTES.COURSES, ROUTES.PROFILE];