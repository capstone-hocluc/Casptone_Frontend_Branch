import { Calendar, UserRound, Video } from 'lucide-react'
import type { CourseStudyLiveClass } from '../../services/courseService'
import { prettifyEnum } from '../../lib/courseFormat'

interface NextLiveClassCardProps {
  liveClass: CourseStudyLiveClass
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('vi-VN')
}

function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function NextLiveClassCard({ liveClass }: NextLiveClassCardProps) {
  const canJoin = liveClass.joinable && Boolean(liveClass.meetingUrl)
  const showRecording = !canJoin && Boolean(liveClass.recordingUrl)

  return (
    <div className="hl-study-card hl-study-live-card">
      <span className="hl-study-card-eyebrow">Buổi học trực tuyến tiếp theo</span>
      <h3>{liveClass.title}</h3>
      {liveClass.description && <p className="hl-study-live-desc">{liveClass.description}</p>}

      <div className="hl-study-live-meta">
        <span>
          <Calendar size={13} />
          {formatDateTime(liveClass.startTime)} – {formatTime(liveClass.endTime)}
        </span>
        {liveClass.instructorName && (
          <span>
            <UserRound size={13} />
            {liveClass.instructorName}
          </span>
        )}
        {liveClass.provider && (
          <span>
            <Video size={13} />
            {prettifyEnum(liveClass.provider)}
          </span>
        )}
        <span className="hl-study-live-status">{prettifyEnum(liveClass.status)}</span>
      </div>

      {(canJoin || showRecording) && (
        <div className="hl-study-live-actions">
          {canJoin && (
            <a
              className="hl-study-live-cta"
              href={liveClass.meetingUrl as string}
              target="_blank"
              rel="noreferrer"
            >
              Tham gia buổi học
            </a>
          )}
          {showRecording && (
            <a
              className="hl-study-live-cta is-secondary"
              href={liveClass.recordingUrl as string}
              target="_blank"
              rel="noreferrer"
            >
              Xem bản ghi
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default NextLiveClassCard
