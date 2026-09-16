import type { CourseDetail } from '../../services/courseService'
import { formatDate, formatExamLabel, prettifyEnum } from '../../lib/courseFormat'

interface CourseDetailHeroProps {
  course: CourseDetail
}

function CourseDetailHero({ course }: CourseDetailHeroProps) {
  const examLabel = formatExamLabel(course.targetExam)
  const trackLabel = prettifyEnum(course.track)
  const startLabel = formatDate(course.startDate)
  const endLabel = formatDate(course.endDate)
  const examSessionLabel = formatDate(course.examSessionDate)

  return (
    <div className="hl-cd-hero">
      <div className="hl-cd-hero-badges">
        {examLabel && <span className="hl-cd-badge is-exam">{examLabel}</span>}
        {trackLabel && <span className="hl-cd-badge is-track">{trackLabel}</span>}
      </div>

      <h1 className="hl-cd-title">{course.title}</h1>

      {course.shortIntroduction && <p className="hl-cd-intro">{course.shortIntroduction}</p>}

      {(startLabel || examSessionLabel) && (
        <div className="hl-cd-dates">
          {startLabel && (
            <span>
              Khai giảng: <strong>{startLabel}</strong>
              {endLabel ? ` – ${endLabel}` : ''}
            </span>
          )}
          {examSessionLabel && (
            <span>
              Ngày thi: <strong>{examSessionLabel}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseDetailHero
