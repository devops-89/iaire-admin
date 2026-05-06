export interface LOGIN_REQUEST {
  identifier: string;
  password: string;
}

export interface VERIFY_OTP_REQUEST {
  email: string;
  otp: string;
}

export interface CREATE_COUNTRIES_REQUEST {
  name: string;
  code: string;
  phoneCode: string;
  currencyCode: string;
}

export interface UPDATE_COUNTRIES_REQUEST {
  name?: string;
  code?: string;
  phoneCode?: string;
  currencyCode?: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
  currencyCode: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Plan {
  id: number;
  name: string;
  code: string;
  target: string;
  price: number;
  currency: string;
  billingCycle: string;
  trialDays: number;
  isActive: boolean;
  createdAt?: string;
}

export interface CREATE_PLAN_REQUEST {
  name: string;
  code: string;
  target: string;
  price: number;
  currency: string;
  billingCycle: string;
  trialDays: number;
  isActive: boolean;
}

export interface UPDATE_PLAN_REQUEST {
  name?: string;
  code?: string;
  target?: string;
  price?: number;
  currency?: string;
  billingCycle?: string;
  trialDays?: number;
  isActive?: boolean;
}

export interface Patent {
  id: number;
  title: string;
  patentNumber: string;
  inventors: string;
  filingDate: string;
  status: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CREATE_PATENT_REQUEST {
  title: string;
  patentNumber: string;
  inventors: string;
  filingDate: string;
  status: string;
  description: string;
}

export interface UPDATE_PATENT_REQUEST {
  title?: string;
  patentNumber?: string;
  inventors?: string;
  filingDate?: string;
  status?: string;
  description?: string;
  isActive?: boolean;
}

export interface FORGOT_PASSWORD_REQUEST {
  identifier: string;
}

export interface RESET_PASSWORD_REQUEST {
  identifier: string;
  otp: string;
  newPassword?: string;
}

// Training & Interview Types
export interface TrainingTeacher {
  id: number;
  trainingId: number;
  teacherId: number;
  availableFrom: string;
  availableTo: string;
  mode: string;
  status: string;
  training: Training;
  teacher: Teacher;
  schoolApprovedAt?: string;
  iaireApprovedAt?: string;
  interviewScheduledAt?: string;
}

export interface Training {
  id: number;
  title: string;
  description: string | null;
  type: string;
  startDate: string;
  endDate: string;
  mode: string;
  status: string;
  school: School;
  board: Board;
}

export interface Teacher {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  primarySubjects: string[];
  experienceYears: number;
}

export interface School {
  id: number;
  name: string;
  code: string;
  logo: string;
  city: string;
  state: string;
}

export interface Board {
  id: number;
  name: string;
  code: string;
}

export interface SCHEDULE_INTERVIEW_REQUEST {
  interviewScheduledAt: string;
}