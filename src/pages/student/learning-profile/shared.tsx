import { type ComponentType, type ReactNode, useEffect, useRef, useState } from 'react'
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react'

interface ProgressLineProps {
  value: number
  max?: number
}

export function ProgressLine({ value, max = 100 }: ProgressLineProps) {
  return (
    <div className="hl-profile-progress" aria-hidden="true">
      <span style={{ width: `${Math.min(100, Math.round((value / max) * 100))}%` }} />
    </div>
  )
}

interface TrendBadgeProps {
  value: number
  label?: ReactNode
}

export function TrendBadge({ value, label = 'so với tuần trước' }: TrendBadgeProps) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown

  return (
    <span className={`hl-profile-trend ${positive ? 'is-up' : 'is-down'}`}>
      <Icon size={14} />
      {positive ? '+' : ''}
      {value}% {label}
    </span>
  )
}

interface MetricCardProps {
  icon?: ComponentType<{ size?: number }>
  label: ReactNode
  value: ReactNode
  note?: ReactNode
}

export function MetricCard({ icon: Icon, label, value, note }: MetricCardProps) {
  return (
    <div className="hl-profile-metric-card">
      {Icon && <Icon size={18} />}
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  )
}

// Dashboard-style heading with an optional action button - distinct from the
// centered landing-page heading at components/common/SectionHeading.jsx.
interface ProfileSectionHeadingProps {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  onAction?: () => void
}

export function ProfileSectionHeading({ title, subtitle, action, onAction }: ProfileSectionHeadingProps) {
  return (
    <div className="hl-profile-section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && (
        <button type="button" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}

interface ComparisonOption {
  key: string
  label: ReactNode
}

interface ComparisonDropdownProps<T extends ComparisonOption> {
  options: T[]
  selected: T
  onChange: (option: T) => void
}

export function ComparisonDropdown<T extends ComparisonOption>({
  options,
  selected,
  onChange,
}: ComparisonDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false)
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', closeDropdown)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeDropdown)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <div className="hl-profile-comparison" ref={dropdownRef}>
      <span>So sánh với</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {selected.label}
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className="hl-profile-comparison-menu" role="listbox" aria-label="Chọn khoảng so sánh">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="option"
              aria-selected={selected.key === option.key}
              className={selected.key === option.key ? 'is-selected' : ''}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
