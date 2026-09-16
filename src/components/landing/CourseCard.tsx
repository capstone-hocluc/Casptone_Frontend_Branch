import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react'
import type { Course } from '../../services/courseService'

function prettifyEnum(value?: string) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('vi-VN')
}

function formatPrice(price?: number) {
  if (!price) return 'Miễn phí'
  return `${price.toLocaleString('vi-VN')} ₫`
}

interface CourseCardProps {
  course: Course
  onOpen: (course: Course) => void
}

function CourseCard({ course, onOpen }: CourseCardProps) {
  const badgeLabel = prettifyEnum(course.targetExam) || prettifyEnum(course.track) || 'Khóa học'
  const startLabel = formatDate(course.startDate)

  return (
    <button type="button" className="hl-catalog-card" onClick={() => onOpen(course)}>
      <div className="hl-catalog-cover">
        {course.recommended && (
          <span className="hl-catalog-badge-recommended">
            <Sparkles size={12} />
            Đề xuất
          </span>
        )}
        <BookOpen size={34} />
        <span>{badgeLabel}</span>
      </div>

      <div className="hl-catalog-body">
        <div>
          <div className="hl-catalog-tags">
            <span className="hl-catalog-subject">{badgeLabel}</span>
            {course.purchased && (
              <span className="hl-catalog-badge-owned">
                <CheckCircle2 size={12} />
                Đã đăng ký
              </span>
            )}
          </div>
          <h3>{course.title}</h3>
          <p>{course.description || 'Chưa có mô tả cho khóa học này.'}</p>
        </div>

        {startLabel && (
          <div className="hl-catalog-meta">
            <span>Khai giảng: {startLabel}</span>
          </div>
        )}

        <div className="hl-catalog-footer">
          <span className="hl-catalog-price">{formatPrice(course.price)}</span>
          {course.purchased ? (
            <span className="hl-catalog-cta is-owned">
              Vào học
              <ArrowRight size={15} />
            </span>
          ) : (
            <span className="hl-catalog-cta">
              Xem khóa học
              <ArrowRight size={15} />
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default CourseCard
