interface MascotStateProps {
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

// Shared "nothing to show / something went wrong" state: owl mascot + title +
// hint (+ optional action). Styling comes from .hl-catalog-state.
function MascotState({ title, message, actionLabel, onAction, className }: MascotStateProps) {
  return (
    <div className={`hl-catalog-state${className ? ` ${className}` : ''}`}>
      <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
      <strong>{title}</strong>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default MascotState
