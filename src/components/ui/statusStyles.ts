export const statusToneClasses = {
  success: {
    background: 'bg-badge-success-bg',
    text: 'text-badge-success-text',
    badge: 'bg-badge-success-bg text-badge-success-text',
  },
  warning: {
    background: 'bg-badge-warning-bg',
    text: 'text-badge-warning-text',
    badge: 'bg-badge-warning-bg text-badge-warning-text',
  },
  danger: {
    background: 'bg-badge-danger-bg',
    text: 'text-badge-danger-text',
    badge: 'bg-badge-danger-bg text-badge-danger-text',
  },
  info: {
    background: 'bg-badge-info-bg',
    text: 'text-badge-info-text',
    badge: 'bg-badge-info-bg text-badge-info-text',
  },
  neutral: {
    background: 'bg-badge-neutral-bg',
    text: 'text-badge-neutral-text',
    badge: 'bg-badge-neutral-bg text-badge-neutral-text',
  },
} as const

export type StatusTone = keyof typeof statusToneClasses
