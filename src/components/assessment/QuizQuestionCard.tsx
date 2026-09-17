import type { QuizQuestion } from '../../services/assessmentService'

interface QuizQuestionCardProps {
  question: QuizQuestion
  index: number
  total: number
  selectedOptionId: string | null
  saving: boolean
  saveFailed: boolean
  disabled: boolean
  onSelectOption: (optionId: string) => void
}

function QuizQuestionCard({
  question,
  index,
  total,
  selectedOptionId,
  saving,
  saveFailed,
  disabled,
  onSelectOption,
}: QuizQuestionCardProps) {
  const sortedOptions = [...question.options].sort((a, b) => a.sequence - b.sequence)

  return (
    <div className="hl-quiz-question-card">
      <div className="hl-quiz-question-head">
        <span className="hl-quiz-question-count">
          Câu {index + 1}/{total}
        </span>
        {saving && <span className="hl-quiz-save-state is-saving">Đang lưu...</span>}
        {!saving && saveFailed && (
          <span className="hl-quiz-save-state is-failed">Lưu chưa thành công, thử chọn lại</span>
        )}
        {!saving && !saveFailed && selectedOptionId && (
          <span className="hl-quiz-save-state is-saved">Đã lưu</span>
        )}
      </div>

      {question.imageUrl && (
        <img className="hl-quiz-question-image" src={question.imageUrl} alt="" />
      )}

      <p className="hl-quiz-question-text">{question.questionText}</p>

      {question.questionType === 'SINGLE_CHOICE' ? (
        <div className="hl-quiz-options" role="radiogroup">
          {sortedOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selectedOptionId === option.id}
              className={`hl-quiz-option${selectedOptionId === option.id ? ' is-selected' : ''}`}
              onClick={() => onSelectOption(option.id)}
              disabled={disabled}
            >
              <span className="hl-quiz-option-radio" aria-hidden="true" />
              {option.optionText}
            </button>
          ))}
        </div>
      ) : (
        <p className="hl-quiz-unsupported">Loại câu hỏi này chưa được hỗ trợ.</p>
      )}
    </div>
  )
}

export default QuizQuestionCard
