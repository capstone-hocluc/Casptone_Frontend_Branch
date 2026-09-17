import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Lock,
  SearchX,
} from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import LessonContent from '../../components/lesson/LessonContent'
import LessonQuizzes from '../../components/lesson/LessonQuizzes'
import {
  getLesson,
  updateLessonProgress,
  type LessonDetail,
} from '../../services/lessonService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'
import { showErrorToast, showSuccessToast } from '../../lib/toastBus'
import { formatDuration, prettifyEnum } from '../../lib/courseFormat'
import { getLessonStatusLabel, getLessonStatusTone } from '../../lib/lessonStatus'

interface LessonPageProps {
  courseId: string | null
  lessonId: string
  onBackToStudy: () => void
  onNavigateLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function LessonPage({
  lessonId,
  onBackToStudy,
  onNavigateLesson,
  onOpenQuiz,
}: LessonPageProps) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'forbidden' | 'not-found'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [completing, setCompleting] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const watchSecondsRef = useRef(0)
  const savingRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    getLesson(lessonId)
      .then((data) => {
        if (cancelled) return
        watchSecondsRef.current = Math.max(0, data.progress?.watchDurationSeconds ?? 0)
        setLesson(data)
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
  }, [lessonId, reloadKey])

  const clampWatchSeconds = () => {
    let seconds = Math.max(0, Math.floor(watchSecondsRef.current))
    if (lesson?.durationSeconds && lesson.durationSeconds > 0) {
      seconds = Math.min(seconds, lesson.durationSeconds)
    }
    return seconds
  }

  // Fire-and-forget checkpoint save (video pause, leaving the lesson). Never
  // sent on every timeupdate tick - only at these controlled moments.
  const saveProgress = async (completed: boolean) => {
    if (!lesson || !lesson.owned || savingRef.current) return null
    savingRef.current = true
    try {
      const updated = await updateLessonProgress(lesson.id, {
        completed,
        watchDurationSeconds: clampWatchSeconds(),
      })
      setLesson((prev) => (prev ? { ...prev, progress: updated } : prev))
      return updated
    } catch (error) {
      showErrorToast(getErrorMessage(error))
      return null
    } finally {
      savingRef.current = false
    }
  }

  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime ?? 0
    watchSecondsRef.current = Math.max(watchSecondsRef.current, Math.floor(current))
  }

  const handlePause = () => {
    void saveProgress(false)
  }

  const handleMarkComplete = async () => {
    if (completing) return
    setCompleting(true)
    const updated = await saveProgress(true)
    setCompleting(false)
    if (updated) showSuccessToast('Đã đánh dấu hoàn thành bài học.')
  }

  const goToLesson = (targetLessonId: string) => {
    void saveProgress(false)
    onNavigateLesson(targetLessonId)
  }

  const goBackToStudy = () => {
    void saveProgress(false)
    onBackToStudy()
  }

  const isCompleted = lesson?.progress?.status === 'COMPLETED'
  const canMarkComplete = Boolean(lesson?.owned) && !isCompleted

  return (
    <div className="hl-lesson-page">
      <Navbar />
      <main className="hl-lesson-main-wrap">
        <div className="hl-lesson-container">
          {status === 'loading' && (
            <div className="hl-lesson-grid">
              <div className="hl-lesson-skeleton" style={{ height: 24, width: 260 }} />
              <div className="hl-lesson-skeleton" style={{ height: 360 }} />
              <div className="hl-lesson-skeleton" style={{ height: 120 }} />
            </div>
          )}

          {status === 'forbidden' && (
            <div className="hl-lesson-state">
              <Lock size={30} />
              <p>Bạn chưa có quyền truy cập bài học này.</p>
              <button type="button" onClick={onBackToStudy}>
                Quay lại khóa học
              </button>
            </div>
          )}

          {status === 'not-found' && (
            <div className="hl-lesson-state">
              <SearchX size={30} />
              <p>Không tìm thấy bài học.</p>
              <button type="button" onClick={onBackToStudy}>
                Quay lại khóa học
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="hl-lesson-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải bài học.'}</p>
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

          {status === 'ready' && lesson && (
            <div className="hl-lesson-grid">
              <nav className="hl-lesson-breadcrumb" aria-label="Breadcrumb">
                <button type="button" onClick={goBackToStudy}>
                  <ArrowLeft size={15} />
                  Khóa học
                </button>
                {lesson.sectionCourseTitle && (
                  <>
                    <ChevronRight size={13} />
                    <span>{lesson.sectionCourseTitle}</span>
                  </>
                )}
                {lesson.chapterTitle && (
                  <>
                    <ChevronRight size={13} />
                    <span>{lesson.chapterTitle}</span>
                  </>
                )}
                <ChevronRight size={13} />
                <span className="is-current">{lesson.title}</span>
              </nav>

              <LessonContent
                lesson={lesson}
                videoRef={videoRef}
                onTimeUpdate={handleTimeUpdate}
                onPause={handlePause}
              />

              <section className="hl-lesson-card">
                <div className="hl-lesson-info-head">
                  <div>
                    <h1>{lesson.title}</h1>
                    <span className="hl-lesson-meta-line">
                      {prettifyEnum(lesson.contentType)}
                      {Boolean(lesson.durationSeconds) &&
                        ` · ${formatDuration(lesson.durationSeconds)}`}
                    </span>
                  </div>
                  <span className={`hl-lesson-status is-${getLessonStatusTone(lesson.progress?.status || 'NOT_STARTED')}`}>
                    {getLessonStatusLabel(lesson.progress?.status || 'NOT_STARTED')}
                  </span>
                </div>

                {lesson.description && <p className="hl-lesson-description">{lesson.description}</p>}

                <div className="hl-lesson-progress-row">
                  <div className="hl-lesson-progress-bar" aria-hidden="true">
                    <span
                      style={{
                        width: `${Math.max(0, Math.min(100, lesson.progress?.progressPercentage ?? 0))}%`,
                      }}
                    />
                  </div>
                  <span>Tiến độ bài học: {Math.max(0, Math.min(100, lesson.progress?.progressPercentage ?? 0))}%</span>
                </div>

                {lesson.progress?.chapterCompleted && (
                  <span className="hl-lesson-chapter-done">
                    <CheckCircle2 size={14} />
                    Chương đã hoàn thành
                  </span>
                )}

                <div className="hl-lesson-actions">
                  {isCompleted ? (
                    <span className="hl-lesson-completed-tag">
                      <CheckCircle2 size={15} />
                      Đã hoàn thành
                    </span>
                  ) : (
                    canMarkComplete && (
                      <button
                        type="button"
                        className="hl-lesson-complete-cta"
                        onClick={handleMarkComplete}
                        disabled={completing}
                      >
                        {completing ? 'Đang lưu...' : 'Đánh dấu hoàn thành'}
                      </button>
                    )
                  )}
                </div>
              </section>

              <LessonQuizzes quizzes={lesson.quizzes} onOpenQuiz={onOpenQuiz} />

              <div className="hl-lesson-nav-footer">
                <button
                  type="button"
                  className="hl-lesson-nav-btn"
                  disabled={!lesson.previousLessonId}
                  onClick={() => lesson.previousLessonId && goToLesson(lesson.previousLessonId)}
                >
                  <ArrowLeft size={16} />
                  Bài trước
                </button>
                <button
                  type="button"
                  className="hl-lesson-nav-btn is-primary"
                  disabled={!lesson.nextLessonId}
                  onClick={() => lesson.nextLessonId && goToLesson(lesson.nextLessonId)}
                >
                  Bài tiếp theo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default LessonPage
