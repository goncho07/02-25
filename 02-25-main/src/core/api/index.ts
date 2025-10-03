import { ApiClient } from './client';

// Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Users
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_PROFILE: '/users/profile',
  
  // Students
  STUDENTS: '/students',
  STUDENT_DETAIL: (id: string) => `/students/${id}`,
  STUDENT_GRADES: (id: string) => `/students/${id}/grades`,
  STUDENT_ATTENDANCE: (id: string) => `/students/${id}/attendance`,
  
  // Teachers
  TEACHERS: '/teachers',
  TEACHER_DETAIL: (id: string) => `/teachers/${id}`,
  TEACHER_COURSES: (id: string) => `/teachers/${id}/courses`,
  
  // Courses
  COURSES: '/courses',
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  COURSE_STUDENTS: (id: string) => `/courses/${id}/students`,
  COURSE_GRADES: (id: string) => `/courses/${id}/grades`,
  
  // Grades
  GRADES: '/grades',
  GRADE_DETAIL: (id: string) => `/grades/${id}`,
  
  // Attendance
  ATTENDANCE: '/attendance',
  ATTENDANCE_DETAIL: (id: string) => `/attendance/${id}`,
  
  // Reports
  REPORTS: '/reports',
  GENERATE_REPORT: (type: string) => `/reports/${type}`,
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_CHARTS: '/dashboard/charts',
  
  // Settings
  SETTINGS: '/settings',
  ACADEMIC_PERIODS: '/settings/academic-periods',
  GRADING_SCALES: '/settings/grading-scales',
} as const;

// Create API client instance
export const api = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});