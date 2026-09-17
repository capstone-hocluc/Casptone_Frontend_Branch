import { useEffect, useState } from 'react'
import { AlertTriangle, Lock, SearchX } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Chatbot from '../../components/landing/Chatbot'
import StudyHeader from '../../components/study/StudyHeader'
import StudyProgressCard from '../../components/study/StudyProgressCard'
import ContinueLearningCard from '../../components/study/ContinueLearningCard'
import NextLiveClassCard from '../../components/study/NextLiveClassCard'
import StudyGroupCard from '../../components/study/StudyGroupCard'
import StudyCurriculum from '../../components/study/StudyCurriculum'
import { getCourseStudy, type CourseStudy } from '../../services/courseService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'

interface CourseStudyPageProps {
  courseId: string
  onBackToCourseDetail: () => void
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function CourseStudyPage({
  courseId,
  onBackToCourseDetail,
  onOpenLesson,
  onOpenQuiz,
}: CourseStudyPageProps) {
  const [study, setStudy] = useState<CourseStudy | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'forbidden' | 'not-found'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getCourseStudy(courseId)
      .then((data) => {
        if (cancelled) return
        setStudy(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 403) {
          setStatus('forbidden')
          return
        }
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

  return (
    <div className="hl-study-page">
      <Navbar />
      <main className="hl-study-main-wrap">
        <div className="hl-study-container">
          {status === 'loading' && (
            <div className="hl-study-grid">
              <div className="hl-study-skeleton" style={{ height: 100 }} />
              <div className="hl-study-skeleton" style={{ height: 80 }} />
              <div className="hl-study-skeleton" style={{ height: 320 }} />
            </div>
          )}

          {status === 'forbidden' && (
            <div className="hl-study-state">
              <Lock size={30} />
              <p>Bạn chưa có quyền truy cập khóa học này.</p>
              <button type="button" onClick={onBackToCourseDetail}>
                Xem thông tin khóa học
              </button>
            </div>
          )}

          {status === 'not-found' && (
            <div className="hl-study-state">
              <SearchX size={30} />
              <p>Không tìm thấy khóa học.</p>
              <button type="button" onClick={onBackToCourseDetail}>
                Xem thông tin khóa học
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="hl-study-state">
              <AlertTriangle size={30} />
              <p>{errorMessage || 'Không thể tải nội dung khóa học.'}</p>
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

          {status === 'ready' && study && (
            <div className="hl-study-grid">
              <StudyHeader study={study} />
              <StudyProgressCard study={study} />
              <ContinueLearningCard study={study} onOpenLesson={onOpenLesson} />
              {study.nextLiveClass && <NextLiveClassCard liveClass={study.nextLiveClass} />}
              {study.activeStudyGroupName && (
                <StudyGroupCard name={study.activeStudyGroupName} />
              )}
              <StudyCurriculum
                phases={study.phases}
                onOpenLesson={onOpenLesson}
                onOpenQuiz={onOpenQuiz}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default CourseStudyPage
