import { CheckCircle2, ChevronRight, ClipboardCheck, Lock, Target } from 'lucide-react'
import type { CourseStudyQuiz } from '../../services/courseService'
import type { LessonQuiz } from '../../services/lessonService'
import { getQuizLockMessage } from '../../lib/quizLock'
import { getQuizKind, quizKindLabel } from './studyUtils'

interface QuizRowProps {
  quiz: CourseStudyQuiz | LessonQuiz
  // Course Study and Lesson Detail use distinct copy for the same lock
  // concept - callers pass their own message; defaults to Course Study's.
  lockMessage?: string
  onOpenQuiz: (quizId: string) => void
}

function QuizRow({ quiz, lockMessage, onOpenQuiz }: QuizRowProps) {
  const resolvedLockMessage = lockMessage ?? getQuizLockMessage(quiz.lockReason)
  const kind = getQuizKind(quiz.type)
  const Icon = kind === 'assessment' ? Target : ClipboardCheck
  const meta = [
    quiz.questionCount ? `${quiz.questionCount} câu` : '',
    quiz.durationMinutes ? `${quiz.durationMinutes} phút` : '',
  ].filter(Boolean)

  const content = (
    <>
      <span className={`hl-study-item-icon is-${kind}`}>
        <Icon size={17} />
      </span>
      <span className="hl-study-item-text">
        <span className="hl-study-item-kind">{quizKindLabel(kind)}</span>
        <span className="hl-study-item-title">{quiz.title}</span>
        {meta.length > 0 && <span className="hl-study-item-meta">{meta.join(' · ')}</span>}
      </span>
      <span className="hl-study-item-side">
        {quiz.bestPercentage > 0 && (
          <span className="hl-study-item-score">{quiz.bestPercentage}%</span>
        )}
        <span className="hl-study-item-attempts">
          {quiz.attemptsUsed}/{quiz.maxAttempts} lượt
        </span>
        {quiz.locked ? (
          <span className="hl-study-item-status is-locked">
            <Lock size={13} />
            Chưa mở
          </span>
        ) : quiz.passed ? (
          <span className="hl-study-item-status is-done">
            <CheckCircle2 size={14} />
            Đã đạt
          </span>
        ) : (
          <span className="hl-study-item-status is-action">
            {quiz.inProgressAttemptId ? 'Tiếp tục làm bài' : 'Làm bài'}
          </span>
        )}
        {!quiz.locked && <ChevronRight size={16} className="hl-study-item-chevron" />}
      </span>
    </>
  )

  if (quiz.locked) {
    return (
      <div className="hl-study-item is-locked" title={resolvedLockMessage}>
        {content}
        <span className="hl-study-item-lock-note">{resolvedLockMessage}</span>
      </div>
    )
  }

  return (
    <button type="button" className="hl-study-item" onClick={() => onOpenQuiz(quiz.id)}>
      {content}
    </button>
  )
}

export default QuizRow
