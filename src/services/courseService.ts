import { request } from '../lib/api'

export interface Course {
  id: string
  title: string
  description?: string
  track?: string
  startDate?: string
  endDate?: string
  examSessionDate?: string
  price?: number
  targetExam?: string
  // Percentage of the course's own schedule that has elapsed - NOT the
  // student's learning progress. Use MyCourseEnrollment.progressPercentage
  // for that instead.
  elapsedPercentage?: number
  recommended?: boolean
  purchased?: boolean
}

export interface MyCourseEnrollment {
  course: Course
  enrolledAt?: string
  enrollmentType?: string
  progressPercentage?: number
  activeStudyGroupId?: string
  activeStudyGroupName?: string
}

export async function getMyCourses() {
  return request<MyCourseEnrollment[]>('/api/v1/courses/my', { auth: true })
}

// Public course catalog. `auth: true` only attaches a token when one already
// exists (see createHeaders) so guests can still browse - it just lets a
// logged-in student's request also come back with their purchased/recommended
// flags filled in.
export async function getMainCourses() {
  return request<Course[]>('/api/v1/courses/main', { auth: true })
}
