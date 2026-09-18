import { useEffect, useState } from 'react'
import { AlertTriangle, Star } from 'lucide-react'
import CourseCard from '../landing/CourseCard'
import {
  getCourseEnrollmentPlan,
  type Course,
  type EnrollmentPlan,
} from '../../services/courseService'
import { getErrorMessage } from '../../lib/errors'
import { prettifyEnum } from '../../lib/courseFormat'

interface StudyEnrollmentPlanTabProps {
  courseId: string
  onOpenCourse: (course: Course) => void
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('vi-VN')
}

function StudyEnrollmentPlanTab({ courseId, onOpenCourse }: StudyEnrollmentPlanTabProps) {
  const [plan, setPlan] = useState<EnrollmentPlan | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getCourseEnrollmentPlan(courseId)
      .then((data) => {
        if (cancelled) return
        setPlan(data)
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
  }, [courseId, reloadKey])

  if (status === 'loading') {
    return (
      <div className="hl-study-grid">
        <div className="hl-study-skeleton" style={{ height: 140 }} />
        <div className="hl-study-skeleton" style={{ height: 220 }} />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="hl-study-state">
        <AlertTriangle size={30} />
        <p>{errorMessage || 'Không thể tải lộ trình học.'}</p>
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
    )
  }

  if (!plan) return null

  const elapsed = Math.max(0, Math.min(100, plan.elapsedPercentage ?? 0))
  const sortedSections = [...plan.sectionOrder].sort((a, b) => a.sequence - b.sequence)
  const hasExtras =
    Boolean(plan.recommendedCourse) || plan.catchUpRecordings.length > 0 || sortedSections.length > 0

  return (
    <div className="hl-study-grid">
      <section className="hl-study-card">
        <span className="hl-study-card-eyebrow">{prettifyEnum(plan.branch)}</span>
        {plan.message && <p className="hl-study-live-desc">{plan.message}</p>}
        <div className="hl-plan-elapsed-row">
          {/* Course-timeline-elapsed, NOT lesson/learning progress - see StudyProgressCard for that. */}
          <span>Tiến trình thời gian khóa học</span>
          <strong>{elapsed}%</strong>
        </div>
        <div className="hl-study-progress-bar" aria-hidden="true">
          <span style={{ width: `${elapsed}%` }} />
        </div>
      </section>

      {plan.recommendedCourse && (
        <section className="hl-study-card">
          <h2>Khóa học đề xuất</h2>
          <div className="hl-catalog-grid hl-plan-recommended-grid">
            <CourseCard course={plan.recommendedCourse} onOpen={onOpenCourse} />
          </div>
        </section>
      )}

      {plan.catchUpRecordings.length > 0 && (
        <section className="hl-study-card">
          <h2>Buổi học cần xem lại</h2>
          <div className="hl-live-class-list">
            {plan.catchUpRecordings.map((item) => (
              <div className="hl-live-class-row" key={item.liveClassId}>
                <div className="hl-live-class-row-main">
                  <strong>{item.title}</strong>
                  <div className="hl-live-class-row-meta">
                    <span>{formatDateTime(item.startTime)}</span>
                  </div>
                </div>
                {item.recordingUrl && (
                  <div className="hl-live-class-row-actions">
                    <a
                      className="hl-study-live-cta is-secondary"
                      href={item.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Xem bản ghi
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {sortedSections.length > 0 && (
        <section className="hl-study-card">
          <h2>Lộ trình học đề xuất</h2>
          <div className="hl-plan-section-list">
            {sortedSections.map((item) => (
              <div className="hl-plan-section-row" key={item.sectionCourseId}>
                {item.priority && (
                  <span className="hl-plan-priority-badge">
                    <Star size={11} />
                    Ưu tiên
                  </span>
                )}
                <div>
                  <strong>{item.sectionCourseTitle}</strong>
                  <span className="hl-plan-section-meta">
                    {item.phaseName}
                    {item.categoryName ? ` · ${item.categoryName}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasExtras && (
        <p className="hl-study-empty-curriculum">Chưa có đề xuất bổ sung cho khóa học này.</p>
      )}
    </div>
  )
}

export default StudyEnrollmentPlanTab
