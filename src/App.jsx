import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AuthPage from './components/auth/AuthPage'
import StudentOnboarding from './components/student/StudentOnboarding'
import StudentLayout from './components/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'

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
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname.replace(/\/$/, '') || '/')

  useEffect(() => {
    const openAuth = (event) => {
      const mode = event.detail?.mode || 'login'
      window.history.pushState({}, '', `/${mode}`)
      setAuthMode(mode)
      setCurrentPath(`/${mode}`)
    }
    const syncPath = () => {
      setAuthMode(getAuthMode())
      setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/')
    }
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
    setCurrentPath(`/${mode}`)
  }

  const backToLanding = () => {
    window.history.pushState({}, '', '/')
    setAuthMode(null)
    setCurrentPath('/')
  }

  const goToOnboarding = () => {
    window.history.pushState({}, '', '/onboarding')
    setAuthMode('onboarding')
    setCurrentPath('/onboarding')
  }

  const goToEmailVerification = () => {
    window.history.pushState({}, '', '/verify-email')
    setAuthMode('verify-email')
    setCurrentPath('/verify-email')
  }

  const navigateStudent = (path) => {
    if (path !== '/student/dashboard') return
    window.history.pushState({}, '', path)
    setAuthMode(null)
    setCurrentPath(path)
  }

  const renderStudentDashboard = () => (
    <StudentLayout
      currentPath={currentPath}
      title="Tổng quan"
      subtitle="Theo dõi tiến độ, bài tập và lịch học sắp tới."
      onNavigate={navigateStudent}
      onBack={backToLanding}
    >
      <StudentDashboard />
    </StudentLayout>
  )

  if (authMode === 'onboarding') return <StudentOnboarding onBack={backToLanding} />
  if (currentPath === '/student/dashboard') return renderStudentDashboard()
  return authMode ? (
    <AuthPage
      mode={authMode}
      onModeChange={navigateAuth}
      onContinue={authMode === 'signup' ? goToEmailVerification : goToOnboarding}
      onBack={backToLanding}
    />
  ) : (
    <LandingPage />
  )
}

export default App
