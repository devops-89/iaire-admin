import { FILE_TYPE, RESOURCES_TYPE } from "./enum";

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
  // code: string;
  target: string;
  price: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  limit: { key: string; value: string }[];
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
  reason?: string;
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
  firstName?: string;
  lastName?: string;
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

export interface Batch {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  category: string;
  userRole: string;
  status: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CREATE_BATCH_REQUEST {
  name?: string;
  startDate: string;
  endDate: string;
  category: string;
  userRole: string;
  questions?: {
    id: string;
    question: string;
    type: string;
    required: boolean;
  }[];
  subjectiveQuestions?: {
    question: string;
    answer: string;
  }[];
  objectiveQuestions?: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface UPDATE_BATCH_REQUEST {
  name?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  userRole?: string;
  isActive?: boolean;
  questions?: {
    id: string;
    question: string;
    type: string;
    required: boolean;
  }[];
  subjectiveQuestions?: {
    question: string;
    answer: string;
  }[];
  objectiveQuestions?: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface BoardAnalytics {
  boardId: number;
  boardName: string;
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
}

export interface COUNTRYDATAPROPS {
  id: number;
  name: string;
  code: string;
  currencyCode: string;
}

export interface PlanListItem {
  id: number;
  name: string;
  target: string;
  price: string;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  country: {
    id: number;
    name: string;
    code: string;
    phoneCode: string;
    currencyCode: string;
    isActive: boolean;
  };
}

export interface PLAN_DATA_PROPS {
  data: PlanListItem[];
  filters: {
    code: null;
    name: null;
    billingCycle: null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InnovationTeam {
  id: number;
  title: string;
  type: string;
  teamCode: string;
  mentorId: number;
  mentor?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  assistantMentorId: number | null;
  assistantMentor?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  members?: {
    id: number;
    teamId: number;
    studentId: number;
    createdAt?: string;
    student: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
  }[];
  createdBy: number;
  schoolId: number;
  boardId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface InnovationSchoolCountry {
  id: number;
  name: string;
}

export interface InnovationSchool {
  id: number;
  name: string;
  code: string | null;
  address: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  state: string;
  zipCode: string;
  logo: string | null;
  affiliationCertificate: string | null;
  affiliationNumber: string | null;
  website: string | null;
  registrationYear: number;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  isActive: boolean;
  boardId: number;
  countryId: number;
  country: InnovationSchoolCountry;
  board?: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  schoolLogoDownloadUrl: string | null;
  affiliationCertificateDownloadUrl: string | null;
}

export interface InnovationCreator {
  id: number;
  email: string;
  username: string;
  phone: string;
  countryCode: string | null;
  isdCode: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBoardAdminManuallyVerfied: boolean;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImage: string | null;
  password?: string;
  hashedRefreshToken?: string;
  lastLoginAt: string | null;
  tokenVersion: number;
  role: string;
  status: string;
  schoolId: number | null;
  grade: string | null;
  state: string | null;
  dob: string | null;
  spocDetails: any | null;
  city: string | null;
  totalSchools: number | null;
  totalStudents: number | null;
  totalTeachers: number | null;
  noOfStudents: number | null;
  noOfTeachers: number | null;
  category: string | null;
  gender: string | null;
  approvalStatus: string;
  isSchoolPay: boolean;
  primarySubjects: string[];
  experienceYears: number | null;
  experienceinYears?: number | null;
  experienceMonths: number | null;
  fatherName: string | null;
  fatherEmail: string | null;
  fatherPhone: string | null;
  fatherProfession: string | null;
  motherName: string | null;
  motherEmail: string | null;
  motherPhone: string | null;
  motherProfession: string | null;
  boardId: number | null;
  countryId: number | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profileImageDownloadUrl: string | null;
}

export interface INNOVATION_RESPONSE_DATA_PROPS {
  id: number;
  title: string;
  problemDescription: string;
  solution: string;
  teamId: number;
  team: InnovationTeam;
  schoolId: number;
  school: InnovationSchool;
  createdBy: number;
  creator: InnovationCreator;
  status: string;
  isDraft: boolean;
  attachments: any | null;
  attomeyFinalTemplate: string | null;
  reviewedBy: number | null;
  reviewer: any | null;
  reviewComments: string | null;
  reviewedAt: string | null;
  archiveComments: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  attorneyTemplateDownloadUrl: string | null;
  attachmentsDownloadUrls: string[];
}

export interface ADD_RESOURCE_PROPS {
  file: File;
  title: string;
  description: string;
  section: RESOURCES_TYPE;
  fileType: FILE_TYPE;
}

export interface ResourceItem {
  id: number;
  title: string;
  description: string | null;
  section: string;
  fileType: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  thumbnailUrl: string | null;
  status: string;
  isFeatured: boolean;
  displayOrder: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GET_RESOURCES_RESPONSE {
  statusCode: number;
  message: string;
  data: ResourceItem[];
  pagination: Pagination;
}

export interface ResearchTeam {
  id: number;
  title: string;
  type: string;
  teamCode: string;
  mentorId: number;
  assistantMentorId: number | null;
  createdBy: number;
  schoolId: number;
  boardId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ResearchCreator {
  id: number;
  email: string;
  username: string;
  phone: string;
  countryCode: string | null;
  isdCode: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImage: string | null;
  profileImageDownloadUrl?: string | null;
  password?: string;
  hashedRefreshToken?: string;
  lastLoginAt: string | null;
  tokenVersion: number;
  role: string;
  status: string;
  schoolId: number | null;
  grade: string | null;
  state: string | null;
  dob: string | null;
  category: string | null;
  gender: string | null;
  approvalStatus: string;
  primarySubjects: string[];
  experienceYears: number | null;
  experienceMonths: number | null;
  fatherName: string | null;
  fatherEmail: string | null;
  fatherPhone: string | null;
  fatherProfession: string | null;
  motherName: string | null;
  motherEmail: string | null;
  motherPhone: string | null;
  motherProfession: string | null;
  boardId: number | null;
  countryId: number | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ResearchCountry {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
  currencyCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ResearchSubmission {
  id: number;
  title: string;
  description: string;
  topic: string;
  status: string;
  teamId: number;
  team: ResearchTeam;
  createdBy: number;
  creator: ResearchCreator;
  countryId: number;
  country: ResearchCountry;
  archivedAt: string | null;
  archivedBy: number | null;
  archiveReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GET_RESEARCH_RESPONSE {
  statusCode?: number;
  message: string;
  data: ResearchSubmission[];
  pagination: Pagination;
}


