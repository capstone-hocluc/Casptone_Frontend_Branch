import type { ReactNode } from 'react'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'

interface ResultSummaryCardProps {
  eyebrow: string
  title: ReactNode
  correctCount: number
  totalQuestions: number
  percentage: number
  /** Extra rows under the score (placement stats, strengths...). */
  children?: ReactNode
}

// Headline of a result: kind of assessment, title, "x/y correct" and the percentage.
// Shared by the course-quiz review and the placement result.
function ResultSummaryCard({
  eyebrow,
  title,
  correctCount,
  totalQuestions,
  percentage,
  children,
}: ResultSummaryCardProps) {
  return (
    <Card as="section" padding="none" radius="lg" className="border-border-subtle p-[22px]">
      <StatusBadge
        tone="assessment"
        size="sm"
        className="mb-2.5 px-3 py-1 text-[11.5px] font-extrabold tracking-[0.04em] uppercase"
      >
        {eyebrow}
      </StatusBadge>
      <h1 className="mb-4 text-xl font-bold text-text-heading">{title}</h1>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-2">
          <strong className="text-[28px] leading-tight text-text-heading">
            {correctCount}/{totalQuestions}
          </strong>
          <span className="text-[13px] text-text-faint">câu đúng</span>
        </div>
        <div className="text-[28px] font-extrabold text-primary">{percentage}%</div>
      </div>
      {children}
    </Card>
  )
}

export default ResultSummaryCard
