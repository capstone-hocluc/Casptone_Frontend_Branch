import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowRight, BookOpen, RefreshCw } from 'lucide-react'
import { getMainCourses, type Course } from '../../services/courseService'
import Button from '../ui/Button'
import StatCard from '../ui/StatCard'

interface ManagerOverviewProps {
  onNavigate: (page: string) => void
}

function ManagerOverview({ onNavigate }: ManagerOverviewProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const handleReload = () => {
    setLoading(true)
    setError('')
    setReloadKey((current) => current + 1)
  }

  useEffect(() => {
    let active = true

    getMainCourses()
      .then((response) => {
        if (active) setCourses(response.data ?? [])
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Không thể tải dữ liệu khóa học.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const summary = useMemo(
    () => ({
      total: courses.length,
      free: courses.filter((course) => course.price === 0).length,
      paid: courses.filter((course) => course.price !== undefined && course.price > 0).length,
    }),
    [courses]
  )

  return (
    <section className="space-y-5" aria-busy={loading}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-text-muted">Tổng quan các khóa học đang được mở trên hệ thống.</p>
        </div>
        <Button
          variant="primary"
          appearance="outline"
          size="sm"
          onClick={handleReload}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : undefined} />
          Làm mới
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Khóa học đang mở" value={loading ? '—' : summary.total} />
        <StatCard label="Khóa học miễn phí" value={loading ? '—' : summary.free} />
        <StatCard label="Khóa học có học phí" value={loading ? '—' : summary.paid} />
      </div>

      {error ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-badge-danger-bg px-3 py-2 text-sm text-badge-danger-text"
          role="alert"
        >
          <span className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </span>
          <Button
            variant="danger"
            appearance="ghost"
            size="sm"
            onClick={handleReload}
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-badge-info-bg text-primary">
              <BookOpen size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-text-heading">Quản lý khóa học</h2>
              <p className="mt-1 text-sm text-text-muted">
                Xem catalog thật; chức năng tạo và chỉnh sửa đang chờ backend cung cấp API.
              </p>
            </div>
          </div>
          <Button variant="primary" appearance="outline" size="sm" onClick={() => onNavigate('courses')}>
            Mở danh sách
            <ArrowRight size={15} />
          </Button>
        </div>
      )}
    </section>
  )
}

export default ManagerOverview
