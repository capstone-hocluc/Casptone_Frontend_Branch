import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, CircleDot, Users } from 'lucide-react'
import type { MyCourseEnrollment } from '../../services/courseService'
import {
  formatDate,
  formatEnrollmentType,
  formatExamLabel,
  prettifyEnum,
} from '../../lib/courseFormat'

const statusLabels = {
  'not-started': 'Chưa bắt đầu',
  'in-progress': 'Đang học',
  completed: 'Hoàn thành',
}

function getStatus(progress: number) {
  if (progress >= 100) return 'completed'
  if (progress > 0) return 'in-progress'
  return 'not-started'
}

interface MyCourseCardProps {
  enrollment: MyCourseEnrollment
  onOpen: (course: MyCourseEnrollment['course']) => void
}

// Same card shell as the public course catalog (hl-catalog-*), with learning
// progress in place of the price.
function MyCourseCard({ enrollment, onOpen }: MyCourseCardProps) {
  const { course } = enrollment
  const progress = Math.max(0, Math.min(100, enrollment.progressPercentage ?? 0))
  const status = getStatus(progress)
  const isCompleted = status === 'completed'
  const badgeLabel = formatExamLabel(course.targetExam) || prettifyEnum(course.track) || 'Khóa học'
  const enrolledAtLabel = formatDate(enrollment.enrolledAt)
  const enrollmentTypeLabel = formatEnrollmentType(enrollment.enrollmentType)

  return (
    <button type="button" className="hl-catalog-card" onClick={() => onOpen(course)}>
      <div className="hl-catalog-cover">
        <span className="hl-catalog-cover-badge">{badgeLabel}</span>
        <BookOpen size={34} />
      </div>

      <div className="hl-catalog-body">
        <div>
          <div className="hl-catalog-tags">
            <span className="hl-catalog-subject">{badgeLabel}</span>
          </div>
          <h3>{course.title}</h3>
          <p>{course.description || 'Chưa có mô tả cho khóa học này.'}</p>
        </div>

        {(enrolledAtLabel || enrollmentTypeLabel || enrollment.activeStudyGroupName) && (
          <div className="hl-catalog-meta">
            {enrolledAtLabel && (
              <span>
                <CalendarDays size={12} />
                Đăng ký: {enrolledAtLabel}
              </span>
            )}
            {enrollmentTypeLabel && <span>{enrollmentTypeLabel}</span>}
            {enrollment.activeStudyGroupName && (
              <span>
                <Users size={12} />
                {enrollment.activeStudyGroupName}
              </span>
            )}
          </div>
        )}

        <div className="hl-catalog-progress">
          <div>
            <span>Tiến độ học tập</span>
            <strong>{progress}%</strong>
          </div>
          <div className="hl-catalog-progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="hl-catalog-footer">
          <span className={`hl-catalog-status${isCompleted ? ' is-completed' : ''}`}>
            {isCompleted ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}
            {statusLabels[status]}
          </span>
          <span className="hl-catalog-cta">
            Tiếp tục học
            <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </button>
  )
}

export default MyCourseCard
