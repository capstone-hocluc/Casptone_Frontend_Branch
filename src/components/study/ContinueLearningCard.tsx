import { ArrowRight } from 'lucide-react'
import type { CourseStudy } from '../../services/courseService'
import { findFirstLesson } from './studyUtils'

interface ContinueLearningCardProps {
  study: CourseStudy
  onOpenLesson: (lessonId: string) => void
}

function ContinueLearningCard({ study, onOpenLesson }: ContinueLearningCardProps) {
  const hasContinueTarget = Boolean(study.continueLessonId)
  const fallbackLesson = hasContinueTarget ? null : findFirstLesson(study.phases)
  const lessonId = study.continueLessonId || fallbackLesson?.id
  const lessonTitle = study.continueLessonTitle || fallbackLesson?.title

  if (!lessonId) return null

  return (
    <div className="hl-study-card hl-study-continue-card">
      <div>
        <span className="hl-study-card-eyebrow">
          {hasContinueTarget ? 'Tiếp tục học' : 'Bắt đầu học'}
        </span>
        <h2>{lessonTitle || 'Bài học'}</h2>
      </div>
      <button type="button" onClick={() => onOpenLesson(lessonId)}>
        {hasContinueTarget ? 'Tiếp tục bài học' : 'Bắt đầu học'}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

export default ContinueLearningCard
