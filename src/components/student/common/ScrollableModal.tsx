import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

function ScrollableModal({ title, isOpen, onClose, children, maxWidth = 680 }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => dialogRef.current?.focus(), 0)

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="hl-scroll-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="hl-scroll-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hl-scroll-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        style={{ maxWidth }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="hl-scroll-modal-head">
          <h2 id="hl-scroll-modal-title">{title}</h2>
          <button type="button" aria-label="Đóng" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="hl-scroll-modal-body">{children}</div>
      </section>
    </div>
  )
}

export default ScrollableModal
