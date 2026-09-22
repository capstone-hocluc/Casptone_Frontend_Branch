import { useState } from 'react'
import QuizResultSummary from '../../components/assessment/QuizResultSummary'
import QuizReviewQuestionCard from '../../components/assessment/QuizReviewQuestionCard'
import BackLink from '../../components/student/common/BackLink'
import ResourceState from '../../components/student/common/ResourceState'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Card, { CardTitle } from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import { usePageResource } from '../../hooks/usePageResource'
import { getAttemptReview, getQuiz } from '../../services/assessmentService'
import { bySequence } from '../../lib/sequence'

interface QuizReviewPageProps {
  attemptId: string
  onBackToQuiz: (quizId: string) => void
}

function QuizReviewPage({ attemptId, onBackToQuiz }: QuizReviewPageProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const {
    data: review,
    status,
    errorMessage,
    reload,
  } = usePageResource(() => getAttemptReview(attemptId), [attemptId], {
    // showAnswers isn't part of the review contract - the only way to
    // know it is to look at the quiz's own setting. Fails closed: if
    // this lookup fails, per-question answers stay hidden.
    onLoaded: (data) => {
      getQuiz(data.quizId)
        .then((quiz) => setShowAnswers(Boolean(quiz.showAnswers)))
        .catch(() => {})
    },
  })

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
        forbidden={{ title: 'Bạn chưa có quyền xem kết quả bài kiểm tra này.' }}
        notFound={{ title: 'Không tìm thấy kết quả bài kiểm tra.' }}
        error={{ title: 'Không thể tải kết quả bài kiểm tra.' }}
      />

      {status === 'ready' && review && (
        <>
          <BackLink onClick={() => onBackToQuiz(review.quizId)}>Quay lại bài kiểm tra</BackLink>

          <QuizResultSummary review={review} />

          {showAnswers && (
            <Card as="section" padding="none" radius="lg" className="border-border-subtle p-[22px]">
              <CardTitle className="mb-3.5 text-base">Chi tiết bài làm</CardTitle>
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
          )}
        </>
      )}
    </StudentPageContainer>
  )
}

export default QuizReviewPage
