import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Search } from 'lucide-react'
import { getMainCourses, type Course } from '../../services/courseService'
import { getErrorMessage } from '../../lib/errors'
import CourseCard from './CourseCard'
import DropdownField from '../ui/DropdownField'

function prettifyEnum(value?: string) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function uniqueSorted(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort()
}

interface CourseCatalogProps {
  onOpenCourse: (course: Course) => void
}

function CourseCatalog({ onOpenCourse }: CourseCatalogProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [examFilter, setExamFilter] = useState('all')
  const [trackFilter, setTrackFilter] = useState('all')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getMainCourses()
      .then((response) => {
        if (cancelled) return
        setCourses(response.data || [])
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const retry = () => {
    setStatus('loading')
    setReloadKey((current) => current + 1)
  }

  const examOptions = useMemo(() => uniqueSorted(courses.map((c) => c.targetExam)), [courses])
  const trackOptions = useMemo(() => uniqueSorted(courses.map((c) => c.track)), [courses])

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery =
        !normalizedQuery ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        (course.description || '').toLowerCase().includes(normalizedQuery)
      const matchesExam = examFilter === 'all' || course.targetExam === examFilter
      const matchesTrack = trackFilter === 'all' || course.track === trackFilter
      return matchesQuery && matchesExam && matchesTrack
    })
  }, [courses, query, examFilter, trackFilter])

  return (
    <section className="hl-catalog-section">
      <div className="hl-catalog-container">
        <div className="hl-catalog-intro">
          <span className="hl-catalog-eyebrow">Khóa học</span>
          <h1>Khám phá khóa học ôn luyện phù hợp với bạn</h1>
          <p>Chọn khóa học theo kỳ thi mục tiêu và bắt đầu lộ trình ôn luyện ngay hôm nay.</p>
        </div>

        <div className="hl-catalog-toolbar">
          <div className="hl-catalog-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Tìm khóa học theo tên..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {examOptions.length > 0 && (
            <DropdownField
              ariaLabel="Kỳ thi"
              className="hl-catalog-dropdown w-auto"
              options={[
                { id: 'all', label: 'Tất cả kỳ thi' },
                ...examOptions.map((option) => ({ id: option, label: prettifyEnum(option) })),
              ]}
              value={examFilter}
              onChange={(value) => {
                if (value !== null) setExamFilter(value)
              }}
            />
          )}

          {trackOptions.length > 0 && (
            <DropdownField
              ariaLabel="Lộ trình"
              className="hl-catalog-dropdown w-auto"
              options={[
                { id: 'all', label: 'Tất cả lộ trình' },
                ...trackOptions.map((option) => ({ id: option, label: prettifyEnum(option) })),
              ]}
              value={trackFilter}
              onChange={(value) => {
                if (value !== null) setTrackFilter(value)
              }}
            />
          )}
        </div>

        {status === 'loading' && (
          <div className="hl-catalog-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="hl-catalog-skeleton" key={index} aria-hidden="true" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="hl-catalog-state">
            <AlertTriangle size={28} />
            <p>{errorMessage}</p>
            <button type="button" onClick={retry}>
              Thử lại
            </button>
          </div>
        )}

        {status === 'ready' && filteredCourses.length === 0 && (
          <div className="hl-catalog-state">
            <p>Hiện chưa có khóa học phù hợp.</p>
          </div>
        )}

        {status === 'ready' && filteredCourses.length > 0 && (
          <div className="hl-catalog-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onOpen={onOpenCourse} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CourseCatalog
