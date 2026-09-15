import { createContext, useContext } from 'react'
import type { UserProfile } from '../services/userService'

export type CurrentUserStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface CurrentUserContextValue {
  profile: UserProfile | null
  status: CurrentUserStatus
  // Fetches the current authenticated user's profile and stores it here so
  // Header/Sidebar/Dashboard/Profile all read one shared value instead of
  // each issuing its own GET /users/profiles.
  loadCurrentUser: () => Promise<UserProfile>
  clearCurrentUser: () => void
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider')
  }
  return context
}
