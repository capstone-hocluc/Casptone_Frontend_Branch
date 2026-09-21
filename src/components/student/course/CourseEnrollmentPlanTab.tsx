import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import MascotState from '../../common/MascotState'
import CourseCard from '../../landing/CourseCard'
import Button from '../../ui/Button'
import Card, { CardEyebrow, CardTitle } from '../../ui/Card'
import Progress from '../../ui/Progress'
import Skeleton from '../../ui/Skeleton'
import StatusBadge from '../../ui/StatusBadge'
import CourseListRow from './CourseListRow'
import {
  getCourseEnrollmentPlan,
  type Course,
  type EnrollmentPlan,
} from '../../../services/courseService'
import { getErrorMessage } from '../../../lib/errors'
import {
  formatDateTime,
  formatEnrollmentBranch,
  formatEnrollmentBranchMessage,
} from '../../../lib/courseFormat'

interface CourseEnrollmentPlanTabProps {
  courseId: string
  onOpenCourse: (course: Course) => void
}

function CourseEnrollmentPlanTab({ courseId, onOpenCourse }: CourseEnrollmentPlanTabProps) {
  const [plan, setPlan] = useState<EnrollmentPlan | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getCourseEnrollmentPlan(courseId)
      .then((data) => {
        if (cancelled) return
        setPlan(data)
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
        <Skeleton className="h-[140px]" />
        <Skeleton className="h-[220px]" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <MascotState
        title="Không thể tải lộ trình học"
        message={errorMessage}
        actionLabel="Thử lại"
        onAction={() => {
          setStatus('loading')
          setReloadKey((current) => current + 1)
        }}
      />
    )
  }

  if (!plan) return null

  const elapsed = Math.max(0, Math.min(100, plan.elapsedPercentage ?? 0))
  const planMessage = formatEnrollmentBranchMessage(plan.branch, plan.message)
  const sortedSections = [...plan.sectionOrder].sort((a, b) => a.sequence - b.sequence)
  const hasExtras =
    Boolean(plan.recommendedCourse) ||
    plan.catchUpRecordings.length > 0 ||
    sortedSections.length > 0

  return (
    <div className="flex flex-col gap-5">
      <Card as="section">
        <CardEyebrow>{formatEnrollmentBranch(plan.branch)}</CardEyebrow>
        {planMessage && <p className="mb-2.5 text-[13.5px] text-text-secondary">{planMessage}</p>}
        <div className="mt-3 mb-2 flex items-center justify-between text-[13px] text-text-secondary">
          {/* Course-timeline-elapsed, NOT lesson/learning progress. */}
          <span>Tiến trình thời gian khóa học</span>
          <strong className="font-semibold text-text-heading">{elapsed}%</strong>
        </div>
        <Progress value={elapsed} aria-label="Tiến trình thời gian khóa học" />
      </Card>

      {plan.recommendedCourse && (
        <Card as="section">
          <CardTitle>Khóa học đề xuất</CardTitle>
          <div className="grid grid-cols-[minmax(0,320px)]">
            <CourseCard course={plan.recommendedCourse} onOpen={onOpenCourse} />
          </div>
        </Card>
      )}

      {plan.catchUpRecordings.length > 0 && (
        <Card as="section">
          <CardTitle>Buổi học cần xem lại</CardTitle>
          <div className="flex flex-col">
            {plan.catchUpRecordings.map((item) => (
              <CourseListRow
                key={item.liveClassId}
                title={item.title}
                meta={<span className="text-[12.5px] text-text-secondary">{formatDateTime(item.startTime)}</span>}
                actions={
                  item.recordingUrl && (
                    <Button
                      asChild
                      size="sm"
                      appearance="outline"
                      className="h-8 px-3 text-[12.5px] font-semibold"
                    >
                      <a href={item.recordingUrl} target="_blank" rel="noreferrer">
                        Xem bản ghi
                      </a>
                    </Button>
                  )
                }
              />
            ))}
          </div>
        </Card>
      )}

      {sortedSections.length > 0 && (
        <Card as="section">
          <CardTitle>Lộ trình học đề xuất</CardTitle>
          <div className="flex flex-col">
            {sortedSections.map((item) => (
              <div
                className="flex items-center gap-3 border-t border-line-soft py-3 first:border-t-0"
                key={item.sectionCourseId}
              >
                {item.priority && (
                  <StatusBadge tone="live" size="sm" className="shrink-0 font-semibold">
                    <Star size={11} />
                    Ưu tiên
                  </StatusBadge>
                )}
                <div className="flex min-w-0 flex-col gap-[3px]">
                  <strong className="text-sm font-medium text-text-heading">
                    {item.sectionCourseTitle}
                  </strong>
                  <span className="text-[12.5px] text-text-secondary">
                    {item.phaseName}
                    {item.categoryName ? ` · ${item.categoryName}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!hasExtras && (
        <MascotState
          title="Chưa có đề xuất bổ sung"
          message="Chưa có đề xuất bổ sung cho khóa học này."
        />
      )}
    </div>
  )
}

export default CourseEnrollmentPlanTab
