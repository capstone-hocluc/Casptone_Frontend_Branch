import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../lib/api'
import { getErrorMessage } from '../lib/errors'

export type ResourceStatus = 'loading' | 'ready' | 'error' | 'forbidden' | 'not-found'

interface Options<T> {
  /** Called with the loaded data right before status becomes 'ready' (e.g. to hydrate local state). */
  onLoaded?: (data: T) => void
  /** Map HTTP 403 / 404 to their own statuses instead of a generic 'error'. Both default to true. */
  forbidden?: boolean
  notFound?: boolean
}

// Loading / ready / error / forbidden / not-found for one page-level request.
// Owns the cancelled-flag effect and the retry counter that every Student page
// used to copy by hand. `load` runs again when `deps` change or `reload()` is called.
export function usePageResource<T>(
  load: () => Promise<T>,
  deps: readonly unknown[],
  { onLoaded, forbidden = true, notFound = true }: Options<T> = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<ResourceStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    load()
      .then((result) => {
        if (cancelled) return
        onLoaded?.(result)
        setData(result)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        if (forbidden && error instanceof ApiError && error.status === 403) {
          setStatus('forbidden')
          return
        }
        if (notFound && error instanceof ApiError && error.status === 404) {
          setStatus('not-found')
          return
        }
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey])

  const reload = useCallback(() => {
    setStatus('loading')
    setReloadKey((current) => current + 1)
  }, [])

  return { data, setData, status, errorMessage, reload }
}
