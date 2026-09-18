import { Calendar, UserRound, Video } from 'lucide-react'
import type { CourseStudyLiveClass } from '../../services/courseService'
import { prettifyEnum } from '../../lib/courseFormat'

interface LiveClassRowProps {
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

// Compact row for upcoming/past lists (NextLiveClassCard is used for the
// highlighted "next" item). Join/recording rules are applied uniformly from
// backend fields alone - never gated by which list an item came from, since
// backend `joinable` is authoritative, not derived from time or category.
function LiveClassRow({ liveClass }: LiveClassRowProps) {
  const canJoin = liveClass.joinable && Boolean(liveClass.meetingUrl)
  const hasRecording = Boolean(liveClass.recordingUrl)

  return (
    <div className="hl-live-class-row">
      <div className="hl-live-class-row-main">
        <strong>{liveClass.title}</strong>
        <div className="hl-live-class-row-meta">
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
      </div>

      {(canJoin || hasRecording) && (
        <div className="hl-live-class-row-actions">
          {canJoin && (
            <a
              className="hl-study-live-cta"
              href={liveClass.meetingUrl as string}
              target="_blank"
              rel="noreferrer"
            >
              Tham gia
            </a>
          )}
          {hasRecording && (
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

export default LiveClassRow
