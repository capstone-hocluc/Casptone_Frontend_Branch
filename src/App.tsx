import { useEffect, useRef, useState } from 'react'
import LandingPage from './pages/LandingPage'
import CourseCatalogPage from './pages/CourseCatalogPage'
import CourseDetailPage from './pages/course/CourseDetailPage'
import CartPage from './pages/cart/CartPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import MyOrdersPage from './pages/orders/MyOrdersPage'
import OrderDetailPage from './pages/orders/OrderDetailPage'
import PaymentResultPage from './pages/payment/PaymentResultPage'
import PaymentInstructionsPage from './pages/payment/PaymentInstructionsPage'
import AuthPage from './components/auth/AuthPage'
import StudentOnboarding from './components/student/StudentOnboarding'
import StudentRoutes from './pages/student/StudentRoutes'
import AdminLoginPage from './pages/AdminLoginPage'
import StaffDashboard from './components/staff/StaffDashboard'
import TeacherDashboard from './components/teacher/TeacherDashboard'
import { useCurrentUser } from './hooks/useCurrentUser'
import { logout } from './services/authService.ts'
import { parseStudentRoute, studentRoutes, toStudentPath } from './lib/studentRoutes'

function App() {
  const { clearCurrentUser } = useCurrentUser()
  const getAuthMode = () => {
    const path = window.location.pathname.replace(/\/$/, '')
    if (path === '/staff/dashboard') return 'staff-dashboard'
    if (path === '/admin/login') return 'admin-login'
    if (path === '/admin/dashboard') return 'admin-dashboard'
    if (path === '/teacher/dashboard') return 'teacher-dashboard'
    if (path === '/teacher/my-courses') return 'teacher-courses'
    if (path === '/teacher/mock-exams') return 'teacher-mock-exams'
    if (/^\/teacher\/my-courses\/[^/]+\/quiz$/.test(path)) {
      return `teacher-quiz-${path.split('/')[3]}`
    }
    if (/^\/teacher\/my-courses\/[^/]+\/quiz\/new$/.test(path)) {
      return `teacher-quiz-new-${path.split('/')[3]}`
    }
    if (/^\/teacher\/my-courses\/[^/]+\/assignments$/.test(path)) {
      return `teacher-assignments-${path.split('/')[3]}`
    }
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
    if (path === '/cart') return 'cart'
    if (path === '/checkout') return 'checkout'
    if (path === '/orders') return 'orders'
    if (path === '/payment/result') return 'payment-result'
    return path === '/signup' ? 'signup' : path === '/login' ? 'login' : null
  }

  const [authMode, setAuthMode] = useState(getAuthMode)
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/'
    const target = toStudentPath(path)
    if (target !== path) window.history.replaceState({}, '', target)
    return target
  })
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
  // `state` is optional history state - used to hand data (e.g. SePay payment
  // instructions) to the next page without a prop path, since it's not
  // returned by GET endpoints and would otherwise be lost on navigation.
  const navigateTo = (rawPath, state = {}) => {
    const path = toStudentPath(rawPath)
    window.history.pushState(state, '', path)
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
      'mock-exams': '/teacher/mock-exams',
      information: '/teacher/information',
    }
    const path = page.startsWith('quiz-new-') ? `/teacher/my-courses/${page.replace('quiz-new-', '')}/quiz/new` : page.startsWith('quiz-') ? `/teacher/my-courses/${page.replace('quiz-', '')}/quiz` : page.startsWith('assignments-') ? `/teacher/my-courses/${page.replace('assignments-', '')}/assignments` : paths[page]
    window.history.pushState({}, '', path)
    setAuthMode(`teacher-${page}`)
    setCurrentPath(path)
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

  // Segments for any '/courses/...' path: ['courses', courseId]. Only the
  // course detail is public; studying lives under /student/courses/:id/study.
  const courseRouteSegments = currentPath.startsWith('/courses/')
    ? currentPath.split('/').filter(Boolean)
    : []
  const isPublicCourseDetailPath = courseRouteSegments.length === 2

  const publicCourseId = isPublicCourseDetailPath
    ? decodeURIComponent(courseRouteSegments[1] || '')
    : null

  // Segments for any '/orders/...' path: ['orders', orderId, 'payment'?]
  const orderRouteSegments = currentPath.startsWith('/orders/')
    ? currentPath.split('/').filter(Boolean)
    : []
  const isOrderPaymentPath =
    orderRouteSegments.length === 3 && orderRouteSegments[2] === 'payment'
  const isOrderDetailPath = orderRouteSegments.length === 2

  const orderPaymentOrderId = isOrderPaymentPath
    ? decodeURIComponent(orderRouteSegments[1] || '')
    : null
  const orderDetailId = isOrderDetailPath
    ? decodeURIComponent(orderRouteSegments[1] || '')
    : null

  if (authMode?.startsWith('staff-'))
    return (
      <StaffDashboard
        page={authMode.replace('staff-', '')}
        onNavigate={navigateStaff}
        onBack={backToLanding}
      />
    )
  if (authMode === 'admin-dashboard')
    return (
      <StaffDashboard
        page="dashboard"
        onNavigate={navigateStaff}
        onBack={backToLanding}
      />
    )
  if (authMode === 'admin-login')
    return (
      <AdminLoginPage
        onBack={backToLanding}
        onSuccess={() => navigateTo('/admin/dashboard')}
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
  // Every authenticated learning screen (dashboard, courses, study, lessons,
  // video, quizzes, attempts, results, review, learning profile) renders inside
  // the single StudentLayout owned by StudentRoutes.
  const studentRoute = parseStudentRoute(currentPath)
  if (studentRoute)
    return (
      <StudentRoutes
        route={studentRoute}
        currentPath={currentPath}
        navigate={navigateTo}
        onLogout={handleLogout}
        logoutLoading={logoutLoading}
      />
    )
  if (publicCourseId)
    return (
      <CourseDetailPage
        key={publicCourseId}
        courseId={publicCourseId}
        onBackToHome={backToLanding}
        onBackToCatalog={() => navigateTo('/courses')}
        onStartLearning={(id) => navigateTo(studentRoutes.courseStudy(id))}
        onGoToCart={() => navigateTo('/cart')}
      />
    )
  if (orderPaymentOrderId)
    return (
      <PaymentInstructionsPage
        key={orderPaymentOrderId}
        orderId={orderPaymentOrderId}
        onGoToOrderDetail={() => navigateTo(`/orders/${orderPaymentOrderId}`)}
        onGoToMyCourses={() => navigateTo(studentRoutes.courses())}
      />
    )
  if (orderDetailId)
    return (
      <OrderDetailPage
        key={orderDetailId}
        orderId={orderDetailId}
        onBackToOrders={() => navigateTo('/orders')}
        onGoToMyCourses={() => navigateTo(studentRoutes.courses())}
        onPaymentReady={(paymentData) =>
          navigateTo(`/orders/${paymentData.order.id}/payment`, paymentData)
        }
        onOpenCourse={(courseId) => navigateTo(`/courses/${courseId}`)}
      />
    )
  if (authMode === 'courses')
    return <CourseCatalogPage onOpenCourse={(course) => navigateTo(`/courses/${course.id}`)} />
  if (authMode === 'cart')
    return (
      <CartPage
        onBrowseCourses={() => navigateTo('/courses')}
        onGoToCheckout={() => navigateTo('/checkout')}
      />
    )
  if (authMode === 'checkout')
    return (
      <CheckoutPage
        onOrderCreated={(paymentData) =>
          navigateTo(`/orders/${paymentData.order.id}/payment`, paymentData)
        }
        onBackToCart={() => navigateTo('/cart')}
      />
    )
  if (authMode === 'orders')
    return (
      <MyOrdersPage
        onOpenOrder={(orderId) => navigateTo(`/orders/${orderId}`)}
        onBrowseCourses={() => navigateTo('/courses')}
      />
    )
  if (authMode === 'payment-result')
    return (
      <PaymentResultPage
        onGoToMyCourses={() => navigateTo(studentRoutes.courses())}
        onOpenOrder={(orderId) => navigateTo(`/orders/${orderId}`)}
        onGoToOrders={() => navigateTo('/orders')}
      />
    )
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
