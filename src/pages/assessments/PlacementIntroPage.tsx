import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import QuizAttemptHistory from '../../components/assessment/QuizAttemptHistory'
import {
  getPlacementAttemptHistory,
  getPlacementTest,
  startPlacementAttempt,
  type PlacementTest,
  type QuizAttemptSummary,
} from '../../services/assessmentService'
import { getErrorMessage } from '../../lib/errors'
import { showErrorToast } from '../../lib/toastBus'

interface PlacementIntroPageProps {
  onStartAttempt: (attemptId: string) => void
  onOpenReview: (attemptId: string) => void
  onBack: () => void
}

function PlacementIntroPage({ onStartAttempt, onOpenReview, onBack }: PlacementIntroPageProps) {
  const [test, setTest] = useState<PlacementTest | null>(null)
  const [attempts, setAttempts] = useState<QuizAttemptSummary[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([getPlacementTest(), getPlacementAttemptHistory()])
      .then(([testData, history]) => {
        if (cancelled) return
        setTest(testData)
        setAttempts(history)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const inProgressAttempt = attempts.find((attempt) => attempt.status === 'IN_PROGRESS') || null

  // Always goes through the same start-or-resume endpoint - the backend
  // decides whether this creates a new attempt or resumes the in-progress
  // one (resumed flag), so there's no separate "continue" code path here.
  const handleStart = async () => {
    if (starting) return
    setStarting(true)
    try {
      const result = await startPlacementAttempt()
      onStartAttempt(result.attemptId)
    } catch (error) {
      showErrorToast(getErrorMessage(error))
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="hl-quiz-page">
      <Navbar />
      <main className="hl-quiz-main-wrap">
        <div className="hl-quiz-container hl-quiz-container-narrow">
          {status === 'loading' && (
            <div className="hl-quiz-attempt-grid">
              <div className="hl-quiz-skeleton" style={{ height: 260 }} />
            </div>
          )}

          {status === 'error' && (
            <div className="hl-quiz-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải bài kiểm tra đầu vào.'}</p>
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

          {status === 'ready' && test && (
            <div className="hl-quiz-grid">
              <button type="button" className="hl-quiz-exit" onClick={onBack}>
                <ArrowLeft size={15} />
                Quay lại
              </button>

              <section className="hl-quiz-card hl-quiz-intro-card">
                <span className="hl-quiz-card-eyebrow">Kiểm tra đầu vào</span>
                <h1>{test.title}</h1>
                {test.description && <p className="hl-quiz-intro-desc">{test.description}</p>}

                <div className="hl-quiz-intro-stats">
                  <span>{test.questions.length} câu hỏi</span>
                  {test.durationMinutes > 0 && <span>{test.durationMinutes} phút</span>}
                </div>

                <button
                  type="button"
                  className="hl-quiz-start-cta"
                  onClick={handleStart}
                  disabled={starting}
                >
                  {starting
                    ? 'Đang chuẩn bị...'
                    : inProgressAttempt
                      ? 'Tiếp tục làm bài'
                      : 'Bắt đầu làm bài'}
                </button>
              </section>

              <QuizAttemptHistory attempts={attempts} allowReview onOpenReview={onOpenReview} />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default PlacementIntroPage
