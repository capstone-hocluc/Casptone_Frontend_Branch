import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import QuizReviewQuestionCard from '../../components/assessment/QuizReviewQuestionCard'
import { getAttemptReview, type QuizReview } from '../../services/assessmentService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'

interface PlacementReviewPageProps {
  attemptId: string
  onBack: () => void
}

function bySequence<T extends { sequence: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sequence - b.sequence)
}

// The placement test definition has no showAnswers-style flag (unlike a
// course quiz), so unlike QuizReviewPage this never gates the per-question
// breakdown behind a lookup - it's always shown once the review loads.
function PlacementReviewPage({ attemptId, onBack }: PlacementReviewPageProps) {
  const [review, setReview] = useState<QuizReview | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'not-found'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getAttemptReview(attemptId)
      .then((data) => {
        if (cancelled) return
        setReview(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 404) {
          setStatus('not-found')
          return
        }
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [attemptId, reloadKey])

  return (
    <div className="hl-quiz-page">
      <Navbar />
      <main className="hl-quiz-main-wrap">
        <div className="hl-quiz-container">
          {status === 'loading' && (
            <div className="hl-quiz-attempt-grid">
              <div className="hl-quiz-skeleton" style={{ height: 160 }} />
              <div className="hl-quiz-skeleton" style={{ height: 320 }} />
            </div>
          )}

          {status === 'not-found' && (
            <div className="hl-quiz-state">
              <SearchX size={30} />
              <p>Không tìm thấy kết quả bài làm.</p>
              <button type="button" onClick={onBack}>
                Quay lại
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="hl-quiz-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải kết quả bài làm.'}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus('loading')
                  setReloadKey((current) => current + 1)
                }}
              >
                Thử lại
              </button>
            </div>
          )}

          {status === 'ready' && review && (
            <div className="hl-quiz-grid">
              <button type="button" className="hl-quiz-exit" onClick={onBack}>
                <ArrowLeft size={15} />
                Quay lại kết quả
              </button>

              <section className="hl-quiz-card">
                <h2>Xem lại đáp án</h2>
                <div className="hl-quiz-review-list">
                  {bySequence(review.questions).map((question, index) => (
                    <QuizReviewQuestionCard
                      key={question.questionId}
                      question={question}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default PlacementReviewPage
