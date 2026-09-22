import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'

interface StudentPageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Right-aligned actions (buttons); wraps under the title on small screens. */
  actions?: ReactNode
  className?: string
}

function StudentPageHeader({ title, description, actions, className }: StudentPageHeaderProps) {
  return (
    <header className={cn('mb-4 flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        <h1 className="mb-1 text-[26px] leading-[1.15] font-black text-text-heading max-[560px]:text-[22px]">
          {title}
        </h1>
        {description && (
          <p className="text-[13px] leading-[1.45] text-text-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </header>
  )
}

export default StudentPageHeader
