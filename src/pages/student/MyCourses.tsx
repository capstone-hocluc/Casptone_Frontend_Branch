import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import MyCourseCard from '../../components/student/MyCourseCard'
import { getErrorMessage } from '../../lib/errors'
import { getMyCourses } from '../../services/courseService'
import type { MyCourseEnrollment } from '../../services/courseService'

interface MyCoursesProps {
  onOpenCourse: (course: MyCourseEnrollment['course']) => void
  onBrowseCourses: () => void
}

function MyCourses({ onOpenCourse, onBrowseCourses }: MyCoursesProps) {
  const [query, setQuery] = useState('')
  const [enrollments, setEnrollments] = useState<MyCourseEnrollment[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await getMyCourses()
        if (cancelled) return
        setEnrollments(response.data || [])
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        setErrorMessage(getErrorMessage(error) || 'Không thể tải khóa học của bạn')
        setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const visibleEnrollments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return enrollments
    return enrollments.filter((enrollment) =>
      enrollment.course.title.toLowerCase().includes(normalizedQuery)
    )
  }, [enrollments, query])

  return (
    <section className="hl-student-page hl-my-courses-page">
      <header className="hl-my-courses-header">
        <div>
          <h1>Khóa học của tôi</h1>
          <p>Quản lý và tiếp tục học các khóa học ĐGNL bạn đã đăng ký.</p>
        </div>
      </header>

      <article className="hl-my-courses-panel">
        <div className="hl-my-courses-toolbar">
          <label className="hl-my-courses-search">
            <Search size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm kiếm khóa học"
            />
          </label>
        </div>

        <div className="hl-my-courses-group-head">
          <div>
            <h2>Khóa học của tôi</h2>
            <span>{enrollments.length} khóa học</span>
          </div>
        </div>

        {status === 'loading' && (
          <div className="hl-my-courses-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="hl-my-course-skeleton" key={index} aria-hidden="true" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="hl-my-courses-empty">
            <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
            <strong>Không thể tải khóa học của bạn</strong>
            <p>{errorMessage}</p>
            <button
              type="button"
              className="hl-my-courses-empty-cta"
              onClick={() => {
                setStatus('loading')
                setReloadKey((current) => current + 1)
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {status === 'ready' &&
          (enrollments.length ? (
            <div className="hl-my-courses-grid">
              {visibleEnrollments.map((enrollment) => (
                <MyCourseCard
                  key={enrollment.course.id}
                  enrollment={enrollment}
                  onOpen={onOpenCourse}
                />
              ))}
              {!visibleEnrollments.length && (
                <div className="hl-my-courses-empty">
                  <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
                  <strong>Không tìm thấy khóa học</strong>
                  <p>Thử thay đổi từ khóa tìm kiếm của bạn.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="hl-my-courses-empty">
              <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
              <strong>Bạn chưa có khóa học nào</strong>
              <p>Khám phá các khóa học phù hợp để bắt đầu hành trình học tập của bạn.</p>
              <button type="button" className="hl-my-courses-empty-cta" onClick={onBrowseCourses}>
                Khám phá khóa học
              </button>
            </div>
          ))}
      </article>
    </section>
  )
}

export default MyCourses
