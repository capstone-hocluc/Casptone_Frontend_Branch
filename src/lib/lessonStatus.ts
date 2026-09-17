// Centralized lesson status presentation. Backend lesson.status is always
// authoritative - never derive it from progressPercentage. Unknown values
// render safely (the raw value) instead of crashing.

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Chưa học',
  IN_PROGRESS: 'Đang học',
  COMPLETED: 'Hoàn thành',
}

export type LessonStatusTone = 'success' | 'warning' | 'neutral'

const STATUS_TONES: Record<string, LessonStatusTone> = {
  NOT_STARTED: 'neutral',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
}

export function getLessonStatusLabel(status: string) {
  return STATUS_LABELS[status] || status
}

export function getLessonStatusTone(status: string): LessonStatusTone {
  return STATUS_TONES[status] || 'neutral'
}
