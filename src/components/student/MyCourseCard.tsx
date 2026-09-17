import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, CircleDot, Users } from 'lucide-react'
import type { MyCourseEnrollment } from '../../services/courseService'
import { formatDate, prettifyEnum } from '../../lib/courseFormat'

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

function MyCourseCard({ enrollment, onOpen }: MyCourseCardProps) {
  const { course } = enrollment
  const progress = Math.max(0, Math.min(100, enrollment.progressPercentage ?? 0))
  const status = getStatus(progress)
  const isCompleted = status === 'completed'
  const badgeLabel = course.targetExam || course.track || 'Khóa học'
  const enrolledAtLabel = formatDate(enrollment.enrolledAt)
  const enrollmentTypeLabel = prettifyEnum(enrollment.enrollmentType)

  return (
    <button type="button" className="hl-my-course-card" onClick={() => onOpen(course)}>
      <div className="hl-my-course-cover">
        <span>{badgeLabel}</span>
        <BookOpen size={34} />
      </div>

      <div className="hl-my-course-body">
        <div>
          <span className="hl-my-course-subject">{badgeLabel}</span>
          <h3>{course.title}</h3>
          <p>{course.description || 'Chưa có mô tả cho khóa học này.'}</p>
          {(enrolledAtLabel || enrollmentTypeLabel) && (
            <div className="hl-my-course-meta">
              <CalendarDays size={12} />
              {enrolledAtLabel && <span>Đăng ký: {enrolledAtLabel}</span>}
              {enrollmentTypeLabel && <span>{enrollmentTypeLabel}</span>}
            </div>
          )}
        </div>

        <div className="hl-my-course-progress">
          <div>
            <span>Tiến độ học tập</span>
            <strong>{progress}%</strong>
          </div>
          <div className="hl-my-course-progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div>
            <strong className={isCompleted ? 'is-completed' : ''}>
              {isCompleted ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}
              {statusLabels[status]}
            </strong>
            {enrollment.activeStudyGroupName && (
              <span>
                <Users size={13} />
                {enrollment.activeStudyGroupName}
              </span>
            )}
          </div>
        </div>

        <span className="hl-my-course-cta">
          Tiếp tục học
          <ArrowRight size={15} />
        </span>
      </div>
    </button>
  )
}

export default MyCourseCard
