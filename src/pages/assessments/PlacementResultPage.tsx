import { useEffect, useState } from 'react'
import { AlertTriangle, Eye } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import PlacementResultSummary from '../../components/assessment/PlacementResultSummary'
import CourseCard from '../../components/landing/CourseCard'
import {
  getPlacementAttemptHistory,
  getPlacementResult,
  type PlacementResult,
} from '../../services/assessmentService'
import { getSuggestedCourses, type Course } from '../../services/courseService'
import { getErrorMessage } from '../../lib/errors'

interface PlacementResultPageProps {
  onOpenReview: (attemptId: string) => void
  onOpenCourse: (course: Course) => void
}

function PlacementResultPage({ onOpenReview, onOpenCourse }: PlacementResultPageProps) {
  const [result, setResult] = useState<PlacementResult | null>(null)
  const [latestAttemptId, setLatestAttemptId] = useState<string | null>(null)
  const [suggestedCourses, setSuggestedCourses] = useState<Course[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getPlacementResult(),
      // The result contract has no attemptId of its own - the most recently
      // submitted placement attempt (from the confirmed history endpoint) is
      // used to link to Review instead of guessing that result.id means
      // something it isn't confirmed to mean.
      getPlacementAttemptHistory(),
      getSuggestedCourses().catch(() => ({ data: [] as Course[] })),
    ])
      .then(([resultData, history, suggestedResponse]) => {
        if (cancelled) return
        setResult(resultData)
        const submitted = history
          .filter((attempt) => attempt.status !== 'IN_PROGRESS')
          .sort((a, b) => {
            const aTime = new Date(a.submittedAt || a.startedAt).getTime()
            const bTime = new Date(b.submittedAt || b.startedAt).getTime()
            return bTime - aTime
          })
        setLatestAttemptId(submitted[0]?.attemptId || null)
        setSuggestedCourses(suggestedResponse.data || [])
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

  return (
    <div className="hl-quiz-page">
      <Navbar />
      <main className="hl-quiz-main-wrap">
        <div className="hl-quiz-container">
          {status === 'loading' && (
            <div className="hl-quiz-attempt-grid">
              <div className="hl-quiz-skeleton" style={{ height: 220 }} />
              <div className="hl-quiz-skeleton" style={{ height: 220 }} />
            </div>
          )}

          {status === 'error' && (
            <div className="hl-quiz-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải kết quả bài kiểm tra đầu vào.'}</p>
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

          {status === 'ready' && result && (
            <div className="hl-quiz-grid">
              <PlacementResultSummary result={result} />

              {latestAttemptId && (
                <button
                  type="button"
                  className="hl-quiz-start-cta"
                  onClick={() => onOpenReview(latestAttemptId)}
                >
                  <Eye size={16} />
                  Xem lại đáp án
                </button>
              )}

              {suggestedCourses.length > 0 && (
                <section className="hl-quiz-card">
                  <h2>Khóa học đề xuất cho bạn</h2>
                  <div className="hl-catalog-grid hl-placement-suggested-grid">
                    {suggestedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} onOpen={onOpenCourse} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default PlacementResultPage
