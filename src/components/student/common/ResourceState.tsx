import type { ReactNode } from 'react'
import MascotState from '../../common/MascotState'
import type { ResourceStatus } from '../../../hooks/usePageResource'

interface StateCopy {
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

interface ResourceStateProps {
  status: ResourceStatus
  errorMessage?: string
  /** Skeleton shown while loading. */
  loading: ReactNode
  forbidden?: StateCopy
  notFound?: StateCopy
  error: { title: string }
  onRetry: () => void
}

// Renders the non-ready states of a usePageResource() request; renders
// nothing once the resource is ready so the page can render its own content.
function ResourceState({
  status,
  errorMessage,
  loading,
  forbidden,
  notFound,
  error,
  onRetry,
}: ResourceStateProps) {
  if (status === 'loading') return <>{loading}</>
  if (status === 'forbidden' && forbidden) return <MascotState {...forbidden} />
  if (status === 'not-found' && notFound) return <MascotState {...notFound} />
  if (status === 'error' || status === 'forbidden' || status === 'not-found')
    return (
      <MascotState
        title={error.title}
        message={errorMessage}
        actionLabel="Thử lại"
        onAction={onRetry}
      />
    )
  return null
}

export default ResourceState
