import type { RefObject } from 'react'
import { Lock } from 'lucide-react'
import type { LessonDetail } from '../../services/lessonService'

interface LessonContentProps {
  lesson: LessonDetail
  videoRef: RefObject<HTMLVideoElement | null>
  onTimeUpdate: () => void
  onPause: () => void
}

function LessonContent({ lesson, videoRef, onTimeUpdate, onPause }: LessonContentProps) {
  const hasAccess = lesson.owned || lesson.preview

  if (!hasAccess) {
    return (
      <div className="hl-lesson-content hl-lesson-content-locked">
        <Lock size={28} />
        <p>Bạn chưa có quyền truy cập bài học này.</p>
      </div>
    )
  }

  if (lesson.contentType === 'VIDEO') {
    if (!lesson.videoUrl) {
      return (
        <div className="hl-lesson-content hl-lesson-content-empty">
          <p>Video của bài học này hiện chưa sẵn sàng.</p>
        </div>
      )
    }
    return (
      <div className="hl-lesson-content hl-lesson-content-video">
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          controls
          onTimeUpdate={onTimeUpdate}
          onPause={onPause}
        />
      </div>
    )
  }

  if (lesson.contentType === 'TEXT') {
    if (!lesson.content) {
      return (
        <div className="hl-lesson-content hl-lesson-content-empty">
          <p>Nội dung của bài học này hiện chưa sẵn sàng.</p>
        </div>
      )
    }
    return (
      <div className="hl-lesson-content hl-lesson-content-text">
        {lesson.content.split('\n').map((paragraph, index) =>
          paragraph.trim() ? <p key={index}>{paragraph}</p> : null
        )}
      </div>
    )
  }

  return (
    <div className="hl-lesson-content hl-lesson-content-empty">
      <p>Nội dung bài học này chưa được hỗ trợ.</p>
    </div>
  )
}

export default LessonContent
