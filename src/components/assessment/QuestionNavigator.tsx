interface QuestionNavigatorProps {
  questions: { id: string }[]
  currentQuestionId: string
  answeredQuestionIds: Set<string>
  disabled: boolean
  onSelect: (questionId: string) => void
}

function QuestionNavigator({
  questions,
  currentQuestionId,
  answeredQuestionIds,
  disabled,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <div className="hl-quiz-navigator">
      {questions.map((question, index) => {
        const isCurrent = question.id === currentQuestionId
        const isAnswered = answeredQuestionIds.has(question.id)
        return (
          <button
            key={question.id}
            type="button"
            className={`hl-quiz-nav-item${isCurrent ? ' is-current' : ''}${isAnswered ? ' is-answered' : ''}`}
            onClick={() => onSelect(question.id)}
            disabled={disabled}
          >
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}

export default QuestionNavigator
