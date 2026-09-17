import type { CourseStudyLesson, CourseStudyPhase } from '../../services/courseService'

export function bySequence<T extends { sequence?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
}

// Used only when the backend gives no continueLessonId (e.g. a fresh
// enrollment) - finds the first real lesson from the actual curriculum so
// "Bắt đầu học" points somewhere real instead of being invented.
export function findFirstLesson(phases: CourseStudyPhase[]): CourseStudyLesson | null {
  for (const phase of bySequence(phases)) {
    for (const section of bySequence(phase.sections)) {
      for (const chapter of bySequence(section.chapters)) {
        const lessons = bySequence(chapter.lessons)
        if (lessons.length > 0) return lessons[0]
      }
    }
  }
  return null
}
