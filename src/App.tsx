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
import CourseStudyPage from './pages/course/CourseStudyPage'
import LessonPage from './pages/course/LessonPage'
import QuizDetailPage from './pages/assessments/QuizDetailPage'
import QuizAttemptPage from './pages/assessments/QuizAttemptPage'
import QuizReviewPage from './pages/assessments/QuizReviewPage'
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
    if (path === '/cart') return 'cart'
    if (path === '/checkout') return 'checkout'
    if (path === '/orders') return 'orders'
    if (path === '/payment/result') return 'payment-result'
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
  // `state` is optional history state - used to hand data (e.g. SePay payment
  // instructions) to the next page without a prop path, since it's not
  // returned by GET endpoints and would otherwise be lost on navigation.
  const navigateTo = (path, state = {}) => {
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

  // Segments for any '/courses/...' path: ['courses', courseId, 'study'?, 'lessons'?, lessonId?]
  const courseRouteSegments = currentPath.startsWith('/courses/')
    ? currentPath.split('/').filter(Boolean)
    : []
  const isCourseStudyLessonPath =
    courseRouteSegments.length === 5 &&
    courseRouteSegments[2] === 'study' &&
    courseRouteSegments[3] === 'lessons'
  const isCourseStudyRootPath =
    courseRouteSegments.length === 3 && courseRouteSegments[2] === 'study'
  const isPublicCourseDetailPath = courseRouteSegments.length === 2

  const studyCourseId =
    isCourseStudyRootPath || isCourseStudyLessonPath
      ? decodeURIComponent(courseRouteSegments[1] || '')
      : null
  const studyLessonId = isCourseStudyLessonPath
    ? decodeURIComponent(courseRouteSegments[4] || '')
    : null
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

  // Segments for any '/assessments/...' path:
  // ['assessments','quizzes',quizId,'attempts'?,attemptId?]
  // or ['assessments','attempts',attemptId,'review']
  const assessmentSegments = currentPath.startsWith('/assessments/')
    ? currentPath.split('/').filter(Boolean)
    : []
  const isQuizDetailPath = assessmentSegments.length === 3 && assessmentSegments[1] === 'quizzes'
  const isQuizAttemptPath =
    assessmentSegments.length === 5 &&
    assessmentSegments[1] === 'quizzes' &&
    assessmentSegments[3] === 'attempts'
  const isAttemptReviewPath =
    assessmentSegments.length === 4 &&
    assessmentSegments[1] === 'attempts' &&
    assessmentSegments[3] === 'review'

  const quizDetailId = isQuizDetailPath ? decodeURIComponent(assessmentSegments[2] || '') : null
  const attemptQuizId = isQuizAttemptPath ? decodeURIComponent(assessmentSegments[2] || '') : null
  const quizAttemptId = isQuizAttemptPath ? decodeURIComponent(assessmentSegments[4] || '') : null
  const reviewAttemptId = isAttemptReviewPath
    ? decodeURIComponent(assessmentSegments[2] || '')
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
        <MyCourses
          onOpenCourse={(course) => navigateTo(`/courses/${course.id}/study`)}
          onBrowseCourses={() => navigateTo('/courses')}
        />
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
  if (studyLessonId)
    return (
      <LessonPage
        key={`${studyCourseId}-${studyLessonId}`}
        courseId={studyCourseId}
        lessonId={studyLessonId}
        onBackToStudy={() => navigateTo(`/courses/${studyCourseId}/study`)}
        onNavigateLesson={(lessonId) =>
          navigateTo(`/courses/${studyCourseId}/study/lessons/${lessonId}`)
        }
        onOpenQuiz={(quizId) => navigateTo(`/assessments/quizzes/${quizId}`)}
      />
    )
  if (studyCourseId)
    return (
      <CourseStudyPage
        key={studyCourseId}
        courseId={studyCourseId}
        onBackToCourseDetail={() => navigateTo(`/courses/${studyCourseId}`)}
        onOpenLesson={(lessonId) => navigateTo(`/courses/${studyCourseId}/study/lessons/${lessonId}`)}
        onOpenQuiz={(quizId) => navigateTo(`/assessments/quizzes/${quizId}`)}
      />
    )
  if (quizAttemptId && attemptQuizId)
    return (
      <QuizAttemptPage
        key={quizAttemptId}
        quizId={attemptQuizId}
        attemptId={quizAttemptId}
        onExit={(quizId) => navigateTo(`/assessments/quizzes/${quizId}`)}
        onSubmitted={(attemptId) => navigateTo(`/assessments/attempts/${attemptId}/review`)}
      />
    )
  if (quizDetailId)
    return (
      <QuizDetailPage
        key={quizDetailId}
        quizId={quizDetailId}
        onStartAttempt={(quizId, attemptId) =>
          navigateTo(`/assessments/quizzes/${quizId}/attempts/${attemptId}`)
        }
        onOpenReview={(attemptId) => navigateTo(`/assessments/attempts/${attemptId}/review`)}
      />
    )
  if (reviewAttemptId)
    return (
      <QuizReviewPage
        key={reviewAttemptId}
        attemptId={reviewAttemptId}
        onBackToQuiz={(quizId) => navigateTo(`/assessments/quizzes/${quizId}`)}
      />
    )
  if (publicCourseId)
    return (
      <CourseDetailPage
        key={publicCourseId}
        courseId={publicCourseId}
        onBackToHome={backToLanding}
        onBackToCatalog={() => navigateTo('/courses')}
        onStartLearning={(id) => navigateTo(`/courses/${id}/study`)}
        onGoToCart={() => navigateTo('/cart')}
      />
    )
  if (orderPaymentOrderId)
    return (
      <PaymentInstructionsPage
        key={orderPaymentOrderId}
        orderId={orderPaymentOrderId}
        onGoToOrderDetail={() => navigateTo(`/orders/${orderPaymentOrderId}`)}
        onGoToMyCourses={() => navigateStudent('/student/courses')}
      />
    )
  if (orderDetailId)
    return (
      <OrderDetailPage
        key={orderDetailId}
        orderId={orderDetailId}
        onBackToOrders={() => navigateTo('/orders')}
        onGoToMyCourses={() => navigateStudent('/student/courses')}
        onPaymentReady={(paymentData) =>
          navigateTo(`/orders/${paymentData.order.id}/payment`, paymentData)
        }
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
        onGoToMyCourses={() => navigateStudent('/student/courses')}
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
