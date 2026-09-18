import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import NextLiveClassCard from './NextLiveClassCard'
import LiveClassRow from './LiveClassRow'
import { getCourseLiveClasses, type CourseLiveClasses } from '../../services/courseService'
import { getErrorMessage } from '../../lib/errors'

interface StudyLiveClassesTabProps {
  courseId: string
}

function StudyLiveClassesTab({ courseId }: StudyLiveClassesTabProps) {
  const [data, setData] = useState<CourseLiveClasses | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getCourseLiveClasses(courseId)
      .then((result) => {
        if (cancelled) return
        setData(result)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [courseId, reloadKey])

  if (status === 'loading') {
    return (
      <div className="hl-study-grid">
        <div className="hl-study-skeleton" style={{ height: 160 }} />
        <div className="hl-study-skeleton" style={{ height: 220 }} />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="hl-study-state">
        <AlertTriangle size={30} />
        <p>{errorMessage || 'Không thể tải lịch học trực tuyến.'}</p>
        <button
          type="button"
          onClick={() => {
            setStatus('loading')
            setReloadKey((current) => current + 1)
          }}
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (!data) return null

  const hasAny = Boolean(data.next) || data.upcoming.length > 0 || data.past.length > 0

  if (!hasAny) {
    return (
      <div className="hl-study-state">
        <p>Khóa học này hiện chưa có lịch học trực tuyến.</p>
      </div>
    )
  }

  return (
    <div className="hl-study-grid">
      {data.next && <NextLiveClassCard liveClass={data.next} />}

      <section className="hl-study-card">
        <h2>Lịch sắp tới</h2>
        {data.upcoming.length > 0 ? (
          <div className="hl-live-class-list">
            {data.upcoming.map((item) => (
              <LiveClassRow key={item.id} liveClass={item} />
            ))}
          </div>
        ) : (
          <p className="hl-study-empty-curriculum">Chưa có buổi học nào sắp diễn ra.</p>
        )}
      </section>

      <section className="hl-study-card">
        <h2>Buổi học đã qua</h2>
        {data.past.length > 0 ? (
          <div className="hl-live-class-list">
            {data.past.map((item) => (
              <LiveClassRow key={item.id} liveClass={item} />
            ))}
          </div>
        ) : (
          <p className="hl-study-empty-curriculum">Chưa có buổi học nào đã diễn ra.</p>
        )}
      </section>
    </div>
  )
}

export default StudyLiveClassesTab
