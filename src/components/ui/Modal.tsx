import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

// Radix Dialog gives every modal in the app real accessibility for free
// (focus trap, ESC to close, click-outside to close, ARIA wiring) instead of
// each screen hand-rolling its own backdrop + close-button + focus handling.
// Styled with the existing .hl-staff-modal* classes so it looks identical to
// what was there before - only the behavior underneath changed.
interface ModalProps {
  open: boolean
  onClose?: () => void
  title?: ReactNode
  description?: ReactNode
  maxWidth?: number
  className?: string
  children?: ReactNode
}

function Modal({ open, onClose, title, description, maxWidth = 480, className = '', children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="hl-staff-modal-backdrop">
          <Dialog.Content
            className={`hl-staff-modal ${className}`}
            style={{ width: `min(${maxWidth}px, 100%)` }}
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <Dialog.Close className="hl-staff-modal-close" aria-label="Đóng">
              <X size={19} />
            </Dialog.Close>
            {title && (
              <Dialog.Title asChild>
                {/* asChild clones this exact element to inject aria props - must be a single
                    real element, never a Fragment, which only accepts key/children. */}
                {typeof title === 'string' ? <h2>{title}</h2> : <div>{title}</div>}
              </Dialog.Title>
            )}
            {description && (
              <Dialog.Description asChild>
                {typeof description === 'string' ? <p>{description}</p> : <div>{description}</div>}
              </Dialog.Description>
            )}
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
