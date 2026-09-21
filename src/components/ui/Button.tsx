import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

// Same variant x appearance x size cva structure as the reference CRM's
// Button (tailgrids/core/button.tsx) - flat colors, no gradient/heavy
// shadow. Tailwind utility classes only - no index.css rule.
const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg border border-transparent font-medium whitespace-nowrap transition-colors [&>svg]:shrink-0 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  {
    variants: {
      variant: {
        primary: '',
        danger: '',
        success: '',
      },
      appearance: {
        fill: '',
        outline: 'bg-surface',
        ghost: 'bg-transparent',
      },
      size: {
        sm: 'h-8.5 gap-1.5 px-3 text-sm [&>svg]:size-4',
        md: 'h-10 px-4 text-sm [&>svg]:size-[17px]',
        lg: 'h-11 px-4 text-[13px] font-black rounded-xl [&>svg]:size-[15px]',
      },
      shape: {
        default: '',
        pill: 'rounded-full',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        appearance: 'fill',
        className: 'bg-primary text-surface hover:bg-primary-dark',
      },
      {
        variant: 'primary',
        appearance: 'outline',
        className: 'border-border-primary text-primary hover:bg-surface-hover',
      },
      {
        variant: 'primary',
        appearance: 'ghost',
        className: 'text-primary hover:bg-surface-hover',
      },
      {
        variant: 'danger',
        appearance: 'fill',
        className: 'bg-danger text-surface hover:bg-badge-danger-text',
      },
      {
        variant: 'danger',
        appearance: 'outline',
        className: 'border-danger text-danger hover:bg-badge-danger-bg',
      },
      {
        variant: 'danger',
        appearance: 'ghost',
        className: 'text-danger hover:bg-badge-danger-bg',
      },
      {
        variant: 'success',
        appearance: 'fill',
        className: 'bg-success text-surface hover:bg-badge-success-text',
      },
      {
        variant: 'success',
        appearance: 'outline',
        className: 'border-success text-success hover:bg-badge-success-bg',
      },
      {
        variant: 'success',
        appearance: 'ghost',
        className: 'text-success hover:bg-badge-success-bg',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      appearance: 'fill',
      size: 'md',
      shape: 'default',
    },
  }
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof button> & {
    /** Render the child element (e.g. an <a>) with the button styles instead of a <button>. */
    asChild?: boolean
  }

function Button({
  variant,
  appearance,
  size,
  shape,
  className,
  type = 'button',
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      {...(asChild ? {} : { type })}
      className={cn(button({ variant, appearance, size, shape }), className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export default Button
