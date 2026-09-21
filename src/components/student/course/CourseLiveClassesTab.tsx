import { useEffect, useState } from 'react'
import MascotState from '../../common/MascotState'
import Card, { CardTitle } from '../../ui/Card'
import Skeleton from '../../ui/Skeleton'
import NextLiveClassCard from './NextLiveClassCard'
import LiveClassRow from './LiveClassRow'
import { getCourseLiveClasses, type CourseLiveClasses } from '../../../services/courseService'
import { getErrorMessage } from '../../../lib/errors'

interface CourseLiveClassesTabProps {
  courseId: string
}

function LiveClassSection({
  title,
  items,
  emptyText,
}: {
  title: string
  items: CourseLiveClasses['upcoming']
  emptyText: string
}) {
  return (
    <Card as="section">
      <CardTitle>{title}</CardTitle>
      {items.length > 0 ? (
        <div className="flex flex-col">
          {items.map((item) => (
            <LiveClassRow key={item.id} liveClass={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">{emptyText}</p>
      )}
    </Card>
  )
}

function CourseLiveClassesTab({ courseId }: CourseLiveClassesTabProps) {
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
      <div className="flex flex-col gap-5">
        <Skeleton className="h-40" />
        <Skeleton className="h-[220px]" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <MascotState
        title="Không thể tải lịch học trực tuyến"
        message={errorMessage}
        actionLabel="Thử lại"
        onAction={() => {
          setStatus('loading')
          setReloadKey((current) => current + 1)
        }}
      />
    )
  }

  if (!data) return null

  const hasAny = Boolean(data.next) || data.upcoming.length > 0 || data.past.length > 0

  if (!hasAny) {
    return (
      <MascotState
        title="Chưa có lịch học trực tuyến"
        message="Khóa học này hiện chưa có buổi học trực tuyến nào."
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {data.next && <NextLiveClassCard liveClass={data.next} />}
      <LiveClassSection
        title="Lịch sắp tới"
        items={data.upcoming}
        emptyText="Chưa có buổi học nào sắp diễn ra."
      />
      <LiveClassSection
        title="Buổi học đã qua"
        items={data.past}
        emptyText="Chưa có buổi học nào đã diễn ra."
      />
    </div>
  )
}

export default CourseLiveClassesTab
