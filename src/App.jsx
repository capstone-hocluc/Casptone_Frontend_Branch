import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AuthPage from './components/auth/AuthPage'
import StudentOnboarding from './components/student/StudentOnboarding'
import StudentLayout from './components/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import StaffDashboard from './components/staff/StaffDashboard'

function App() {
  const getAuthMode = () => {
    const path = window.location.pathname.replace(/\/$/, '')
    if (path === '/staff/dashboard') return 'staff-dashboard'
    if (path === '/staff/students') return 'staff-students'
    if (path === '/staff/students/hs-24091') return 'staff-detail'
    if (path === '/staff/enrollments') return 'staff-enrollments'
    if (path === '/staff/schedules') return 'staff-schedules'
    if (path === '/staff/attendance') return 'staff-attendance'
    if (path === '/staff/tuition') return 'staff-tuition'
    if (path === '/staff/invoices') return 'staff-invoices'
    if (path === '/staff/payments') return 'staff-payments'
    if (path === '/staff/batches') return 'staff-batches'
    if (path === '/staff/batches/batch-12a-k24') return 'staff-batch-detail'
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
  const navigateStaff = (page) => {
    const paths = { dashboard: '/staff/dashboard', students: '/staff/students', detail: '/staff/students/hs-24091', enrollments: '/staff/enrollments', schedules: '/staff/schedules', attendance: '/staff/attendance', tuition: '/staff/tuition', invoices: '/staff/invoices', payments: '/staff/payments', batches: '/staff/batches', 'batch-detail': '/staff/batches/batch-12a-k24' }
    window.history.pushState({}, '', paths[page])
    setAuthMode(`staff-${page}`)
  }
  const goAfterLogin = (email) => {
    if (email.trim().toLowerCase().includes('staff')) navigateStaff('dashboard')
    else goToOnboarding()
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

  if (authMode?.startsWith('staff-')) return <StaffDashboard page={authMode.replace('staff-', '')} onNavigate={navigateStaff} onBack={backToLanding} />
  if (authMode === 'onboarding') return <StudentOnboarding onBack={backToLanding} />
  if (currentPath === '/student/dashboard') return renderStudentDashboard()
  return authMode ? (
    <AuthPage
      mode={authMode}
      onModeChange={navigateAuth}
      onContinue={authMode === 'signup' ? goToEmailVerification : goAfterLogin}
      onBack={backToLanding}
    />
  ) : (
    <LandingPage />
  )
}

export default App
