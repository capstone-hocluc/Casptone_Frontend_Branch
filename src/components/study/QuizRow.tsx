import { CheckCircle2, HelpCircle, Lock } from 'lucide-react'
import type { CourseStudyQuiz } from '../../services/courseService'
import type { LessonQuiz } from '../../services/lessonService'
import { prettifyEnum } from '../../lib/courseFormat'
import { getQuizLockMessage } from '../../lib/quizLock'

interface QuizRowProps {
  quiz: CourseStudyQuiz | LessonQuiz
  // Course Study and Lesson Detail use distinct copy for the same lock
  // concept - callers pass their own message; defaults to Course Study's.
  lockMessage?: string
  onOpenQuiz: (quizId: string) => void
}

function QuizRow({ quiz, lockMessage, onOpenQuiz }: QuizRowProps) {
  const resolvedLockMessage = lockMessage ?? getQuizLockMessage(quiz.lockReason)

  return (
    <div className={`hl-study-quiz${quiz.locked ? ' is-locked' : ''}`}>
      <div className="hl-study-quiz-main">
        <HelpCircle size={14} />
        <span className="hl-study-quiz-title">{quiz.title}</span>
        <span className="hl-study-quiz-meta">
          {quiz.type && <span>{prettifyEnum(quiz.type)}</span>}
          {Boolean(quiz.questionCount) && <span>{quiz.questionCount} câu</span>}
          {Boolean(quiz.durationMinutes) && <span>{quiz.durationMinutes} phút</span>}
        </span>
      </div>

      <div className="hl-study-quiz-side">
        {quiz.passed && (
          <span className="hl-study-quiz-passed">
            <CheckCircle2 size={12} />
            Đã đạt
          </span>
        )}
        {quiz.bestPercentage > 0 && (
          <span className="hl-study-quiz-best">Kết quả tốt nhất: {quiz.bestPercentage}%</span>
        )}
        <span className="hl-study-quiz-attempts">
          {quiz.attemptsUsed}/{quiz.maxAttempts} lượt
        </span>

        {quiz.locked ? (
          <span className="hl-study-quiz-lock" title={resolvedLockMessage}>
            <Lock size={13} />
            {resolvedLockMessage}
          </span>
        ) : (
          <button type="button" className="hl-study-quiz-cta" onClick={() => onOpenQuiz(quiz.id)}>
            {quiz.inProgressAttemptId ? 'Tiếp tục làm bài' : 'Bắt đầu làm bài'}
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizRow
