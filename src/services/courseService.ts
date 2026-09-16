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

export interface CourseLesson {
  id: string
  title: string
  description?: string
  contentType?: string
  durationSeconds?: number
  sequence?: number
  preview?: boolean
  videoUrl?: string
  quizCount?: number
  assignmentCount?: number
}

export interface CourseChapter {
  id: string
  title: string
  description?: string
  sequence?: number
  quizCount?: number
  lessons: CourseLesson[]
}

export interface CourseSection {
  sectionCourseId: string
  title: string
  description?: string
  categoryId?: string
  categoryName?: string
  sequence?: number
  chapters: CourseChapter[]
}

export interface CoursePhase {
  id: string
  name: string
  description?: string
  sequence?: number
  sections: CourseSection[]
}

export interface CourseDetail {
  id: string
  title: string
  slug?: string
  description?: string
  shortIntroduction?: string
  imageUrl?: string
  videoUrl?: string
  track?: string
  startDate?: string
  endDate?: string
  examSessionDate?: string
  targetExam?: string
  paid?: boolean
  price?: number
  purchased?: boolean
  inCart?: boolean
  phaseCount?: number
  sectionCount?: number
  chapterCount?: number
  lessonCount?: number
  quizCount?: number
  totalDurationSeconds?: number
  phases?: CoursePhase[]
}

// Public course detail. Same opportunistic-auth rationale as getMainCourses -
// guests can view it, a logged-in student's request also resolves
// purchased/inCart for them.
export async function getCourseDetail(courseId: string) {
  return request<CourseDetail>(`/api/v1/courses/${encodeURIComponent(courseId)}`, { auth: true })
}
