import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import QuizResultSummary from '../../components/assessment/QuizResultSummary'
import QuizReviewQuestionCard from '../../components/assessment/QuizReviewQuestionCard'
import { getAttemptReview, getQuiz, type QuizReview } from '../../services/assessmentService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'

interface QuizReviewPageProps {
  attemptId: string
  onBackToQuiz: (quizId: string) => void
}

function bySequence<T extends { sequence: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sequence - b.sequence)
}

function QuizReviewPage({ attemptId, onBackToQuiz }: QuizReviewPageProps) {
  const [review, setReview] = useState<QuizReview | null>(null)
  const [showAnswers, setShowAnswers] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'forbidden' | 'not-found'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getAttemptReview(attemptId)
      .then((data) => {
        if (cancelled) return
        setReview(data)
        setStatus('ready')
        // showAnswers isn't part of the review contract - the only way to
        // know it is to look at the quiz's own setting. Fails closed: if
        // this lookup fails, per-question answers stay hidden.
        getQuiz(data.quizId)
          .then((quiz) => {
            if (!cancelled) setShowAnswers(Boolean(quiz.showAnswers))
          })
          .catch(() => {})
      })
      .catch((error) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 403) {
          setStatus('forbidden')
          return
        }
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

          {status === 'forbidden' && (
            <div className="hl-quiz-state">
              <ArrowLeft size={30} />
              <p>Bạn chưa có quyền xem kết quả bài kiểm tra này.</p>
            </div>
          )}

          {status === 'not-found' && (
            <div className="hl-quiz-state">
              <SearchX size={30} />
              <p>Không tìm thấy kết quả bài kiểm tra.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="hl-quiz-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải kết quả bài kiểm tra.'}</p>
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
              <button type="button" className="hl-quiz-exit" onClick={() => onBackToQuiz(review.quizId)}>
                <ArrowLeft size={15} />
                Quay lại bài kiểm tra
              </button>

              <QuizResultSummary review={review} />

              {showAnswers && (
                <section className="hl-quiz-card">
                  <h2>Chi tiết bài làm</h2>
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
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default QuizReviewPage
