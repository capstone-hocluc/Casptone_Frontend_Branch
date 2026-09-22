import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import Card from '../../ui/Card'
import StatusBadge from '../../ui/StatusBadge'

// The white bordered surface shared by every block of the activity screens.
export function ActivityCard({ as = 'article', className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      as={as}
      padding="none"
      radius="lg"
      className={cn(
        'border-line-card bg-white/95 p-4 shadow-[0_10px_24px_rgba(17,24,58,0.04)] max-[760px]:rounded-2xl max-[760px]:p-3.5',
        className
      )}
      {...props}
    />
  )
}

// Card title (h2) inside an ActivityCard.
export function ActivityCardTitle({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2 className={cn('mb-2.5 text-[17px] font-bold text-text-heading', className)} {...props} />
  )
}

interface ActivityHeaderProps {
  label: string
  title: ReactNode
  meta?: string
}

// Badge + title + meta line at the top of each activity.
export function ActivityHeader({ label, title, meta }: ActivityHeaderProps) {
  return (
    <ActivityCard as="header">
      <StatusBadge tone="primary" size="sm" className="px-[9px] py-[5px] font-extrabold">
        {label}
      </StatusBadge>
      <h1 className="mt-2.5 mb-1 text-[24px] leading-[1.2] font-extrabold text-text-heading max-[760px]:text-[21px]">
        {title}
      </h1>
      {meta && <p className="text-[12.5px] font-medium text-text-secondary">{meta}</p>}
    </ActivityCard>
  )
}
