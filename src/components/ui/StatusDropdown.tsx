import type { DropdownFieldProps, DropdownOption } from './DropdownField'
import DropdownField from './DropdownField'
import { cn } from '../../lib/cn'

export type StatusDropdownTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface StatusDropdownOption extends DropdownOption {
  tone?: StatusDropdownTone
}

export interface StatusDropdownProps
  extends Omit<DropdownFieldProps, 'options' | 'renderValue' | 'renderOption'> {
  options: readonly StatusDropdownOption[]
}

const toneClasses: Record<StatusDropdownTone, { text: string; dot: string }> = {
  success: { text: 'text-badge-success-text', dot: 'bg-badge-success-text' },
  warning: { text: 'text-badge-warning-text', dot: 'bg-badge-warning-text' },
  danger: { text: 'text-badge-danger-text', dot: 'bg-badge-danger-text' },
  info: { text: 'text-badge-info-text', dot: 'bg-badge-info-text' },
  neutral: { text: 'text-badge-neutral-text', dot: 'bg-badge-neutral-text' },
}

function StatusValue({ option }: { option?: StatusDropdownOption }) {
  if (!option) return null

  const tone = toneClasses[option.tone ?? 'neutral']
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2 truncate font-medium', tone.text)}>
      <span className={cn('size-2 shrink-0 rounded-full', tone.dot)} aria-hidden="true" />
      <span className="truncate">{option.label}</span>
    </span>
  )
}

function StatusDropdown({ options, triggerClassName, optionClassName, ...props }: StatusDropdownProps) {
  return (
    <DropdownField
      {...props}
      options={options}
      triggerClassName={cn(
        'rounded-[8px] border-border-subtle bg-surface px-3 text-sm font-medium',
        triggerClassName,
      )}
      optionClassName={cn('rounded-[7px]', optionClassName)}
      renderValue={(option) => <StatusValue option={option as StatusDropdownOption | undefined} />}
      renderOption={(option) => <StatusValue option={option as StatusDropdownOption} />}
    />
  )
}

export default StatusDropdown
