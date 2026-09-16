import { useEffect, useRef, useState } from 'react'
import LandingPage from './pages/LandingPage'
import CourseCatalogPage from './pages/CourseCatalogPage'
import CourseDetailPage from './pages/course/CourseDetailPage'
import AuthPage from './components/auth/AuthPage'
import StudentOnboarding from './components/student/StudentOnboarding'
import StudentLayout from './components/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import LearningProfile from './pages/student/LearningProfile'
import AccountProfile from './pages/student/AccountProfile'
import MyCourses from './pages/student/MyCourses'
import CourseDetail from './pages/student/CourseDetail'
import LearningActivity from './pages/student/LearningActivity'
import VideoLearningPage from './pages/student/VideoLearningPage'
import StaffDashboard from './components/staff/StaffDashboard'
import TeacherDashboard from './components/teacher/TeacherDashboard'
import { useCurrentUser } from './hooks/useCurrentUser'
import { logout } from './services/authService.ts'

function App() {
  const { clearCurrentUser } = useCurrentUser()
  const getAuthMode = () => {
    const path = window.location.pathname.replace(/\/$/, '')
    if (path === '/staff/dashboard') return 'staff-dashboard'
    if (path === '/teacher/dashboard') return 'teacher-dashboard'
    if (path === '/teacher/my-courses') return 'teacher-courses'
    if (path === '/teacher/information') return 'teacher-information'
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
    if (path === '/courses') return 'courses'
    return path === '/signup' ? 'signup' : path === '/login' ? 'login' : null
  }

  const [authMode, setAuthMode] = useState(getAuthMode)
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname.replace(/\/$/, '') || '/'
  )
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('')
  const [logoutLoading, setLogoutLoading] = useState(false)
  const logoutInFlight = useRef(false)

  const navigateAuth = (mode) => {
    window.history.pushState({}, '', `/${mode}`)
    setAuthMode(mode)
    setCurrentPath(`/${mode}`)
  }

  // Generic route push used by components with no prop path back to App
  // (e.g. Navbar, nested deep inside LandingPage) via the `hl-navigate` event.
  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    setAuthMode(getAuthMode())
    setCurrentPath(path.replace(/\/$/, '') || '/')
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

  const goToEmailVerification = (email = '') => {
    setPendingVerificationEmail(email)
    window.history.pushState({}, '', '/verify-email')
    setAuthMode('verify-email')
    setCurrentPath('/verify-email')
  }
  const navigateStaff = (page) => {
    const paths = {
      dashboard: '/staff/dashboard',
      students: '/staff/students',
      detail: '/staff/students/hs-24091',
      enrollments: '/staff/enrollments',
      schedules: '/staff/schedules',
      attendance: '/staff/attendance',
      tuition: '/staff/tuition',
      invoices: '/staff/invoices',
      payments: '/staff/payments',
      batches: '/staff/batches',
      'batch-detail': '/staff/batches/batch-12a-k24',
    }
    window.history.pushState({}, '', paths[page])
    setAuthMode(`staff-${page}`)
  }
  const navigateTeacher = (page) => {
    const paths = {
      dashboard: '/teacher/dashboard',
      courses: '/teacher/my-courses',
      information: '/teacher/information',
    }
    window.history.pushState({}, '', paths[page])
    setAuthMode(`teacher-${page}`)
    setCurrentPath(paths[page])
  }
  const goAfterLogin = () => {
    setPendingVerificationEmail('')
    backToLanding()
  }

  const handleLogout = async () => {
    if (logoutInFlight.current) return
    logoutInFlight.current = true
    setLogoutLoading(true)
    try {
      await logout()
    } finally {
      clearCurrentUser()
      setPendingVerificationEmail('')
      window.history.replaceState({}, '', '/login')
      setAuthMode('login')
      setCurrentPath('/login')
      logoutInFlight.current = false
      setLogoutLoading(false)
    }
  }

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
    const onNavigate = (event) => {
      const path = event.detail?.path
      if (path) navigateTo(path)
    }
    const onLogoutRequested = () => {
      handleLogout()
    }
    window.addEventListener('open-auth', openAuth)
    window.addEventListener('popstate', syncPath)
    window.addEventListener('hl-navigate', onNavigate)
    window.addEventListener('hl-logout', onLogoutRequested)
    return () => {
      window.removeEventListener('open-auth', openAuth)
      window.removeEventListener('popstate', syncPath)
      window.removeEventListener('hl-navigate', onNavigate)
      window.removeEventListener('hl-logout', onLogoutRequested)
    }
  }, [])

  const navigateStudent = (path) => {
    if (
      ![
        '/student/dashboard',
        '/student/learning-profile',
        '/student/courses',
        '/student/profile',
      ].includes(path) &&
      !path.startsWith('/student/courses/')
    )
      return
    window.history.pushState({}, '', path)
    setAuthMode(null)
    setCurrentPath(path)
  }

  const isPublicCourseDetailPath =
    currentPath.startsWith('/courses/') && currentPath !== '/courses/'
  const publicCourseId = isPublicCourseDetailPath
    ? decodeURIComponent(currentPath.split('/')[2] || '')
    : null

  const isCoursesPath =
    currentPath === '/student/courses' || currentPath.startsWith('/student/courses/')
  const coursePathParts = currentPath.startsWith('/student/courses/')
    ? currentPath.split('/').filter(Boolean)
    : []
  const courseId = coursePathParts[2] ? decodeURIComponent(coursePathParts[2]) : null
  const activityRouteType = coursePathParts[3] || ''
  const activityId = coursePathParts[4] ? decodeURIComponent(coursePathParts[4]) : null
  const isActivityPath = Boolean(courseId && activityRouteType && activityId)
  const studentTitle =
    currentPath === '/student/learning-profile'
      ? 'Hồ sơ năng lực'
      : currentPath === '/student/profile'
        ? 'Hồ sơ của tôi'
        : isCoursesPath
          ? 'Khóa học của tôi'
          : 'Tổng quan'
  const studentSubtitle =
    currentPath === '/student/learning-profile'
      ? 'Theo dõi năng lực và sự tiến bộ trong quá trình ôn thi ĐGNL.'
      : currentPath === '/student/profile'
        ? 'Quản lý thông tin cá nhân, hồ sơ học tập và bảo mật tài khoản.'
        : isCoursesPath
          ? 'Quản lý và tiếp tục học các khóa học ĐGNL bạn đã đăng ký.'
          : 'Theo dõi tiến độ, bài tập và lịch học sắp tới.'

  const renderStudentDashboard = () => (
    <StudentLayout
      currentPath={currentPath}
      title={studentTitle}
      subtitle={studentSubtitle}
      onNavigate={navigateStudent}
      onBack={backToLanding}
      onLogout={handleLogout}
      logoutLoading={logoutLoading}
    >
      {currentPath === '/student/learning-profile' ? (
        <LearningProfile />
      ) : currentPath === '/student/profile' ? (
        <AccountProfile />
      ) : isActivityPath ? (
        <LearningActivity
          courseId={courseId}
          routeType={activityRouteType}
          activityId={activityId}
          onBack={() => navigateStudent(`/student/courses/${courseId}`)}
        />
      ) : courseId ? (
        <CourseDetail
          courseId={courseId}
          onBack={() => navigateStudent('/student/courses')}
          onOpenActivity={(targetCourseId, routeType, targetActivityId) =>
            navigateStudent(`/student/courses/${targetCourseId}/${routeType}/${targetActivityId}`)
          }
        />
      ) : isCoursesPath ? (
        <MyCourses onOpenCourse={(course) => navigateStudent(`/student/courses/${course.id}`)} />
      ) : (
        <StudentDashboard
          onOpenLearningProfile={() => navigateStudent('/student/learning-profile')}
        />
      )}
    </StudentLayout>
  )

  if (authMode?.startsWith('staff-'))
    return (
      <StaffDashboard
        page={authMode.replace('staff-', '')}
        onNavigate={navigateStaff}
        onBack={backToLanding}
      />
    )
  if (authMode?.startsWith('teacher-'))
    return (
      <TeacherDashboard
        key={authMode}
        page={authMode.replace('teacher-', '')}
        onNavigate={navigateTeacher}
        onBack={backToLanding}
        onLogout={handleLogout}
        logoutLoading={logoutLoading}
      />
    )
  if (authMode === 'onboarding') return <StudentOnboarding onBack={backToLanding} />
  if (isActivityPath && activityRouteType === 'lessons') {
    return (
      <VideoLearningPage
        courseId={courseId}
        activityId={activityId}
        onBackCourse={() => navigateStudent(`/student/courses/${courseId}`)}
        onCourses={() => navigateStudent('/student/courses')}
        onNavigateActivity={(targetCourseId, routeType, targetActivityId) =>
          navigateStudent(`/student/courses/${targetCourseId}/${routeType}/${targetActivityId}`)
        }
      />
    )
  }
  if (
    [
      '/student/dashboard',
      '/student/learning-profile',
      '/student/courses',
      '/student/profile',
    ].includes(currentPath) || currentPath.startsWith('/student/courses/')
  )
    return renderStudentDashboard()
  if (publicCourseId)
    return (
      <CourseDetailPage
        key={publicCourseId}
        courseId={publicCourseId}
        onBackToHome={backToLanding}
        onBackToCatalog={() => navigateTo('/courses')}
        onStartLearning={(id) => navigateStudent(`/student/courses/${id}`)}
      />
    )
  if (authMode === 'courses')
    return <CourseCatalogPage onOpenCourse={(course) => navigateTo(`/courses/${course.id}`)} />
  return authMode ? (
    <AuthPage
      mode={authMode}
      onModeChange={navigateAuth}
      onContinue={authMode === 'signup' ? goToEmailVerification : goAfterLogin}
      verificationEmail={pendingVerificationEmail}
      onBack={backToLanding}
    />
  ) : (
    <LandingPage />
  )
}

export default App
