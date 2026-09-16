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

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  displayName?: string
  phone?: string
  bio?: string
  timezone?: string
  language?: string
}

export async function updateProfile(payload: UpdateProfileRequest) {
  return request<UserProfile>('/api/v1/users/profiles', {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export interface UpdateStudentProfileRequest {
  // General-profile fields the backend contract requires on this endpoint too -
  // callers must fill these from the current profile so they aren't wiped out.
  firstName?: string
  lastName?: string
  displayName?: string
  phone?: string
  avatarUrl?: string
  bio?: string
  // Student-specific fields.
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
  selfReportedWeakCategoryId?: string
  selfReportedStrongCategoryId?: string
}

export async function updateStudentProfile(payload: UpdateStudentProfileRequest) {
  return request<UserProfile>('/api/v1/users/student-profiles', {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request<UserProfile>('/api/v1/users/avatars', {
    method: 'POST',
    auth: true,
    body: formData,
  })
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export async function changePassword(payload: ChangePasswordRequest) {
  return request<string>('/api/v1/users/passwords', {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}
