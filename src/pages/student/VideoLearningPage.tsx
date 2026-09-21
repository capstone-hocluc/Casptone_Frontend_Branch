import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Expand,
  Lock,
  Pause,
  Play,
  Send,
  Volume2,
  X,
} from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { dashboardSummary } from '../../data/studentDashboard'
import {
  findCourseActivity,
  getActivityRouteType,
  getAdjacentUnlockedActivities,
  getCourseActivityContexts,
} from '../../data/courseLookup'

const quickActions = ['Tóm tắt bài học', 'Giải thích dễ hiểu', 'Cho ví dụ', 'Gợi ý làm bài']

function formatDuration(duration = '18 phút') {
  const minutes = Number.parseInt(String(duration).match(/\d+/)?.[0] || '', 10) || 18
  return `${String(minutes).padStart(2, '0')}:00`
}

function statusIcon(status) {
  if (status === 'completed') return <CheckCircle2 size={14} />
  if (status === 'locked') return <Lock size={14} />
  if (status === 'in-progress') return <Play size={14} />
  return <Circle size={14} />
}

function getMockAiResponse(prompt, lessonTitle) {
  if (prompt.includes('Tóm tắt')) {
    return `Bài học "${lessonTitle}" tập trung vào cách nhận diện ý chính, lọc thông tin quan trọng và tránh các chi tiết gây nhiễu khi làm bài ĐGNL.`
  }
  if (prompt.includes('Giải thích')) {
    return 'Bạn có thể hiểu đơn giản là: trước khi chọn đáp án, hãy xác định câu hỏi đang cần ý chính, chi tiết hay suy luận từ văn bản.'
  }
  if (prompt.includes('ví dụ')) {
    return 'Ví dụ: nếu đoạn văn lặp lại nhiều lần một quan điểm, đó thường là tín hiệu cho ý chính thay vì một chi tiết phụ.'
  }
  if (prompt.includes('Gợi ý')) {
    return 'Hãy đọc câu hỏi trước, gạch ý chính từng đoạn, sau đó loại đáp án quá hẹp hoặc quá xa nội dung văn bản.'
  }
  return 'Mình đã ghi nhận câu hỏi của bạn. Với bản mock frontend này, mình sẽ gợi ý ngắn gọn: hãy tập trung vào mục tiêu chính của bài và thử áp dụng ngay vào câu hỏi luyện tập.'
}

function LearningHeader({ course, onBack }) {
  const { profile } = useCurrentUser()
  const displayName =
    profile?.displayName ||
    [profile?.lastName, profile?.firstName].filter(Boolean).join(' ') ||
    dashboardSummary.studentName

  return (
    <header className="hl-video-learn-header">
      <div>
        <button type="button" aria-label="Quay lại khóa học" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <span className="hl-video-logo">
          <img src="/logo.png" alt="HocLuc.com" />
          <b>
            HocLuc<span>.com</span>
          </b>
        </span>
        <span />
        <strong>{course.title}</strong>
      </div>
      <img
        src={profile?.avatarUrl || dashboardSummary.avatar || '/avatar-minhanh.jpg'}
        alt={displayName}
      />
    </header>
  )
}

