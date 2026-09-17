import { Eye } from 'lucide-react'
import type { QuizAttemptSummary } from '../../services/assessmentService'
import { getAttemptStatusLabel } from '../../lib/attemptStatus'
import { formatDuration } from '../../lib/courseFormat'

function formatDateTime(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('vi-VN')
}

interface QuizAttemptHistoryProps {
  attempts: QuizAttemptSummary[]
  allowReview: boolean
  onOpenReview: (attemptId: string) => void
}

function QuizAttemptHistory({ attempts, allowReview, onOpenReview }: QuizAttemptHistoryProps) {
  if (attempts.length === 0) return null

  const sorted = [...attempts].sort((a, b) => b.attemptNumber - a.attemptNumber)

  return (
    <section className="hl-quiz-card">
      <h2>Lịch sử làm bài</h2>
      <div className="hl-quiz-attempt-list">
        {sorted.map((attempt) => {
          const canReview = allowReview && attempt.status !== 'IN_PROGRESS'
          return (
            <div className="hl-quiz-attempt-row" key={attempt.attemptId}>
              <div>
                <span className="hl-quiz-attempt-number">Lần {attempt.attemptNumber}</span>
                <span className="hl-quiz-attempt-status">
                  {getAttemptStatusLabel(attempt.status)}
                </span>
              </div>
              <div className="hl-quiz-attempt-meta">
                {attempt.status !== 'IN_PROGRESS' && (
                  <span>{attempt.percentage}%</span>
                )}
                {attempt.timeSpentSeconds > 0 && (
                  <span>{formatDuration(attempt.timeSpentSeconds)}</span>
                )}
                <span>{formatDateTime(attempt.submittedAt || attempt.startedAt)}</span>
              </div>
              {canReview && (
                <button
                  type="button"
                  className="hl-quiz-attempt-review-btn"
                  onClick={() => onOpenReview(attempt.attemptId)}
                >
                  <Eye size={14} />
                  Xem lại
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default QuizAttemptHistory
