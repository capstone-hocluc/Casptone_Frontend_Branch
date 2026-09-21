import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

// Inline banner: a short message (+ optional action) on a tinted background.
const notice = cva(
  'flex flex-wrap items-center gap-2.5 rounded-xl px-4 py-3 text-[13.5px] font-semibold',
  {
    variants: {
      tone: {
        danger: 'bg-badge-danger-bg text-danger',
        warning: 'bg-badge-warning-bg text-warning',
        info: 'bg-badge-info-bg text-badge-info-text',
      },
    },
    defaultVariants: { tone: 'info' },
  }
)

type NoticeProps = ComponentProps<'div'> & VariantProps<typeof notice>

function Notice({ tone, className, ...props }: NoticeProps) {
  return <div role="status" className={cn(notice({ tone }), className)} {...props} />
}

export default Notice
