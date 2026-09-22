import type { ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { ActivityCard, ActivityCardTitle } from './ActivityCard'

// Number and action buttons inside the tracker share one look; `state` recolours them.
const trackerButton = cva(
  'min-h-[34px] cursor-pointer rounded-[10px] border text-[12px] font-bold',
  {
    variants: {
      state: {
        idle: 'border-line-card bg-surface-tint text-text-secondary',
        active: 'border-[#9db8ff] bg-[#eaf3ff] text-primary',
        answered: 'border-[#bde8d0] bg-[#f1fbf5] text-success',
        answeredActive: 'border-primary bg-primary text-surface',
        reviewCorrect: 'border-[#bde8d0] bg-[#f1fbf5] text-[#12834d]',
        reviewIncorrect: 'border-[#f2b6b6] bg-[#fff6f6] text-[#c93d3d]',
        reviewUnanswered: 'border-[#d9dee8] bg-[#f4f7fc] text-text-secondary',
      },
    },
    defaultVariants: { state: 'idle' },
  }
)

export type TrackerButtonState = NonNullable<Parameters<typeof trackerButton>[0]>['state']

const legendDot = {
  none: 'border-[#d9e4ff] bg-surface-tint',
  answered: 'border-success bg-success',
  correct: 'border-success bg-success',
  incorrect: 'border-[#e05252] bg-[#e05252]',
  unanswered: 'border-[#c7cedb] bg-[#c7cedb]',
}

interface QuestionTrackerProps {
  title: string
  stats: { label: string; value: ReactNode }[]
  numbers: { number: number; state: TrackerButtonState; onClick: () => void }[]
  legend: { label: string; dot?: keyof typeof legendDot }[]
  actionLabel: string
  onAction: () => void
}

// Sticky sidebar of a test: stats, question-number grid, legend and the main action.
function QuestionTracker({
  title,
  stats,
  numbers,
  legend,
  actionLabel,
  onAction,
}: QuestionTrackerProps) {
  return (
    <ActivityCard as="aside" className="sticky top-3.5 grid gap-3.5 self-start max-[760px]:static">
      <ActivityCardTitle className="mb-0">{title}</ActivityCardTitle>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <p
            key={stat.label}
            className="rounded-[14px] border border-line-card bg-surface-sky p-2.5"
          >
            <span className="block text-[11px] font-bold text-text-secondary">{stat.label}</span>
            <strong className="mt-1 block text-base font-extrabold text-text-heading">
              {stat.value}
            </strong>
          </p>
        ))}
      </div>
      <div className="grid max-h-[min(420px,52vh)] grid-cols-6 gap-[7px] overflow-y-auto">
        {numbers.map((item) => (
          <button
            key={item.number}
            type="button"
            className={trackerButton({ state: item.state })}
            onClick={item.onClick}
          >
            {item.number}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2.5 text-[11px] font-bold text-text-secondary">
        {legend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-[5px]">
            <i className={`size-2.5 rounded-full border ${legendDot[item.dot ?? 'none']}`} />{' '}
            {item.label}
          </span>
        ))}
      </div>
      <button type="button" className={trackerButton()} onClick={onAction}>
        {actionLabel}
      </button>
    </ActivityCard>
  )
}

export default QuestionTracker