function LessonNavBar({
  context,
  previous,
  next,
  onOpenDrawer,
  onCourses,
  onNavigateActivity,
  onComplete,
}) {
  return (
    <div className="hl-video-lesson-nav">
      <button type="button" className="hl-video-list-button" onClick={onOpenDrawer}>
        <ClipboardList size={17} />
        Danh sách bài học
      </button>
      <div className="hl-video-breadcrumb">
        <button type="button" onClick={onCourses}>
          Khóa học của tôi
        </button>
        <ChevronRight size={13} />
        <span>{context.course.title}</span>
        <ChevronRight size={13} />
        <span>{context.subjectTitle}</span>
        <ChevronRight size={13} />
        <span>{context.chapterTitle}</span>
        <ChevronRight size={13} />
        <strong>{context.activity.title}</strong>
      </div>
      <div className="hl-video-nav-actions">
        <button
          type="button"
          disabled={!previous}
          onClick={() => previous && onNavigateActivity(previous.activity)}
        >
          <ChevronLeft size={16} />
          Bài trước
        </button>
        <button
          type="button"
          onClick={() => (next ? onNavigateActivity(next.activity) : onComplete())}
        >
          {next ? 'Bài tiếp' : 'Hoàn thành'}
          {next && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  )
}

function CourseLessonDrawer({ open, context, lessons, onClose, onAction, onNavigateActivity }) {
  const grouped = useMemo(() => {
    const groups = new Map()
    lessons.forEach((item) => {
      const key = item.chapterTitle || 'Nội dung học'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(item)
    })
    return Array.from(groups.entries())
  }, [lessons])

  if (!open) return null

  return (
    <div className="hl-video-drawer-layer">
      <button
        type="button"
        className="hl-video-drawer-scrim"
        aria-label="Đóng danh sách bài học"
        onClick={onClose}
      />
      <aside className="hl-video-drawer">
        <div className="hl-video-drawer-head">
          <h2>Nội dung khóa học</h2>
          <button type="button" aria-label="Đóng danh sách bài học" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="hl-video-drawer-list">
          {grouped.map(([chapterTitle, items]) => (
            <section key={chapterTitle}>
              <strong>{chapterTitle}</strong>
              {items.map((item) => {
                const isCurrent = item.activity.id === context.activity.id
                const locked = item.activity.status === 'locked'
                return (
                  <button
                    key={item.activity.id}
                    type="button"
                    className={`${isCurrent ? 'is-current' : ''} ${locked ? 'is-locked' : ''}`}
                    onClick={() => {
                      if (locked) {
                        onAction('Bạn cần hoàn thành nội dung trước đó để mở khóa.')
                        return
                      }
                      if (onNavigateActivity(item.activity)) onClose()
                    }}
                  >
                    {statusIcon(item.activity.status)}
                    <span>
                      {item.activity.type} · {item.activity.title}
                    </span>
                  </button>
                )
              })}
            </section>
          ))}
        </div>
      </aside>
    </div>
  )
}

function VideoPlayerMock({ activity }) {
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const playerRef = useRef(null)

  const toggleFullscreen = () => {
    if (playerRef.current?.requestFullscreen) {
      playerRef.current.requestFullscreen()
      return
    }
    setExpanded((current) => !current)
  }

  return (
    <div ref={playerRef} className={`hl-video-player ${expanded ? 'is-expanded' : ''}`}>
      <div className="hl-video-player-label">
        <span>
          {activity.type === 'Buổi giải đề' ? 'Buổi giải đề' : 'Video'} · {activity.title}
        </span>
      </div>
      <button
        type="button"
        className="hl-video-play-big"
        aria-label={playing ? 'Tạm dừng video' : 'Phát video'}
        onClick={() => setPlaying((current) => !current)}
      >
        {playing ? <Pause size={42} /> : <Play size={46} />}
      </button>
      <div className="hl-video-controls">
        <button
          type="button"
          aria-label={playing ? 'Tạm dừng' : 'Phát'}
          onClick={() => setPlaying((current) => !current)}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <span>
          {playing ? '03:24' : '00:00'} / {formatDuration(activity.duration)}
        </span>
        <div>
          <i style={{ width: playing ? '22%' : '0%' }} />
        </div>
        <Volume2 size={17} />
        <button type="button" aria-label="Phóng to video" onClick={toggleFullscreen}>
          <Expand size={17} />
        </button>
      </div>
    </div>
  )
}

function TeacherAIButton({ state, onToggle }) {
  if (state !== 'closed') return null

  return (
    <button
      type="button"
      className="hl-video-ai-button"
      aria-label="Mở Teacher AI"
      onClick={onToggle}
    >
      <img src="/owl-support-headset.png" alt="" aria-hidden="true" />
    </button>
  )
}

function TeacherAIPanel({
  state,
  lessonTitle,
  messages,
  input,
  onInput,
  onClose,
  onSend,
  onQuickAction,
}) {
  if (state === 'closed') return null

  return (
    <aside className="hl-video-ai-panel is-chat">
      <div className="hl-video-ai-chat-head">
        <img src="/owl-support-headset.png" alt="" aria-hidden="true" />
        <div>
          <strong>Trợ lý AI HocLuc</strong>
          <span>
            <i /> Đang hoạt động
          </span>
          <small>Đang hỗ trợ: {lessonTitle}</small>
        </div>
        <button type="button" aria-label="Đóng Teacher AI" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="hl-video-ai-messages">
        {messages.map((message) => (
          <p key={message.id} className={`is-${message.role}`}>
            {message.text}
          </p>
        ))}
      </div>
      <div className="hl-video-ai-quick">
        {quickActions.map((action) => (
          <button key={action} type="button" onClick={() => onQuickAction(action)}>
            {action}
          </button>
        ))}
      </div>
      <form className="hl-video-ai-input" onSubmit={onSend}>
        <input
          value={input}
          onChange={(event) => onInput(event.target.value)}
          placeholder="Hỏi trợ lý AI..."
        />
        <button type="submit" aria-label="Gửi câu hỏi">
          <Send size={16} />
        </button>
      </form>
    </aside>
  )
}

function VideoLearningPage({ courseId, activityId, onBackCourse, onCourses, onNavigateActivity }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [teacherAIState, setTeacherAIState] = useState('closed')
  const [message, setMessage] = useState('')
  const [input, setInput] = useState('')
  const context = findCourseActivity(courseId, activityId)
  const lessons = getCourseActivityContexts(courseId)
  const adjacent = getAdjacentUnlockedActivities(courseId, activityId)
  const [messages, setMessages] = useState([])

  const showMessage = (text) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2400)
  }

  useEffect(() => {
    const closeFloating = (event) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
        setTeacherAIState('closed')
      }
    }
    window.addEventListener('keydown', closeFloating)
    return () => window.removeEventListener('keydown', closeFloating)
  }, [])

  useEffect(() => {
    if (!context) return
    setMessages([
      {
        id: 'ai-initial',
        role: 'ai',
        text: `Chào bạn! Mình đang hỗ trợ bài "${context.activity.title}". Bạn muốn mình giải thích phần nào?`,
      },
    ])
  }, [context?.activity.id])

  const navigateActivity = (activity) => {
    const routeType = getActivityRouteType(activity)
    if (!routeType) {
      showMessage('Nội dung này đang được phát triển.')
      return false
    }
    onNavigateActivity(courseId, routeType, activity.id)
    return true
  }

  const sendMessage = (event, forcedText) => {
    event?.preventDefault()
    const text = (forcedText || input).trim()
    if (!text || !context) return

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', text },
      { id: `ai-${Date.now()}`, role: 'ai', text: getMockAiResponse(text, context.activity.title) },
    ])
    setInput('')
  }

  if (!context || !['Video', 'Buổi giải đề'].includes(context.activity.type)) {
    return (
      <section className="hl-video-learning-page">
        <article className="hl-video-invalid">
          <h1>Không tìm thấy video bài học</h1>
          <p>Nội dung này không tồn tại hoặc chưa được thêm vào.</p>
          <button type="button" onClick={onBackCourse}>
            <ArrowLeft size={16} />
            Quay lại khóa học
          </button>
        </article>
      </section>
    )
  }

  return (
    <section className="hl-video-learning-page">
      <LearningHeader course={context.course} onBack={onBackCourse} />
      <LessonNavBar
        context={context}
        previous={adjacent.previous}
        next={adjacent.next}
        onOpenDrawer={() => setDrawerOpen(true)}
        onCourses={onCourses}
        onNavigateActivity={navigateActivity}
        onComplete={() => showMessage('Tiến độ bài học đã được cập nhật mô phỏng.')}
      />
      <main className={`hl-video-stage ${teacherAIState !== 'closed' ? 'is-ai-open' : ''}`}>
        <VideoPlayerMock activity={context.activity} />
        <TeacherAIButton state={teacherAIState} onToggle={() => setTeacherAIState('chat')} />
        <TeacherAIPanel
          state={teacherAIState}
          lessonTitle={context.activity.title}
          messages={messages}
          input={input}
          onInput={setInput}
          onClose={() => setTeacherAIState('closed')}
          onSend={sendMessage}
          onQuickAction={(action) => sendMessage(null, action)}
        />
      </main>
      <CourseLessonDrawer
        open={drawerOpen}
        context={context}
        lessons={lessons}
        onClose={() => setDrawerOpen(false)}
        onAction={showMessage}
        onNavigateActivity={navigateActivity}
      />
      {message && <div className="hl-student-toast">{message}</div>}
    </section>
  )
}

export default VideoLearningPage
