import type { DropdownFieldProps, DropdownOption } from './DropdownField'
import DropdownField from './DropdownField'
import { cn } from '../../lib/cn'
import Status from './Status'
import { statusToneClasses, type StatusTone } from './statusStyles'

export type StatusDropdownTone = StatusTone

export interface StatusDropdownOption extends DropdownOption {
  tone?: StatusDropdownTone
}

export interface StatusDropdownProps extends Omit<
  DropdownFieldProps,
  'options' | 'renderValue' | 'renderOption'
> {
  options: readonly StatusDropdownOption[]
}

function StatusValue({
  option,
  appearance = 'text',
}: {
  option?: StatusDropdownOption
  appearance?: 'text' | 'chip'
}) {
  if (!option) return null

  if (appearance === 'chip') {
    return (
      <Status tone={option.tone ?? 'neutral'} className="px-2 py-1 text-xs">
        {option.label}
      </Status>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex min-w-0 truncate font-medium',
        statusToneClasses[option.tone ?? 'neutral'].text
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
  const selectedTone = statusToneClasses[selectedOption?.tone ?? 'neutral']

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
      renderOption={(option) => (
        <StatusValue option={option as StatusDropdownOption} appearance="chip" />
      )}
    />
  )
}

export default StatusDropdown
