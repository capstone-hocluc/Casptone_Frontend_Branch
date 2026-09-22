import type { QuizReview } from '../../services/assessmentService'
import ResultSummaryCard from './ResultSummaryCard'

interface QuizResultSummaryProps {
  review: QuizReview
}

function QuizResultSummary({ review }: QuizResultSummaryProps) {
  return (
    <ResultSummaryCard
      eyebrow="Kết quả bài kiểm tra"
      title={review.quizTitle}
      correctCount={review.correctCount}
      totalQuestions={review.totalQuestions}
      percentage={review.overallPercentage}
    />
  )
}

export default QuizResultSummary
