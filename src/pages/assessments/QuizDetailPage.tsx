import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowLeft, CheckCircle2, Lock, SearchX } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import QuizAttemptHistory from '../../components/assessment/QuizAttemptHistory'
import { getQuiz, startQuizAttempt, type QuizDetail } from '../../services/assessmentService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'
import { showErrorToast } from '../../lib/toastBus'
import { getAssessmentLockMessage } from '../../lib/quizLock'
import { prettifyEnum } from '../../lib/courseFormat'

interface QuizDetailPageProps {
  quizId: string
  onStartAttempt: (quizId: string, attemptId: string) => void
  onOpenReview: (attemptId: string) => void
}

function QuizDetailPage({ quizId, onStartAttempt, onOpenReview }: QuizDetailPageProps) {
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'forbidden' | 'not-found'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    let cancelled = false
    getQuiz(quizId)
      .then((data) => {
        if (cancelled) return
        setQuiz(data)
        setStatus('ready')
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
  }, [quizId, reloadKey])

  const handleContinue = () => {
    if (!quiz?.inProgressAttemptId) return
    onStartAttempt(quiz.id, quiz.inProgressAttemptId)
  }

  const handleStart = async () => {
    if (!quiz || starting) return
    setStarting(true)
    try {
      const result = await startQuizAttempt(quiz.id)
      onStartAttempt(quiz.id, result.attemptId)
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

          {status === 'forbidden' && (
            <div className="hl-quiz-state">
              <Lock size={30} />
              <p>{getAssessmentLockMessage(null)}</p>
            </div>
          )}

          {status === 'not-found' && (
            <div className="hl-quiz-state">
              <SearchX size={30} />
              <p>Không tìm thấy bài kiểm tra.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="hl-quiz-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải bài kiểm tra.'}</p>
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

          {status === 'ready' && quiz && (
            <div className="hl-quiz-grid">
              <button
                type="button"
                className="hl-quiz-exit"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={15} />
                Quay lại
              </button>

              <section className="hl-quiz-card hl-quiz-intro-card">
                <span className="hl-quiz-card-eyebrow">{prettifyEnum(quiz.type)}</span>
                <h1>{quiz.title}</h1>
                {quiz.description && <p className="hl-quiz-intro-desc">{quiz.description}</p>}

                <div className="hl-quiz-intro-stats">
                  <span>{quiz.questionCount} câu hỏi</span>
                  {quiz.durationMinutes > 0 && <span>{quiz.durationMinutes} phút</span>}
                  <span>Điểm đạt: {quiz.passingPercentage}%</span>
                  <span>
                    Lượt làm: {quiz.attemptsUsed}/{quiz.maxAttempts}
                  </span>
                </div>

                {quiz.passed && (
                  <span className="hl-quiz-passed-tag">
                    <CheckCircle2 size={14} />
                    Đã đạt · Kết quả tốt nhất {quiz.bestPercentage}%
                  </span>
                )}

                {quiz.locked ? (
                  <div className="hl-quiz-locked-note">
                    <Lock size={16} />
                    {getAssessmentLockMessage(quiz.lockReason)}
                  </div>
                ) : quiz.inProgressAttemptId ? (
                  <button type="button" className="hl-quiz-start-cta" onClick={handleContinue}>
                    Tiếp tục làm bài
                  </button>
                ) : (
                  <button
                    type="button"
                    className="hl-quiz-start-cta"
                    onClick={handleStart}
                    disabled={starting}
                  >
                    {starting ? 'Đang bắt đầu...' : 'Bắt đầu làm bài'}
                  </button>
                )}
              </section>

              <QuizAttemptHistory
                attempts={quiz.attempts}
                allowReview={quiz.showAnswers}
                onOpenReview={onOpenReview}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default QuizDetailPage
