import type { CourseStudy } from '../../services/courseService'

interface StudyProgressCardProps {
  study: CourseStudy
}

function StudyProgressCard({ study }: StudyProgressCardProps) {
  const progress = Math.max(0, Math.min(100, study.progressPercentage ?? 0))
  const completed = study.completedLessons ?? 0
  const total = study.totalLessons ?? 0

  return (
    <div className="hl-study-card hl-study-progress-card">
      <div className="hl-study-progress-head">
        <span>Tiến độ khóa học</span>
        <strong>{progress}%</strong>
      </div>
      <div className="hl-study-progress-bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className="hl-study-progress-count">
        {completed} / {total} bài học
      </span>
    </div>
  )
}

export default StudyProgressCard
