// Centralized quiz lock-reason presentation. Backend `locked`/`lockReason`
// are always authoritative - the frontend must never bypass a lock. Only one
// reason is confirmed so far; anything else falls back to a generic message
// instead of guessing.

const LOCK_REASON_LABELS: Record<string, string> = {
  NOT_PURCHASED: 'Bạn chưa có quyền truy cập nội dung này',
}

export function getQuizLockMessage(lockReason: string | null) {
  if (lockReason && LOCK_REASON_LABELS[lockReason]) return LOCK_REASON_LABELS[lockReason]
  return 'Chưa thể làm bài kiểm tra'
}

// Lesson Detail uses distinct copy for the same concept - kept separate so
// Course Study's already-verified strings above are never changed.
const LESSON_LOCK_REASON_LABELS: Record<string, string> = {
  NOT_PURCHASED: 'Bạn chưa có quyền truy cập bài kiểm tra này',
}

export function getLessonQuizLockMessage(lockReason: string | null) {
  if (lockReason && LESSON_LOCK_REASON_LABELS[lockReason])
    return LESSON_LOCK_REASON_LABELS[lockReason]
  return 'Bài kiểm tra hiện chưa khả dụng'
}

// Quiz Detail / Attempt pages (assessment flow) - also reused for the 403
// error state on those pages, since it's the same access-denied concept.
const ASSESSMENT_LOCK_REASON_LABELS: Record<string, string> = {
  NOT_PURCHASED: 'Bạn chưa có quyền truy cập bài kiểm tra này.',
}

export function getAssessmentLockMessage(lockReason: string | null) {
  if (lockReason && ASSESSMENT_LOCK_REASON_LABELS[lockReason])
    return ASSESSMENT_LOCK_REASON_LABELS[lockReason]
  return 'Bài kiểm tra hiện chưa khả dụng.'
}
