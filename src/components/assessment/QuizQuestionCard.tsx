import type { QuizQuestion } from '../../services/assessmentService'
import { bySequence } from '../../lib/sequence'
import { cn } from '../../lib/cn'
import Card from '../ui/Card'
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup'

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
  const saveState = saving
    ? { text: 'Đang lưu...', className: 'text-text-faint' }
    : saveFailed
      ? { text: 'Lưu chưa thành công, thử chọn lại', className: 'text-danger' }
      : selectedOptionId
        ? { text: 'Đã lưu', className: 'text-badge-success-text' }
        : null

  return (
    <Card padding="none" radius="lg" className="border-border-subtle p-[22px]">
      <div className="mb-3 flex items-center justify-between text-[12.5px]">
        <span className="font-extrabold tracking-[0.03em] text-assess uppercase">
          Câu {index + 1}/{total}
        </span>
        {saveState && (
          <span className={cn('font-semibold', saveState.className)}>{saveState.text}</span>
        )}
      </div>

      {question.imageUrl && (
        <img className="mb-3.5 max-w-full rounded-xl" src={question.imageUrl} alt="" />
      )}

      <p className="mb-[18px] text-base leading-[1.6] text-text-heading">{question.questionText}</p>

      {question.questionType === 'SINGLE_CHOICE' ? (
        <RadioGroup
          value={selectedOptionId ?? ''}
          onValueChange={onSelectOption}
          disabled={disabled}
        >
          {bySequence(question.options).map((option) => (
            <RadioGroupItem key={option.id} value={option.id}>
              {option.optionText}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      ) : (
        <p className="text-[13.5px] text-text-faint">Loại câu hỏi này chưa được hỗ trợ.</p>
      )}
    </Card>
  )
}

export default QuizQuestionCard
