import { useEffect, useState } from 'react'
import { AlertTriangle, SearchX } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import CourseBreadcrumb from '../../components/course/CourseBreadcrumb'
import CourseDetailHero from '../../components/course/CourseDetailHero'
import CourseEnrollmentCard from '../../components/course/CourseEnrollmentCard'
import CourseStats from '../../components/course/CourseStats'
import CourseCurriculum from '../../components/course/CourseCurriculum'
import { getCourseDetail, type CourseDetail } from '../../services/courseService'
import { addCartItem } from '../../services/cartService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'
import { showErrorToast, showSuccessToast } from '../../lib/toastBus'

interface CourseDetailPageProps {
  courseId: string
  onBackToHome: () => void
  onBackToCatalog: () => void
  onStartLearning: (courseId: string) => void
  onGoToCart: () => void
}

function CourseDetailPage({
  courseId,
  onBackToHome,
  onBackToCatalog,
  onStartLearning,
  onGoToCart,
}: CourseDetailPageProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'not-found'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getCourseDetail(courseId)
      .then((response) => {
        if (cancelled) return
        if (!response.data) {
          setStatus('not-found')
          return
        }
        setCourse(response.data)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 404) {
          setStatus('not-found')
          return
        }
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [courseId, reloadKey])

  const handleAddToCart = async () => {
    if (!course || addingToCart) return
    setAddingToCart(true)
    try {
      const response = await addCartItem(course.id)
      const isNowInCart = response.data
        ? response.data.items.some((item) => item.courseId === course.id)
        : true
      setCourse({ ...course, inCart: isNowInCart })
      showSuccessToast('Đã thêm khóa học vào giỏ hàng.')
    } catch (error) {
      showErrorToast(getErrorMessage(error))
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="hl-cd-page">
      <Navbar />
      <main className="hl-cd-main-wrap">
        {status === 'loading' && (
          <div className="hl-cd-container">
            <div className="hl-cd-skeleton-breadcrumb" />
            <div className="hl-cd-grid">
              <div className="hl-cd-skeleton-block" style={{ height: 320 }} />
              <div className="hl-cd-skeleton-block" style={{ height: 380 }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="hl-cd-state">
            <AlertTriangle size={30} />
            <p>{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                setStatus('loading')
                setReloadKey((current) => current + 1)
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {status === 'not-found' && (
          <div className="hl-cd-state">
            <SearchX size={30} />
            <p>Không tìm thấy khóa học này.</p>
            <button type="button" onClick={onBackToCatalog}>
              Quay lại danh sách khóa học
            </button>
          </div>
        )}

        {status === 'ready' && course && (
          <div className="hl-cd-container">
            <CourseBreadcrumb
              courseTitle={course.title}
              onGoHome={onBackToHome}
              onGoCatalog={onBackToCatalog}
            />

            <div className="hl-cd-grid">
              <div className="hl-cd-main">
                <CourseDetailHero course={course} />
                <CourseStats course={course} />

                {course.description && (
                  <section className="hl-cd-section">
                    <h2>Giới thiệu khóa học</h2>
                    <div className="hl-cd-description">
                      {course.description.split('\n').map((paragraph, index) =>
                        paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                      )}
                    </div>
                  </section>
                )}

                <CourseCurriculum
                  phases={course.phases || []}
                  purchased={Boolean(course.purchased)}
                />
              </div>

              <aside className="hl-cd-aside">
                <CourseEnrollmentCard
                  course={course}
                  onStartLearning={() => onStartLearning(course.id)}
                  onAddToCart={handleAddToCart}
                  addingToCart={addingToCart}
                  onGoToCart={onGoToCart}
                />
              </aside>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default CourseDetailPage
