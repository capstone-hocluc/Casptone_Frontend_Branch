import { useEffect, useRef, useState } from 'react'

// Minimal surface of Google Identity Services' global we actually use.
interface GoogleIdCredentialResponse {
  credential: string
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string
    callback: (response: GoogleIdCredentialResponse) => void
  }) => void
  renderButton: (
    parent: HTMLElement,
    options: {
      type: 'standard'
      theme: 'outline'
      size: 'large'
      shape: 'pill'
      text: 'signin_with' | 'signup_with'
      width: number
    }
  ) => void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } }
  }
}

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
let gisScriptPromise: Promise<void> | null = null

// Loads Google's own sign-in script once, shared across every mount of this
// component (login screen, signup screen, etc.) instead of injecting it
// multiple times.
function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (gisScriptPromise) return gisScriptPromise

  gisScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Không thể tải Google Sign-In.')))
      return
    }
    const script = document.createElement('script')
    script.src = GIS_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Không thể tải Google Sign-In.'))
    document.head.appendChild(script)
  })
  return gisScriptPromise
}

interface GoogleSignInButtonProps {
  isSignup: boolean
  disabled: boolean
  onCredential: (idToken: string) => void
}

// Renders Google's own official button via Google Identity Services and
// forwards only the resulting ID token credential upward - this component
// never sees or handles a password, access token, or profile field itself.
function GoogleSignInButton({ isSignup, disabled, onCredential }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>(() =>
    clientId ? 'loading' : 'unavailable'
  )

  // Always call the latest onCredential without needing it in the effect's
  // dependency array - AuthPage recreates that function on every keystroke,
  // and re-initializing/re-rendering Google's button on every render would
  // be wasteful and could flicker.
  const onCredentialRef = useRef(onCredential)
  useEffect(() => {
    onCredentialRef.current = onCredential
  })

  useEffect(() => {
    if (!clientId) return

    let cancelled = false
    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredentialRef.current(response.credential),
        })
        containerRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: isSignup ? 'signup_with' : 'signin_with',
          width: 320,
        })
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [clientId, isSignup])

  if (status === 'unavailable') {
    return (
      <button type="button" className="hl-auth-google" disabled>
        <span className="hl-google-mark">G</span>
        <span>Đăng nhập với Google hiện chưa khả dụng</span>
      </button>
    )
  }

  return (
    <div
      className={`hl-auth-google-mount${disabled ? ' is-disabled' : ''}`}
      ref={containerRef}
      aria-busy={status === 'loading'}
    />
  )
}

export default GoogleSignInButton
