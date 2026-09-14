import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

// The "row of 4 stat tiles" at the top of Payment/Tuition/Attendance
// summaries - same markup, only the numbers differ. Deliberately neutral
// (no per-status color coding / colored border accent) to keep the white,
// low-color dashboard tone - the number + label already say what it is.
// Tailwind utility classes only - no index.css rule.
interface StatCardProps {
  label: ReactNode
  value: ReactNode
  className?: string
}

function StatCard({ label, value, className }: StatCardProps) {
  return (
    <span
      className={cn(
        'block rounded-[10px] border border-border-subtle bg-surface p-3.5 text-sm font-semibold text-text-muted',
        className
      )}
    >
      <b className="mb-1 block text-2xl text-text-strong">{value}</b>
      {label}
    </span>
  )
}

export default StatCard
