import { useState } from 'react'
import QuizAttemptHistory from '../../components/assessment/QuizAttemptHistory'
import BackLink from '../../components/student/common/BackLink'
import ResourceState from '../../components/student/common/ResourceState'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import StatusBadge from '../../components/ui/StatusBadge'
import { usePageResource } from '../../hooks/usePageResource'
import {
  getPlacementAttemptHistory,
  getPlacementTest,
  startPlacementAttempt,
} from '../../services/assessmentService'
import { getErrorMessage } from '../../lib/errors'
import { showErrorToast } from '../../lib/toastBus'

interface PlacementIntroPageProps {
  onStartAttempt: (attemptId: string) => void
  onOpenReview: (attemptId: string) => void
  onBack: () => void
}

function PlacementIntroPage({ onStartAttempt, onOpenReview, onBack }: PlacementIntroPageProps) {
  const { data, status, errorMessage, reload } = usePageResource(
    async () => {
      const [test, attempts] = await Promise.all([getPlacementTest(), getPlacementAttemptHistory()])
      return { test, attempts }
    },
    [],
    { forbidden: false, notFound: false }
  )
  const [starting, setStarting] = useState(false)

  const inProgressAttempt =
    data?.attempts.find((attempt) => attempt.status === 'IN_PROGRESS') || null

  // Always goes through the same start-or-resume endpoint - the backend
  // decides whether this creates a new attempt or resumes the in-progress
  // one (resumed flag), so there's no separate "continue" code path here.
  const handleStart = async () => {
    if (starting) return
    setStarting(true)
    try {
      const result = await startPlacementAttempt()
      onStartAttempt(result.attemptId)
    } catch (error) {
      showErrorToast(getErrorMessage(error))
    } finally {
      setStarting(false)
    }
  }

  return (
    <StudentPageContainer width="compact" spacing="stack">
      <ResourceState
        status={status}
        errorMessage={errorMessage}
        onRetry={reload}
        loading={<Skeleton className="h-[260px] rounded-2xl" />}
        error={{ title: 'Không thể tải bài kiểm tra đầu vào.' }}
      />

      {status === 'ready' && data && (
        <>
          <BackLink onClick={onBack}>Quay lại</BackLink>

          <Card
            as="section"
            padding="none"
            radius="lg"
            className="flex flex-col items-start border-border-subtle p-[22px]"
          >
            <StatusBadge
              tone="assessment"
              size="sm"
              className="mb-2.5 px-3 py-1 text-[11.5px] font-extrabold tracking-[0.04em] uppercase"
            >
              Kiểm tra đầu vào
            </StatusBadge>
            <h1 className="mb-2.5 text-xl font-bold text-text-heading">{data.test.title}</h1>
            {data.test.description && (
              <p className="mb-4 text-sm text-text-secondary">{data.test.description}</p>
            )}

            <div className="mb-3.5 flex flex-wrap gap-x-[18px] gap-y-2.5 text-[13px] text-text-faint">
              <span>{data.test.questions.length} câu hỏi</span>
              {data.test.durationMinutes > 0 && <span>{data.test.durationMinutes} phút</span>}
            </div>

            <Button
              shape="pill"
              className="h-[46px] px-[26px] text-sm font-extrabold"
              onClick={handleStart}
              disabled={starting}
            >
              {starting
                ? 'Đang chuẩn bị...'
                : inProgressAttempt
                  ? 'Tiếp tục làm bài'
                  : 'Bắt đầu làm bài'}
            </Button>
          </Card>

          <QuizAttemptHistory attempts={data.attempts} allowReview onOpenReview={onOpenReview} />
        </>
      )}
    </StudentPageContainer>
  )
}

export default PlacementIntroPage
