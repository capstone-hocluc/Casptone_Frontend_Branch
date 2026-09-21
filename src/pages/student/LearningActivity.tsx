import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react'
import { findCourseActivity, getActivityRouteType } from '../../data/courseLookup'
import { useTransientMessage } from '../../hooks/useTransientMessage'
import StudentToast from '../../components/student/common/StudentToast'
import MascotState from '../../components/common/MascotState'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Card from '../../components/ui/Card'

const pageSize = 10

const questionOptions = [
  { id: 'A', text: 'Xác định ý chính của đoạn văn' },
  { id: 'B', text: 'Loại bỏ toàn bộ ví dụ minh họa' },
  { id: 'C', text: 'Chỉ đọc câu cuối cùng' },
  { id: 'D', text: 'Bỏ qua dữ kiện trong đề' },
]

const reviewFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'correct', label: 'Câu đúng' },
  { key: 'incorrect', label: 'Câu sai' },
  { key: 'unanswered', label: 'Chưa trả lời' },
]

function LearningShell({ context, onBack, children }) {
  return (
    <section className="hl-student-page hl-activity-page">
      <button type="button" className="hl-activity-back" onClick={onBack}>
        <ArrowLeft size={17} />
        Quay lại khóa học
      </button>
      <div className="hl-activity-crumb">
        <span>{context.course.title}</span>
        <ChevronRight size={14} />
        <span>{context.subjectTitle}</span>
        <ChevronRight size={14} />
        <strong>{context.chapterTitle}</strong>
      </div>
      {children}
    </section>
  )
}

function ActivityHeader({ activity, label }) {
  const meta = [
    activity.questionCount ? `${activity.questionCount} câu` : '',
    activity.duration || '',
    activity.deadline ? `Hạn ${activity.deadline}` : '',
  ].filter(Boolean)

  return (
    <header className="hl-activity-header-card">
      <span>{label}</span>
      <h1>{activity.title}</h1>
      {meta.length > 0 && <p>{meta.join(' · ')}</p>}
    </header>
  )
}

function VideoScreen({ activity, onAction }) {
  return (
    <>
      <ActivityHeader
        activity={activity}
        label={activity.type === 'Buổi giải đề' ? 'Buổi giải đề' : 'Video'}
      />
      <div className="hl-activity-two-column">
        <article className="hl-activity-card">
          <div className="hl-activity-video-frame">
            <Play size={40} />
            <span>Video bài học</span>
          </div>
          <p className="hl-activity-duration">{activity.duration}</p>
        </article>
        <article className="hl-activity-card">
          <h2>Mục tiêu bài học</h2>
          <ul className="hl-activity-goals">
            <li>Xác định được ý chính của nội dung học.</li>
            <li>Nhận diện thông tin quan trọng trong câu hỏi ĐGNL.</li>
            <li>Áp dụng kiến thức vào bài luyện tập tiếp theo.</li>
          </ul>
        </article>
      </div>
      <LearningActions primaryLabel="Đánh dấu hoàn thành" onAction={onAction} />
    </>
  )
}

function createQuestions(activity, total) {
  return Array.from({ length: total }, (_, index) => {
    const correctAnswer = ['A', 'B', 'C', 'D'][index % 4]

    return {
      id: `q-${index + 1}`,
      number: index + 1,
      type: 'single-choice',
      content: `Câu hỏi ${index + 1} cho nội dung "${activity.title}". Đọc dữ kiện và chọn đáp án phù hợp nhất.`,
      options: questionOptions,
      correctAnswer,
      explanation: `Đáp án ${correctAnswer} đúng vì phương án này bám sát yêu cầu chính của câu hỏi và không bỏ qua dữ kiện quan trọng trong đề.`,
    }
  })
}

function parseDurationToSeconds(duration, fallbackMinutes) {
  const minutes = Number.parseInt(String(duration).match(/\d+/)?.[0] || '', 10) || fallbackMinutes
  return minutes * 60
}

function formatClock(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds]
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}

function createSeedAttempt(activity, questions) {
  if (activity.status !== 'completed') return []

  const answers = questions.reduce((result, question, index) => {
    result[question.id] = index % 5 === 0 ? 'B' : question.correctAnswer
    return result
  }, {})
  const score = scoreAttempt(questions, answers)

  return [
    {
      id: `${activity.id}-attempt-1`,
      attemptNumber: 1,
      score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      duration: activity.duration?.replace(' phút', ':10') || '18:32',
      submittedAt: '2026-09-10T09:00:00',
      answers,
    },
  ]
}

