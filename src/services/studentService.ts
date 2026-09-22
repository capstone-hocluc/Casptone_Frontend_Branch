import {
  getCourseStudy,
  getMyCourses,
  type CourseStudy,
  type MyCourseEnrollment,
} from './courseService'
import { getPlacementResult, type PlacementResult } from './assessmentService'

// Composition of existing, real endpoints for the Student dashboard and
// Learning Profile - no new endpoint and no client-side data of its own.
// Anything the backend does not provide is layered on top by
// lib/studentViewModel.ts (which keeps the mock fields visible).
export interface StudentApiSnapshot {
  /** GET /courses/my */
  enrollments: MyCourseEnrollment[]
  /** GET /courses/{id}/study per enrollment, keyed by course id (failed ones are omitted). */
  studies: Record<string, CourseStudy>
  /** GET /assessments/results/me; null when the student has no result yet. */
  placement: PlacementResult | null
}

export async function loadStudentSnapshot(): Promise<StudentApiSnapshot> {
  const [coursesResponse, placement] = await Promise.all([
    getMyCourses(),
    // No placement result yet is an expected state, not an error.
    getPlacementResult().catch(() => null),
  ])
  const enrollments = coursesResponse.data || []
  const loaded = await Promise.all(
    enrollments.map((item) =>
      getCourseStudy(item.course.id)
        .then((study) => [item.course.id, study] as const)
        .catch(() => null)
    )
  )
  const studies: Record<string, CourseStudy> = {}
  loaded.forEach((entry) => {
    if (entry) studies[entry[0]] = entry[1]
  })
  return { enrollments, studies, placement }
}
