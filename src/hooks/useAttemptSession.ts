import { useRef, useState } from 'react'
import { saveAnswer, submitAttempt, type QuizAttemptDetail } from '../services/assessmentService'
import { getErrorMessage } from '../lib/errors'
import { showErrorToast } from '../lib/toastBus'

// State machine of one in-progress attempt, shared by the course-quiz and the
// placement attempt pages (they used to carry identical copies): restored
// answers, per-question autosave with out-of-order-response guarding, the
// single-flight submit that waits for pending saves, and timer expiry.
// The pages own data loading and call `hydrate` with the loaded attempt.
export function useAttemptSession(onSubmitted: (attemptId: string) => void) {
  const [attempt, setAttempt] = useState<QuizAttemptDetail | null>(null)
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

  const hydrate = (attemptData: QuizAttemptDetail) => {
    setAttempt(attemptData)
    const restored: Record<string, string> = {}
    attemptData.answers.forEach((answer) => {
      restored[answer.questionId] = answer.selectedOptionId
    })
    setSelectedAnswers(restored)
    setCurrentIndex(0)
  }

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

  return {
    attempt,
    hydrate,
    currentIndex,
    setCurrentIndex,
    selectedAnswers,
    savingQuestionIds,
    failedQuestionIds,
    answeredCount,
    isActive,
    inputsDisabled,
    submitting,
    showSubmitDialog,
    setShowSubmitDialog,
    selectOption,
    handleExpire,
    handleConfirmSubmit,
  }
}

export type AttemptSession = ReturnType<typeof useAttemptSession>
