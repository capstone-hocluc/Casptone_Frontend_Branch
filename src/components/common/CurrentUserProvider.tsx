import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { CurrentUserContext, type CurrentUserStatus } from '../../hooks/useCurrentUser'
import { getCurrentProfile, type UserProfile } from '../../services/userService'

function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<CurrentUserStatus>('idle')

  // Single-flight: concurrent callers (e.g. React StrictMode's double effect
  // or two components hydrating at once) share one GET /users/profiles.
  const inFlight = useRef<Promise<UserProfile> | null>(null)

  const loadCurrentUser = useCallback(() => {
    if (inFlight.current) return inFlight.current
    setStatus('loading')
    const request = (async () => {
      try {
        const response = await getCurrentProfile()
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Không thể tải thông tin người dùng.')
        }
        setProfile(response.data)
        setStatus('ready')
        return response.data
      } catch (error) {
        setStatus('error')
        throw error
      } finally {
        inFlight.current = null
      }
    })()
    inFlight.current = request
    return request
  }, [])

  const clearCurrentUser = useCallback(() => {
    setProfile(null)
    setStatus('idle')
  }, [])

  const value = useMemo(
    () => ({ profile, status, loadCurrentUser, clearCurrentUser }),
    [profile, status, loadCurrentUser, clearCurrentUser]
  )

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}

export default CurrentUserProvider
