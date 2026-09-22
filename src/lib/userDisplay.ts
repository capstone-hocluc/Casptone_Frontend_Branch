import type { UserProfile } from '../services/userService'

// Name shown for the signed-in user: the backend's displayName, else
// "last first", else the e-mail. Empty when no profile is loaded - callers
// decide what to render then (skeleton / generic avatar), never a fake name.
export function getUserDisplayName(profile: UserProfile | null) {
  if (!profile) return ''
  return (
    profile.displayName ||
    [profile.lastName, profile.firstName].filter(Boolean).join(' ') ||
    profile.email ||
    ''
  )
}

export function getUserInitials(profile: UserProfile | null) {
  const name = getUserDisplayName(profile).trim()
  if (!name) return ''
  const parts = name.split(/\s+/)
  return (
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)
  ).toUpperCase()
}
