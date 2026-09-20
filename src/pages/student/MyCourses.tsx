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

type CourseTab = 'main' | 'support'

function MyCourses({ onOpenCourse, onBrowseCourses }: MyCoursesProps) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<CourseTab>('main')
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

  const isMain = tab === 'main'

  return (
    <section className="hl-student-page hl-my-courses-page">
      <header className="hl-my-courses-header">
        <div>
          <h1>Khóa học của tôi</h1>
          <p>Quản lý và tiếp tục học các khóa học ĐGNL bạn đã đăng ký.</p>
        </div>
      </header>

      <div className="hl-catalog-topbar">
        <div className="hl-catalog-tabs" role="tablist" aria-label="Loại khóa học">
          <button
            type="button"
            role="tab"
            aria-selected={isMain}
            className={isMain ? 'is-active' : ''}
            onClick={() => setTab('main')}
          >
            Khóa học chính
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isMain}
            className={!isMain ? 'is-active' : ''}
            onClick={() => setTab('support')}
          >
            Khóa học bổ trợ
          </button>
        </div>

        <label className="hl-catalog-search">
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kiếm khóa học"
          />
        </label>
      </div>

      <article className="hl-catalog-panel">
        <div className="hl-catalog-group-head">
          <h2>{isMain ? 'Khóa học chính' : 'Khóa học bổ trợ'}</h2>
          {isMain && status === 'ready' && <span>{visibleEnrollments.length} khóa học</span>}
        </div>

        {!isMain && (
          <div className="hl-catalog-state">
            <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
            <strong>Khóa học bổ trợ sắp ra mắt</strong>
            <p>Các khóa học bổ trợ sẽ sớm có mặt tại đây.</p>
          </div>
        )}

        {isMain && status === 'loading' && (
          <div className="hl-catalog-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="hl-catalog-skeleton" key={index} aria-hidden="true" />
            ))}
          </div>
        )}

        {isMain && status === 'error' && (
          <div className="hl-catalog-state">
            <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
            <strong>Không thể tải khóa học của bạn</strong>
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

        {isMain && status === 'ready' && enrollments.length === 0 && (
          <div className="hl-catalog-state">
            <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
            <strong>Bạn chưa có khóa học nào</strong>
            <p>Khám phá các khóa học phù hợp để bắt đầu hành trình học tập của bạn.</p>
            <button type="button" onClick={onBrowseCourses}>
              Khám phá khóa học
            </button>
          </div>
        )}

        {isMain &&
          status === 'ready' &&
          enrollments.length > 0 &&
          visibleEnrollments.length === 0 && (
            <div className="hl-catalog-state">
              <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
              <strong>Không tìm thấy khóa học</strong>
              <p>Thử thay đổi từ khóa tìm kiếm của bạn.</p>
            </div>
          )}

        {isMain && status === 'ready' && visibleEnrollments.length > 0 && (
          <div className="hl-catalog-grid">
            {visibleEnrollments.map((enrollment) => (
              <MyCourseCard
                key={enrollment.course.id}
                enrollment={enrollment}
                onOpen={onOpenCourse}
              />
            ))}
          </div>
        )}
      </article>
    </section>
  )
}

export default MyCourses
