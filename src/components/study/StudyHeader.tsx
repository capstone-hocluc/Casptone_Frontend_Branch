import { ArrowLeft, BookOpen, CalendarDays, Play } from 'lucide-react'
import type { CourseStudy } from '../../services/courseService'
import { formatDate, prettifyEnum } from '../../lib/courseFormat'
import { findFirstLesson } from './studyUtils'

interface StudyHeaderProps {
  study: CourseStudy
  onBack: () => void
  onOpenLesson: (lessonId: string) => void
}

function StudyHeader({ study, onBack, onOpenLesson }: StudyHeaderProps) {
  const trackLabel = prettifyEnum(study.track || undefined)
  const startLabel = formatDate(study.startDate || undefined)
  const endLabel = formatDate(study.endDate || undefined)

  // Learning progress from the Study API - never the course-timeline
  // elapsedPercentage, which lives on the enrollment plan.
  const progress = Math.max(0, Math.min(100, study.progressPercentage ?? 0))
  const completed = study.completedLessons ?? 0
  const total = study.totalLessons ?? 0

  const hasContinueTarget = Boolean(study.continueLessonId)
  const fallbackLesson = hasContinueTarget ? null : findFirstLesson(study.phases)
  const targetLessonId = study.continueLessonId || fallbackLesson?.id

  return (
    <header className="hl-study-hero">
      <button type="button" className="hl-study-back" onClick={onBack}>
        <ArrowLeft size={17} />
        Khóa học của tôi
      </button>

      <div className="hl-study-hero-grid">
        <div className="hl-study-hero-main">
          {trackLabel && <span className="hl-study-badge">{trackLabel}</span>}
          <h1>{study.title}</h1>
          <div className="hl-study-hero-meta">
            {(startLabel || endLabel) && (
              <span>
                <CalendarDays size={16} />
                {startLabel}
                {endLabel ? ` – ${endLabel}` : ''}
              </span>
            )}
            <span>
              <BookOpen size={16} />
              {total} bài học
            </span>
          </div>
        </div>

        <div className="hl-study-hero-progress">
          <span className="hl-study-hero-progress-label">Tiến độ khóa học</span>
          <div className="hl-study-hero-progress-value">
            <small>
              {completed}/{total} bài học
            </small>
            <strong>{progress}%</strong>
          </div>
          <div className="hl-study-progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          {targetLessonId && (
            <button
              type="button"
              className="hl-study-primary-btn"
              onClick={() => onOpenLesson(targetLessonId)}
            >
              {hasContinueTarget ? 'Tiếp tục học' : 'Bắt đầu học'}
              <Play size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default StudyHeader
