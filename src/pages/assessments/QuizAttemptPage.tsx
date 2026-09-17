import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowLeft, ArrowRight, Lock, SearchX } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import QuizTimer from '../../components/assessment/QuizTimer'
import QuestionNavigator from '../../components/assessment/QuestionNavigator'
import QuizQuestionCard from '../../components/assessment/QuizQuestionCard'
import SubmitQuizDialog from '../../components/assessment/SubmitQuizDialog'
import {
  getAttempt,
  getQuiz,
  saveAnswer,
  submitAttempt,
  type QuizAttemptDetail,
  type QuizDetail,
} from '../../services/assessmentService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'
import { showErrorToast } from '../../lib/toastBus'
import { getAssessmentLockMessage } from '../../lib/quizLock'

interface QuizAttemptPageProps {
  quizId: string
  attemptId: string
  onExit: (quizId: string) => void
  onSubmitted: (attemptId: string) => void
}

function bySequence<T extends { sequence: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sequence - b.sequence)
}

function QuizAttemptPage({ quizId, attemptId, onExit, onSubmitted }: QuizAttemptPageProps) {
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [attempt, setAttempt] = useState<QuizAttemptDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'forbidden' | 'not-found'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [savingQuestionIds, setSavingQuestionIds] = useState<Set<string>>(new Set())
  const [failedQuestionIds, setFailedQuestionIds] = useState<Set<string>>(new Set())
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expired, setExpired] = useState(false)

  const submitInFlightRef = useRef(false)
  const requestSeqRef = useRef<Map<string, number>>(new Map())
  const pendingSavesRef = useRef<Map<string, Promise<void>>>(new Map())

  useEffect(() => {
    let cancelled = false
    Promise.all([getQuiz(quizId), getAttempt(attemptId)])
      .then(([quizData, attemptData]) => {
        if (cancelled) return
        setQuiz(quizData)
        setAttempt(attemptData)
        const restored: Record<string, string> = {}
        attemptData.answers.forEach((answer) => {
          restored[answer.questionId] = answer.selectedOptionId
        })
        setSelectedAnswers(restored)
        setCurrentIndex(0)
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
  }, [quizId, attemptId, reloadKey])

  const questions = quiz ? bySequence(quiz.questions) : []
  const currentQuestion = questions[currentIndex] || null
  const answeredCount = Object.keys(selectedAnswers).length
  const isActive = attempt?.status === 'IN_PROGRESS' && !expired
  const inputsDisabled = !isActive || submitting

  const selectOption = (questionId: string, optionId: string) => {
    if (!attempt || inputsDisabled) return
    if (selectedAnswers[questionId] === optionId) return

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    setFailedQuestionIds((prev) => {
      const next = new Set(prev)
      next.delete(questionId)
      return next
    })

    const seq = (requestSeqRef.current.get(questionId) ?? 0) + 1
    requestSeqRef.current.set(questionId, seq)
    setSavingQuestionIds((prev) => new Set(prev).add(questionId))

    const savePromise = saveAnswer(attempt.attemptId, { questionId, selectedOptionId: optionId })
      .then(() => {
        if (requestSeqRef.current.get(questionId) !== seq) return
        setSavingQuestionIds((prev) => {
          const next = new Set(prev)
          next.delete(questionId)
          return next
        })
      })
      .catch((error) => {
        if (requestSeqRef.current.get(questionId) !== seq) return
        setSavingQuestionIds((prev) => {
          const next = new Set(prev)
          next.delete(questionId)
          return next
        })
        setFailedQuestionIds((prev) => new Set(prev).add(questionId))
        showErrorToast(getErrorMessage(error))
      })

    pendingSavesRef.current.set(questionId, savePromise)
  }

  const performSubmit = async () => {
    if (submitInFlightRef.current || !attempt) return
    submitInFlightRef.current = true
    setSubmitting(true)
    try {
      await Promise.allSettled(Array.from(pendingSavesRef.current.values()))
      await submitAttempt(attempt.attemptId)
      onSubmitted(attempt.attemptId)
    } catch (error) {
      showErrorToast(getErrorMessage(error))
      setSubmitting(false)
      submitInFlightRef.current = false
    }
  }

  const handleExpire = () => {
    if (submitInFlightRef.current) return
    setExpired(true)
    void performSubmit()
  }

  const handleConfirmSubmit = () => {
    setShowSubmitDialog(false)
    void performSubmit()
  }

  return (
    <div className="hl-quiz-page">
      <Navbar />
      <main className="hl-quiz-main-wrap">
        <div className="hl-quiz-container">
          {status === 'loading' && (
            <div className="hl-quiz-attempt-grid">
              <div className="hl-quiz-skeleton" style={{ height: 320 }} />
              <div className="hl-quiz-skeleton" style={{ height: 220 }} />
            </div>
          )}

          {status === 'forbidden' && (
            <div className="hl-quiz-state">
              <Lock size={30} />
              <p>{getAssessmentLockMessage(null)}</p>
              <button type="button" onClick={() => onExit(quizId)}>
                Quay lại bài kiểm tra
              </button>
            </div>
          )}

          {status === 'not-found' && (
            <div className="hl-quiz-state">
              <SearchX size={30} />
              <p>Không tìm thấy bài làm.</p>
              <button type="button" onClick={() => onExit(quizId)}>
                Quay lại bài kiểm tra
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="hl-quiz-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải bài làm.'}</p>
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

          {status === 'ready' && quiz && attempt && currentQuestion && (
            <>
              <button type="button" className="hl-quiz-exit" onClick={() => onExit(quizId)}>
                <ArrowLeft size={15} />
                Thoát bài kiểm tra
              </button>

              {attempt.status !== 'IN_PROGRESS' && (
                <div className="hl-quiz-banner">
                  <span>Bài làm này đã được nộp.</span>
                  <button type="button" onClick={() => onSubmitted(attempt.attemptId)}>
                    Xem kết quả
                  </button>
                </div>
              )}

              <div className="hl-quiz-attempt-grid">
                <div className="hl-quiz-attempt-main">
                  <QuizQuestionCard
                    question={currentQuestion}
                    index={currentIndex}
                    total={questions.length}
                    selectedOptionId={selectedAnswers[currentQuestion.id] || null}
                    saving={savingQuestionIds.has(currentQuestion.id)}
                    saveFailed={failedQuestionIds.has(currentQuestion.id)}
                    disabled={inputsDisabled}
                    onSelectOption={(optionId) => selectOption(currentQuestion.id, optionId)}
                  />

                  <div className="hl-quiz-nav-footer">
                    <button
                      type="button"
                      className="hl-quiz-nav-btn"
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex((current) => Math.max(0, current - 1))}
                    >
                      <ArrowLeft size={16} />
                      Câu trước
                    </button>

                    {currentIndex === questions.length - 1 ? (
                      <button
                        type="button"
                        className="hl-quiz-nav-btn is-primary"
                        disabled={inputsDisabled}
                        onClick={() => setShowSubmitDialog(true)}
                      >
                        Nộp bài
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="hl-quiz-nav-btn is-primary"
                        onClick={() =>
                          setCurrentIndex((current) => Math.min(questions.length - 1, current + 1))
                        }
                      >
                        Câu tiếp theo
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <aside className="hl-quiz-attempt-aside">
                  {isActive && (
                    <QuizTimer deadlineAt={attempt.deadlineAt} onExpire={handleExpire} />
                  )}

                  <div className="hl-quiz-answered-count">
                    Đã trả lời {answeredCount}/{questions.length} câu
                  </div>

                  <QuestionNavigator
                    questions={questions}
                    currentQuestionId={currentQuestion.id}
                    answeredQuestionIds={new Set(Object.keys(selectedAnswers))}
                    disabled={submitting}
                    onSelect={(questionId) => {
                      const index = questions.findIndex((question) => question.id === questionId)
                      if (index >= 0) setCurrentIndex(index)
                    }}
                  />

                  <button
                    type="button"
                    className="hl-quiz-submit-cta"
                    disabled={inputsDisabled}
                    onClick={() => setShowSubmitDialog(true)}
                  >
                    Nộp bài
                  </button>
                </aside>
              </div>

              {showSubmitDialog && (
                <SubmitQuizDialog
                  answeredCount={answeredCount}
                  totalQuestions={questions.length}
                  submitting={submitting}
                  onCancel={() => setShowSubmitDialog(false)}
                  onConfirm={handleConfirmSubmit}
                />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default QuizAttemptPage
