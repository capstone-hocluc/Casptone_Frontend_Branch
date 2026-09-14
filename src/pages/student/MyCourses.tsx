import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import MyCourseCard from '../../components/student/MyCourseCard'
import {
  studentCourses,
  studentCourseSubjects,
  studentCourseTypes,
} from '../../data/studentCourses'

function MyCourses({ onOpenCourse }) {
  const [activeType, setActiveType] = useState('main')
  const [activeSubject, setActiveSubject] = useState('Tất cả')
  const [query, setQuery] = useState('')

  const coursesByType = useMemo(
    () => studentCourses.filter((course) => course.type === activeType),
    [activeType]
  )
  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return coursesByType.filter((course) => {
      const matchesSubject = activeSubject === 'Tất cả' || course.subject === activeSubject
      const matchesQuery = !normalizedQuery || course.title.toLowerCase().includes(normalizedQuery)
      return matchesSubject && matchesQuery
    })
  }, [activeSubject, coursesByType, query])

  const activeTypeLabel =
    studentCourseTypes.find((type) => type.key === activeType)?.label || 'Khóa học'
  const hasCoursesInType = coursesByType.length > 0

  return (
    <section className="hl-student-page hl-my-courses-page">
      <header className="hl-my-courses-header">
        <div>
          <h1>Khóa học của tôi</h1>
          <p>Quản lý và tiếp tục học các khóa học ĐGNL bạn đã đăng ký.</p>
        </div>
      </header>

      <div className="hl-my-courses-tabs" role="tablist" aria-label="Loại khóa học">
        {studentCourseTypes.map((type) => (
          <button
            key={type.key}
            type="button"
            role="tab"
            aria-selected={activeType === type.key}
            className={activeType === type.key ? 'is-active' : ''}
            onClick={() => {
              setActiveType(type.key)
              setActiveSubject('Tất cả')
              setQuery('')
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      <article className="hl-my-courses-panel">
        <div className="hl-my-courses-toolbar">
          <div className="hl-my-courses-filters" aria-label="Lọc theo môn học">
            {studentCourseSubjects.map((subject) => (
              <button
                key={subject}
                type="button"
                className={activeSubject === subject ? 'is-active' : ''}
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
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
            <h2>{activeTypeLabel}</h2>
            <span>{coursesByType.length} khóa học</span>
          </div>
        </div>

        {hasCoursesInType ? (
          <div className="hl-my-courses-grid">
            {visibleCourses.map((course) => (
              <MyCourseCard key={course.id} course={course} onOpen={onOpenCourse} />
            ))}
            {!visibleCourses.length && (
              <div className="hl-my-courses-empty">
                <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
                <strong>Không tìm thấy khóa học</strong>
                <p>Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="hl-my-courses-empty">
            <img src="/owl-mascot4.png" alt="" aria-hidden="true" />
            <strong>Bạn chưa có khóa học nào trong nhóm này.</strong>
          </div>
        )}
      </article>
    </section>
  )
}

export default MyCourses
