import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CurrentUserContext, type CurrentUserStatus } from '../../hooks/useCurrentUser'
import { getCurrentProfile, type UserProfile } from '../../services/userService'

function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<CurrentUserStatus>('idle')

  const loadCurrentUser = useCallback(async () => {
    setStatus('loading')
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
    }
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
