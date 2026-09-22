import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { statusToneClasses } from './statusStyles'

export type { StatusTone } from './statusStyles'

const status = cva(
  'inline-flex w-fit items-center whitespace-nowrap rounded-[8px] px-2.5 py-1 text-sm font-medium',
  {
    variants: {
      tone: {
        success: statusToneClasses.success.badge,
        warning: statusToneClasses.warning.badge,
        danger: statusToneClasses.danger.badge,
        info: statusToneClasses.info.badge,
        neutral: statusToneClasses.neutral.badge,
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  }
)

export type StatusProps = ComponentProps<'span'> & VariantProps<typeof status>

function Status({ tone, className, children, ...props }: StatusProps) {
  return (
    <span {...props} className={cn(status({ tone }), className)}>
      {children}
    </span>
  )
}

export default Status
