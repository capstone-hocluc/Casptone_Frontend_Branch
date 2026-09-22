import { cn } from '../../lib/cn'

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
    <div className="grid grid-cols-5 gap-2 rounded-[14px] border border-line bg-surface p-3 max-[640px]:grid-cols-6">
      {questions.map((question, index) => {
        const isCurrent = question.id === currentQuestionId
        const isAnswered = answeredQuestionIds.has(question.id)
        return (
          <button
            key={question.id}
            type="button"
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'grid aspect-square cursor-pointer place-items-center rounded-lg border text-[13px] font-bold disabled:cursor-not-allowed disabled:opacity-60',
              isCurrent
                ? 'border-primary bg-primary text-surface'
                : isAnswered
                  ? 'border-primary bg-badge-info-bg text-primary'
                  : 'border-border-primary bg-surface text-text-heading'
            )}
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
