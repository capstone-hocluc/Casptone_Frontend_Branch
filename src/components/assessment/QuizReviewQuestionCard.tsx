import { CheckCircle2, XCircle } from 'lucide-react'
import type { QuizReviewQuestion } from '../../services/assessmentService'

interface QuizReviewQuestionCardProps {
  question: QuizReviewQuestion
  index: number
}

// Only ever rendered when the caller has already confirmed showAnswers is
// true - this component always reveals correctness, by design.
function QuizReviewQuestionCard({ question, index }: QuizReviewQuestionCardProps) {
  const sortedOptions = [...question.options].sort((a, b) => a.sequence - b.sequence)

  return (
    <div
      className={`hl-quiz-review-card${
        !question.answered ? ' is-unanswered' : question.correct ? ' is-correct' : ' is-incorrect'
      }`}
    >
      <div className="hl-quiz-review-head">
        <span className="hl-quiz-review-index">Câu {index + 1}</span>
        {question.categoryName && (
          <span className="hl-quiz-review-category">{question.categoryName}</span>
        )}
        {!question.answered ? (
          <span className="hl-quiz-review-tag is-unanswered">Chưa trả lời</span>
        ) : question.correct ? (
          <span className="hl-quiz-review-tag is-correct">
            <CheckCircle2 size={13} />
            Đúng
          </span>
        ) : (
          <span className="hl-quiz-review-tag is-incorrect">
            <XCircle size={13} />
            Sai
          </span>
        )}
      </div>

      {question.imageUrl && <img className="hl-quiz-review-image" src={question.imageUrl} alt="" />}

      <p className="hl-quiz-review-text">{question.questionText}</p>

      <div className="hl-quiz-review-options">
        {sortedOptions.map((option) => {
          const isSelected = option.optionId === question.selectedOptionId
          return (
            <div
              key={option.optionId}
              className={`hl-quiz-review-option${option.correct ? ' is-correct' : ''}${
                isSelected && !option.correct ? ' is-selected-wrong' : ''
              }${isSelected && option.correct ? ' is-selected-correct' : ''}`}
            >
              <span>{option.optionText}</span>
              {option.correct && <CheckCircle2 size={14} />}
              {isSelected && !option.correct && <XCircle size={14} />}
            </div>
          )
        })}
      </div>

      {question.explanation && (
        <div className="hl-quiz-review-explanation">
          <strong>Giải thích</strong>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default QuizReviewQuestionCard
