import QuizReviewQuestionCard from '../../components/assessment/QuizReviewQuestionCard'
import BackLink from '../../components/student/common/BackLink'
import ResourceState from '../../components/student/common/ResourceState'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Card, { CardTitle } from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import { usePageResource } from '../../hooks/usePageResource'
import { getAttemptReview } from '../../services/assessmentService'
import { bySequence } from '../../lib/sequence'

interface PlacementReviewPageProps {
  attemptId: string
  onBack: () => void
}

// The placement test definition has no showAnswers-style flag (unlike a
// course quiz), so unlike QuizReviewPage this never gates the per-question
// breakdown behind a lookup - it's always shown once the review loads.
function PlacementReviewPage({ attemptId, onBack }: PlacementReviewPageProps) {
  const {
    data: review,
    status,
    errorMessage,
    reload,
  } = usePageResource(() => getAttemptReview(attemptId), [attemptId], { forbidden: false })

  return (
    <StudentPageContainer width="reading" spacing="stack">
      <ResourceState
        status={status}
        errorMessage={errorMessage}
        onRetry={reload}
        loading={
          <>
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </>
        }
        notFound={{
          title: 'Không tìm thấy kết quả bài làm.',
          actionLabel: 'Quay lại',
          onAction: onBack,
        }}
        error={{ title: 'Không thể tải kết quả bài làm.' }}
      />

      {status === 'ready' && review && (
        <>
          <BackLink onClick={onBack}>Quay lại kết quả</BackLink>

          <Card as="section" padding="none" radius="lg" className="border-border-subtle p-[22px]">
            <CardTitle className="mb-3.5 text-base">Xem lại đáp án</CardTitle>
            <div className="flex flex-col gap-3.5">
              {bySequence(review.questions).map((question, index) => (
                <QuizReviewQuestionCard
                  key={question.questionId}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          </Card>
        </>
      )}
    </StudentPageContainer>
  )
}

export default PlacementReviewPage
