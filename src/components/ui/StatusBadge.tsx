import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

// Every staff table (invoice/payment/tuition/enrollment/fee...) renders the
// same "colored pill" for its own status vocabulary. Centralizing the 5
// tones here means each screen only has to map ITS OWN status strings to a
// tone, instead of re-declaring the whole badge markup + palette per screen.
// Tailwind utility classes only - no index.css rule, mirrors the reference
// CRM's Badge (tailgrids/core/badge.tsx).
const badge = cva(
  'inline-flex w-fit items-center whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium',
  {
    variants: {
      tone: {
        success: 'bg-badge-success-bg text-badge-success-text',
        warning: 'bg-badge-warning-bg text-badge-warning-text',
        danger: 'bg-badge-danger-bg text-badge-danger-text',
        info: 'bg-badge-info-bg text-badge-info-text',
        neutral: 'bg-badge-neutral-bg text-badge-neutral-text',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  }
)

type StatusBadgeProps = ComponentProps<'span'> & VariantProps<typeof badge>

function StatusBadge({ tone, className, children }: StatusBadgeProps) {
  return <span className={cn(badge({ tone }), className)}>{children}</span>
}

export default StatusBadge
