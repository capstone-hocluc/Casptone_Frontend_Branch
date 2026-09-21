import type { CourseStudyLesson, CourseStudyPhase } from '../../../services/courseService'

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

// Quiz `type` is a backend enum whose full value set isn't confirmed, so this
// only separates the two kinds the UI presents differently: anything that
// reads as a mini/mock/final test is an assessment, the rest is practice.
export type QuizKind = 'practice' | 'assessment'

export function getQuizKind(type?: string | null): QuizKind {
  return /MINI|MOCK|TEST|EXAM|FINAL|ASSESS/i.test(type || '') ? 'assessment' : 'practice'
}

export function quizKindLabel(kind: QuizKind) {
  return kind === 'assessment' ? 'Mini Test' : 'Bài tập'
}

export function lessonContainsId(
  chapter: { lessons: { id: string }[] },
  lessonId: string | null | undefined
) {
  return Boolean(lessonId) && chapter.lessons.some((lesson) => lesson.id === lessonId)
}