function scoreAttempt(questions, answers) {
  return questions.reduce(
    (total, question) => (answers[question.id] === question.correctAnswer ? total + 1 : total),
    0
  )
}

function getAttemptBreakdown(questions, attempt) {
  return questions.reduce(
    (result, question) => {
      const answer = attempt.answers[question.id]
      if (!answer) result.unanswered += 1
      else if (answer === question.correctAnswer) result.correct += 1
      else result.incorrect += 1
      return result
    },
    { correct: 0, incorrect: 0, unanswered: 0 }
  )
}

function getScoreTone(percentage) {
  if (percentage >= 80) return 'success'
  if (percentage >= 60) return 'blue'
  if (percentage >= 40) return 'warning'
  return 'danger'
}

function getBestAttempt(attempts, fallback) {
  return attempts.reduce(
    (best, item) => (item.percentage > best.percentage ? item : best),
    fallback
  )
}

function formatSubmittedAt(value) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function getStoredAttempts(activityId, fallback) {
  try {
    const stored = window.localStorage.getItem(`hocLucAttempts:${activityId}`)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveStoredAttempts(activityId, attempts) {
  try {
    window.localStorage.setItem(`hocLucAttempts:${activityId}`, JSON.stringify(attempts))
  } catch {
    // Local mock only; ignore storage failures.
  }
}

function ResultSummary({
  activity,
  label,
  questions,
  attempt,
  onReview,
  onRetry,
  onBack,
  history = [],
  onOpenAttempt,
}) {
  const bestAttempt = getBestAttempt(history, attempt)
  const scoreTone = getScoreTone(bestAttempt.percentage)
  const meta = [
    activity.questionCount ? `${activity.questionCount} câu` : '',
    activity.duration || '',
  ].filter(Boolean)

  return (
    <>
      <article className={`hl-activity-card hl-activity-result-card is-${scoreTone}`}>
        <div className="hl-activity-result-main">
          <span>{label}</span>
          <h1>
            {label} · {activity.title}
          </h1>
          {meta.length > 0 && <p>{meta.join(' · ')}</p>}
          <div className="hl-activity-result-meta-line">
            <span>
              Lần làm <b className="is-attempt">{attempt.attemptNumber}</b>
            </span>
            <i />
            <span>
              Thời gian <b className="is-duration">{attempt.duration}</b>
            </span>
            <i />
            <span>
              Ngày nộp <b className="is-date">{formatShortDate(attempt.submittedAt)}</b>
            </span>
          </div>
          <div className="hl-activity-result-actions">
            <button type="button" className="is-primary" onClick={() => onReview(attempt)}>
              Xem lại bài làm
            </button>
            <button type="button" className="is-secondary" onClick={onRetry}>
              <RotateCcw size={15} />
              Làm lại
            </button>
          </div>
        </div>

        <div className="hl-activity-result-score">
          <div className="hl-activity-result-bubble">
            Điểm được cập nhật
            <br />
            theo kết quả cao nhất
          </div>
          <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
          <div className="hl-activity-result-score-panel">
            <span>Điểm cao nhất</span>
            <h2>
              <b>{bestAttempt.score}</b> <small>/ {bestAttempt.totalQuestions}</small>
            </h2>
          </div>
        </div>
      </article>

      {history.length > 0 && (
        <section className="hl-activity-attempt-history">
          <h2>Lịch sử làm bài</h2>
          <div>
            {history.map((item) => (
              <article key={item.id} className="hl-activity-attempt-row">
                <div>
                  <strong>Lần {item.attemptNumber}</strong>
                  <span>
                    {item.score}/{item.totalQuestions} · {item.percentage}%
                  </span>
                </div>
                <span>{item.duration}</span>
                <time>{formatSubmittedAt(item.submittedAt)}</time>
                <button type="button" onClick={() => onOpenAttempt(item)}>
                  Xem lại
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function ReviewQuestion({ question, attempt }) {
  const selectedAnswer = attempt.answers[question.id]
  const selectedOption = question.options.find((option) => option.id === selectedAnswer)
  const correctOption = question.options.find((option) => option.id === question.correctAnswer)
  const state = !selectedAnswer
    ? 'unanswered'
    : selectedAnswer === question.correctAnswer
      ? 'correct'
      : 'incorrect'
  const stateLabel = state === 'correct' ? 'Đúng' : state === 'incorrect' ? 'Sai' : 'Chưa trả lời'

  return (
    <article
      id={`review-question-${question.number}`}
      className={`hl-activity-card hl-activity-question-item hl-activity-review-question is-${state}`}
    >
      <div className="hl-activity-question-top">
        <span>Câu {question.number}</span>
        <small>{stateLabel}</small>
      </div>
      <h2>{question.content}</h2>
      <div className="hl-activity-review-options">
        {question.options.map((option) => {
          const isSelected = option.id === selectedAnswer
          const isCorrect = option.id === question.correctAnswer
          return (
            <p
              key={option.id}
              className={`${isSelected ? 'is-student' : ''} ${isCorrect ? 'is-correct' : ''}`}
            >
              <b>{option.id}</b>
              <span>{option.text}</span>
            </p>
          )
        })}
      </div>
      <div className="hl-activity-review-answer">
        <p>
          <span>Đáp án của bạn:</span>
          <strong>
            {selectedOption ? `${selectedOption.id}. ${selectedOption.text}` : 'Chưa trả lời'}
          </strong>
        </p>
        <p>
          <span>Đáp án đúng:</span>
          <strong>
            {correctOption.id}. {correctOption.text}
          </strong>
        </p>
      </div>
      <div className="hl-activity-review-explain">
        <strong>Giải thích</strong>
        <p>{question.explanation}</p>
      </div>
    </article>
  )
}

function ReviewMode({ activity, label, questions, attempt, onBackResult }) {
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const totalPages = Math.max(
    1,
    Math.ceil(
      questions.filter((question) => {
        const answer = attempt.answers[question.id]
        const state = !answer
          ? 'unanswered'
          : answer === question.correctAnswer
            ? 'correct'
            : 'incorrect'
        return filter === 'all' || filter === state
      }).length / pageSize
    )
  )
  const filteredQuestions = questions.filter((question) => {
    const answer = attempt.answers[question.id]
    const state = !answer
      ? 'unanswered'
      : answer === question.correctAnswer
        ? 'correct'
        : 'incorrect'
    return filter === 'all' || filter === state
  })
  const visibleQuestions = filteredQuestions.slice((page - 1) * pageSize, page * pageSize)
  const breakdown = getAttemptBreakdown(questions, attempt)

  const setReviewFilter = (nextFilter) => {
    setFilter(nextFilter)
    setPage(1)
  }

  const jumpToQuestion = (number) => {
    setFilter('all')
    setPage(Math.ceil(number / pageSize))
    window.setTimeout(() => {
      document
        .getElementById(`review-question-${number}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  return (
    <>
      <ActivityHeader activity={activity} label={`${label} · Xem lại`} />
      <div className="hl-activity-review-filters">
        {reviewFilters.map((item) => (
          <button
            key={item.key}
            type="button"
            className={filter === item.key ? 'is-active' : ''}
            onClick={() => setReviewFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="hl-activity-test-layout">
        <main className="hl-activity-question-stack">
          {visibleQuestions.map((question) => (
            <ReviewQuestion key={question.id} question={question} attempt={attempt} />
          ))}
          {visibleQuestions.length === 0 && (
            <article className="hl-activity-card hl-activity-review-empty">
              Không có câu hỏi phù hợp với bộ lọc này.
            </article>
          )}
          <div className="hl-activity-bottom-nav">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft size={15} />
              Trang trước
            </button>
            <span>
              Trang {page}/{totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Trang sau
              <ChevronRight size={15} />
            </button>
          </div>
        </main>

        <aside className="hl-activity-card hl-activity-question-nav">
          <h2>Xem lại lần {attempt.attemptNumber}</h2>
          <div className="hl-activity-tracker-stat">
            <p>
              <span>Điểm</span>
              <strong>
                {attempt.score}/{attempt.totalQuestions}
              </strong>
            </p>
            <p>
              <span>Tỷ lệ</span>
              <strong>{attempt.percentage}%</strong>
            </p>
            <p>
              <span>Sai</span>
              <strong>{breakdown.incorrect}</strong>
            </p>
            <p>
              <span>Chưa trả lời</span>
              <strong>{breakdown.unanswered}</strong>
            </p>
          </div>
          <div className="hl-activity-question-number-grid">
            {questions.map((question) => {
              const answer = attempt.answers[question.id]
              const state = !answer
                ? 'unanswered'
                : answer === question.correctAnswer
                  ? 'correct'
                  : 'incorrect'
              return (
                <button
                  key={question.id}
                  type="button"
                  className={`is-review-${state}`}
                  onClick={() => jumpToQuestion(question.number)}
                >
                  {question.number}
                </button>
              )
            })}
          </div>
          <div className="hl-activity-tracker-legend">
            <span>
              <i className="is-correct" /> Đúng
            </span>
            <span>
              <i className="is-incorrect" /> Sai
            </span>
            <span>
              <i className="is-unanswered" /> Chưa trả lời
            </span>
          </div>
          <button type="button" className="hl-activity-submit-button" onClick={onBackResult}>
            Quay lại kết quả
          </button>
        </aside>
      </div>
    </>
  )
}

function QuestionTakingScreen({ activity, mode, onBack }) {
  const totalQuestions =
    activity.questionCount || (mode === 'mock-test' ? 120 : mode === 'mini-test' ? 20 : 10)
  const questions = useMemo(
    () => createQuestions(activity, totalQuestions),
    [activity, totalQuestions]
  )
  const label = mode === 'mock-test' ? 'Mock Test' : mode === 'mini-test' ? 'Mini Test' : 'Bài tập'
  const [attempts, setAttempts] = useState(() =>
    getStoredAttempts(activity.id, createSeedAttempt(activity, questions))
  )
  const [view, setView] = useState(() => (attempts.length > 0 ? 'result' : 'taking'))
  const [activeAttempt, setActiveAttempt] = useState(() => attempts[0] || null)
  const [page, setPage] = useState(1)
  const [answers, setAnswers] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const totalPages = Math.ceil(totalQuestions / pageSize)
  const visibleQuestions = questions.slice((page - 1) * pageSize, page * pageSize)
  const answeredCount = Object.keys(answers).length
  const durationSeconds = parseDurationToSeconds(
    activity.duration,
    mode === 'mock-test' ? 150 : mode === 'mini-test' ? 25 : 30
  )
  const timerText =
    mode === 'exercise'
      ? formatClock(elapsedSeconds)
      : formatClock(Math.max(durationSeconds - elapsedSeconds, 0))

  useEffect(() => {
    if (view !== 'taking') return undefined

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [view])

  const chooseAnswer = (questionId, optionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }))
  }

  const startAttempt = () => {
    setAnswers({})
    setPage(1)
    setElapsedSeconds(0)
    setConfirmOpen(false)
    setView('taking')
  }

  const finishAttempt = () => {
    const score = scoreAttempt(questions, answers)
    const attempt = {
      id: `${activity.id}-attempt-${attempts.length + 1}-${Date.now()}`,
      attemptNumber: attempts.length + 1,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      duration: formatClock(elapsedSeconds),
      submittedAt: new Date().toISOString(),
      answers: { ...answers },
    }
    const nextAttempts = [attempt, ...attempts]
    setAttempts(nextAttempts)
    saveStoredAttempts(activity.id, nextAttempts)
    setActiveAttempt(attempt)
    setConfirmOpen(false)
    setView('result')
  }

  const submit = () => {
    if (answeredCount < totalQuestions) {
      setConfirmOpen(true)
      return
    }
    finishAttempt()
  }

  if (view === 'review' && activeAttempt) {
    return (
      <ReviewMode
        activity={activity}
        label={label}
        questions={questions}
        attempt={activeAttempt}
        onBackResult={() => setView('result')}
      />
    )
  }

  if (view === 'result' && activeAttempt) {
    return (
      <ResultSummary
        activity={activity}
        label={label}
        questions={questions}
        attempt={activeAttempt}
        history={attempts}
        onReview={(attempt) => {
          setActiveAttempt(attempt)
          setView('review')
        }}
        onOpenAttempt={(attempt) => {
          setActiveAttempt(attempt)
          setView('review')
        }}
        onRetry={startAttempt}
        onBack={onBack}
      />
    )
  }

  return (
    <>
      <ActivityHeader activity={activity} label={label} />
      <div className="hl-activity-test-layout">
        <main className="hl-activity-question-stack">
          {visibleQuestions.map((question) => (
            <article key={question.id} className="hl-activity-card hl-activity-question-item">
              <div className="hl-activity-question-top">
                <span>Câu {question.number}</span>
                <small>{question.type === 'single-choice' ? 'Chọn 1 đáp án' : question.type}</small>
              </div>
              <h2>{question.content}</h2>
              <div className="hl-activity-answer-list">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={answers[question.id] === option.id ? 'is-selected' : ''}
                    onClick={() => chooseAnswer(question.id, option.id)}
                  >
                    <b>{option.id}</b>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
          <div className="hl-activity-bottom-nav">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft size={15} />
              Trang trước
            </button>
            <span>
              Trang {page}/{totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Trang sau
              <ChevronRight size={15} />
            </button>
          </div>
        </main>

        <aside className="hl-activity-card hl-activity-question-nav">
          <h2>Theo dõi bài làm</h2>
          <div className="hl-activity-tracker-stat">
            <p>
              <span>{mode === 'exercise' ? 'Thời gian' : 'Còn lại'}</span>
              <strong>{timerText}</strong>
            </p>
            <p>
              <span>Đã làm</span>
              <strong>
                {answeredCount}/{totalQuestions}
              </strong>
            </p>
          </div>
          <div className="hl-activity-question-number-grid">
            {questions.map((question) => (
              <button
                key={question.id}
                type="button"
                className={`${visibleQuestions.some((item) => item.id === question.id) ? 'is-active' : ''} ${answers[question.id] ? 'is-answered' : ''}`}
                onClick={() => setPage(Math.ceil(question.number / pageSize))}
              >
                {question.number}
              </button>
            ))}
          </div>
          <div className="hl-activity-tracker-legend">
            <span>
              <i className="is-answered" /> Đã trả lời
            </span>
            <span>
              <i /> Chưa trả lời
            </span>
          </div>
          <button type="button" className="hl-activity-submit-button" onClick={submit}>
            NỘP BÀI
          </button>
        </aside>
      </div>

      {confirmOpen && (
        <div className="hl-activity-modal-layer">
          <div className="hl-activity-submit-modal">
            <h2>Xác nhận nộp bài</h2>
            <p>Bạn vẫn còn câu chưa trả lời. Bạn có chắc muốn nộp bài không?</p>
            <div>
              <button type="button" onClick={() => setConfirmOpen(false)}>
                Tiếp tục làm
              </button>
              <button type="button" onClick={finishAttempt}>
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function LearningActions({ primaryLabel, onAction }) {
  return (
    <div className="hl-activity-actions">
      <button type="button" onClick={() => onAction('Điều hướng bài trước đang được phát triển.')}>
        <ArrowLeft size={15} />
        Bài trước
      </button>
      <button
        type="button"
        className="is-primary"
        onClick={() => onAction('Tiến độ đã được cập nhật mô phỏng.')}
      >
        <CheckCircle2 size={15} />
        {primaryLabel}
      </button>
      <button
        type="button"
        onClick={() => onAction('Điều hướng bài tiếp theo đang được phát triển.')}
      >
        Bài tiếp theo
        <ArrowRight size={15} />
      </button>
    </div>
  )
}

function LearningActivity({ courseId, routeType, activityId, onBack }) {
  const { message, show: showMessage } = useTransientMessage(2400)
  const context = findCourseActivity(courseId, activityId)
  const activity = context?.activity
  const expectedRouteType = activity ? getActivityRouteType(activity) : ''
  const invalid = !context || expectedRouteType !== routeType


  if (invalid) {
    return (
      <StudentPageContainer>
        <Card padding="lg" radius="xl">
          <MascotState
            title="Không tìm thấy nội dung học"
            message="Nội dung này không tồn tại hoặc chưa được thêm vào."
            actionLabel="Quay lại khóa học"
            onAction={onBack}
          />
        </Card>
      </StudentPageContainer>
    )
  }

  return (
    <LearningShell context={context} onBack={onBack}>
      {routeType === 'lessons' && <VideoScreen activity={activity} onAction={showMessage} />}
      {routeType === 'exercises' && (
        <QuestionTakingScreen activity={activity} mode="exercise" onBack={onBack} />
      )}
      {routeType === 'mini-tests' && (
        <QuestionTakingScreen activity={activity} mode="mini-test" onBack={onBack} />
      )}
      {routeType === 'mock-tests' && (
        <QuestionTakingScreen activity={activity} mode="mock-test" onBack={onBack} />
      )}
      <StudentToast message={message} />
    </LearningShell>
  )
}

export default LearningActivity
