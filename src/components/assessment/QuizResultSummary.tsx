import type { QuizReview } from '../../services/assessmentService'

interface QuizResultSummaryProps {
  review: QuizReview
}

function QuizResultSummary({ review }: QuizResultSummaryProps) {
  return (
    <div className="hl-quiz-card hl-quiz-result-summary">
      <span className="hl-quiz-card-eyebrow">Kết quả bài kiểm tra</span>
      <h1>{review.quizTitle}</h1>
      <div className="hl-quiz-result-row">
        <div className="hl-quiz-result-score">
          <strong>
            {review.correctCount}/{review.totalQuestions}
          </strong>
          <span>câu đúng</span>
        </div>
        <div className="hl-quiz-result-percentage">{review.overallPercentage}%</div>
      </div>
    </div>
  )
}

export default QuizResultSummary
