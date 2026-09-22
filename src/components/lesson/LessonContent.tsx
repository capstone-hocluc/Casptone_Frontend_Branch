import type { RefObject } from 'react'
import MascotState from '../common/MascotState'
import type { LessonDetail } from '../../services/lessonService'

interface LessonContentProps {
  lesson: LessonDetail
  videoRef: RefObject<HTMLVideoElement | null>
  onTimeUpdate: () => void
  onPause: () => void
}

const surface = 'overflow-hidden rounded-[14px] border border-line bg-surface'

function EmptyContent({ title, message }: { title: string; message: string }) {
  return (
    <div className={`${surface} flex min-h-[220px] items-center justify-center p-[30px]`}>
      <MascotState title={title} message={message} />
    </div>
  )
}

function LessonContent({ lesson, videoRef, onTimeUpdate, onPause }: LessonContentProps) {
  const hasAccess = lesson.owned || lesson.preview

  if (!hasAccess) {
    return (
      <EmptyContent
        title="Chưa thể xem bài học"
        message="Bạn chưa có quyền truy cập bài học này."
      />
    )
  }

  if (lesson.contentType === 'VIDEO') {
    if (!lesson.videoUrl) {
      return (
        <EmptyContent
          title="Video chưa sẵn sàng"
          message="Video của bài học này hiện chưa sẵn sàng."
        />
      )
    }
    return (
      <div className="overflow-hidden rounded-[14px] bg-[#0d1326]">
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          controls
          onTimeUpdate={onTimeUpdate}
          onPause={onPause}
          className="block max-h-[480px] w-full bg-black max-[640px]:max-h-[260px]"
        />
      </div>
    )
  }

  if (lesson.contentType === 'TEXT') {
    if (!lesson.content) {
      return (
        <EmptyContent
          title="Nội dung chưa sẵn sàng"
          message="Nội dung của bài học này hiện chưa sẵn sàng."
        />
      )
    }
    return (
      <div className={`${surface} flex flex-col gap-3.5 p-6 text-[14.5px] leading-[1.75] text-text-body`}>
        {lesson.content
          .split('\n')
          .map((paragraph, index) => (paragraph.trim() ? <p key={index}>{paragraph}</p> : null))}
      </div>
    )
  }

  return (
    <EmptyContent
      title="Chưa hỗ trợ loại nội dung này"
      message="Nội dung bài học này chưa được hỗ trợ."
    />
  )
}

export default LessonContent
