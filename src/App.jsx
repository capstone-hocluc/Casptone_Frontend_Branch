import { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import AuthPage from './components/AuthPage'
import StudentOnboarding from './components/StudentOnboarding'

function App() {
  const getAuthMode = () => {
    const path = window.location.pathname.replace(/\/$/, '')
    if (path === '/onboarding') return 'onboarding'
    if (path === '/verify-email') return 'verify-email'
    if (path === '/forgot-password') return 'forgot-password'
    if (path === '/reset-password') return 'reset-password'
    return path === '/signup' ? 'signup' : path === '/login' ? 'login' : null
  }
  const [authMode, setAuthMode] = useState(getAuthMode)

  useEffect(() => {
    const openAuth = (event) => {
      const mode = event.detail?.mode || 'login'
      window.history.pushState({}, '', `/${mode}`)
      setAuthMode(mode)
    }
    const syncPath = () => setAuthMode(getAuthMode())
    window.addEventListener('open-auth', openAuth)
    window.addEventListener('popstate', syncPath)
    return () => {
      window.removeEventListener('open-auth', openAuth)
      window.removeEventListener('popstate', syncPath)
    }
  }, [])

  const navigateAuth = (mode) => {
    window.history.pushState({}, '', `/${mode}`)
    setAuthMode(mode)
  }
  const backToLanding = () => {
    window.history.pushState({}, '', '/')
    setAuthMode(null)
  }
  const goToOnboarding = () => {
    window.history.pushState({}, '', '/onboarding')
    setAuthMode('onboarding')
  }
  const goToEmailVerification = () => {
    window.history.pushState({}, '', '/verify-email')
    setAuthMode('verify-email')
  }

  if (authMode === 'onboarding') return <StudentOnboarding onBack={backToLanding} />
  return authMode ? <AuthPage mode={authMode} onModeChange={navigateAuth} onContinue={authMode === 'signup' ? goToEmailVerification : goToOnboarding} onBack={backToLanding} /> : <LandingPage />
}

export default App
