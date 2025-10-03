// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

export interface UserUpdateInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
}

// Student types
export interface Student {
  id: string;
  code: string;
  userId: string;
  user: User;
  grade: string;
  section: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentGrade {
  id: string;
  studentId: string;
  courseId: string;
  periodId: string;
  value: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Teacher types
export interface Teacher {
  id: string;
  userId: string;
  user: User;
  specialization?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Course types
export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  grade: string;
  section: string;
  teacherId: string;
  teacher: Teacher;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Grade types
export interface Grade {
  id: string;
  courseId: string;
  studentId: string;
  periodId: string;
  value: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    code: string;
    firstName: string;
    lastName: string;
  };
}

// Attendance types
export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: string;
  justification?: string;
  createdAt: string;
  updatedAt: string;
}

// Period types
export interface Period {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Report types
export interface Report {
  id: string;
  type: string;
  parameters: Record<string, any>;
  status: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeStudents: number;
  averageAttendance: number;
  averageGrade: number;
}

export interface DashboardCharts {
  attendanceByMonth: {
    month: string;
    present: number;
    absent: number;
    late: number;
  }[];
  gradesByPeriod: {
    period: string;
    average: number;
    min: number;
    max: number;
  }[];
}

// Settings types
export interface Settings {
  academicYear: string;
  currentPeriod: string;
  gradingScale: {
    min: number;
    max: number;
    passingGrade: number;
  };
  attendanceTypes: string[];
  periodTypes: string[];
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}