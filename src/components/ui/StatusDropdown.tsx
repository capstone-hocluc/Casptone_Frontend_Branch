import type { DropdownFieldProps, DropdownOption } from './DropdownField'
import DropdownField from './DropdownField'
import { cn } from '../../lib/cn'

export type StatusDropdownTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface StatusDropdownOption extends DropdownOption {
  tone?: StatusDropdownTone
}

export interface StatusDropdownProps extends Omit<
  DropdownFieldProps,
  'options' | 'renderValue' | 'renderOption'
> {
  options: readonly StatusDropdownOption[]
}

const toneClasses: Record<StatusDropdownTone, { text: string; background: string }> = {
  success: { text: 'text-badge-success-text', background: 'bg-badge-success-bg' },
  warning: { text: 'text-badge-warning-text', background: 'bg-badge-warning-bg' },
  danger: { text: 'text-badge-danger-text', background: 'bg-badge-danger-bg' },
  info: { text: 'text-badge-info-text', background: 'bg-badge-info-bg' },
  neutral: { text: 'text-badge-neutral-text', background: 'bg-badge-neutral-bg' },
}

function StatusValue({ option }: { option?: StatusDropdownOption }) {
  if (!option) return null

  return (
    <span
      className={cn(
        'inline-flex min-w-0 truncate font-medium',
        toneClasses[option.tone ?? 'neutral'].text
      )}
    >
      {option.label}
    </span>
  )
}

function StatusDropdown({
  options,
  triggerClassName,
  optionClassName,
  ...props
}: StatusDropdownProps) {
  const selectedOption = options.find((option) => option.id === (props.value ?? null))
  const selectedTone = toneClasses[selectedOption?.tone ?? 'neutral']

  return (
    <DropdownField
      {...props}
      options={options}
      triggerClassName={cn(
        'rounded-[8px] border-0 px-3 text-sm font-medium focus-visible:border-0',
        selectedTone.background,
        selectedTone.text,
        triggerClassName
      )}
      optionClassName={cn('rounded-[7px]', optionClassName)}
      renderValue={(option) => <StatusValue option={option as StatusDropdownOption | undefined} />}
      renderOption={(option) => <StatusValue option={option as StatusDropdownOption} />}
    />
  )
}

export default StatusDropdown
