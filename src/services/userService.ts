import { request } from '../lib/api'

export interface StudentProfile {
  id: string
  dateOfBirth?: string
  gender?: string
  province?: string
  address?: string
  schoolName?: string
  grade?: number
  graduationYear?: number
  academicTrack?: string
  targetUniversity?: string
  targetMajor?: string
  targetExam?: string
  targetExamYear?: number
  targetScore?: number
  level?: string
  selfReportedWeakCategoryId?: string
  selfReportedWeakCategoryName?: string
  selfReportedStrongCategoryId?: string
  selfReportedStrongCategoryName?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  phone?: string
  avatarUrl?: string
  bio?: string
  timezone?: string
  language?: string
  status?: string
  role: string
  emailVerified?: boolean
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
  studentProfile?: StudentProfile
}

export async function getCurrentProfile() {
  return request<UserProfile>('/api/v1/users/profiles', { auth: true })
}
