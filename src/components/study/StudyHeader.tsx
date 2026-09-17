import type { CourseStudy } from '../../services/courseService'
import { formatDate, prettifyEnum } from '../../lib/courseFormat'

interface StudyHeaderProps {
  study: CourseStudy
}

function StudyHeader({ study }: StudyHeaderProps) {
  const trackLabel = prettifyEnum(study.track || undefined)
  const startLabel = formatDate(study.startDate || undefined)
  const endLabel = formatDate(study.endDate || undefined)

  return (
    <div className="hl-study-header">
      {trackLabel && <span className="hl-study-header-badge">{trackLabel}</span>}
      <h1>{study.title}</h1>
      {(startLabel || endLabel) && (
        <span className="hl-study-header-dates">
          {startLabel}
          {endLabel ? ` – ${endLabel}` : ''}
        </span>
      )}
    </div>
  )
}

export default StudyHeader
