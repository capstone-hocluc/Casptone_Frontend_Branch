import { useEffect, useState } from 'react'
import MascotState from '../../components/common/MascotState'
import StudyHeader from '../../components/study/StudyHeader'
import NextLiveClassCard from '../../components/study/NextLiveClassCard'
import StudyGroupCard from '../../components/study/StudyGroupCard'
import StudyCurriculum from '../../components/study/StudyCurriculum'
import StudyLiveClassesTab from '../../components/study/StudyLiveClassesTab'
import StudyEnrollmentPlanTab from '../../components/study/StudyEnrollmentPlanTab'
import { getCourseStudy, type Course, type CourseStudy } from '../../services/courseService'
import { getErrorMessage } from '../../lib/errors'
import { ApiError } from '../../lib/api'

interface CourseStudyPageProps {
  courseId: string
  onBackToMyCourses: () => void
  onViewCourseInfo: () => void
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
  onOpenCourse: (course: Course) => void
}

type StudyTab = 'content' | 'live' | 'plan'

const TABS: { key: StudyTab; label: string }[] = [
  { key: 'content', label: 'Nội dung học' },
  { key: 'live', label: 'Lớp học trực tuyến' },
  { key: 'plan', label: 'Lộ trình học' },
]

// Rendered inside StudentLayout (header + sidebar come from the layout).
function CourseStudyPage({
  courseId,
  onBackToMyCourses,
  onViewCourseInfo,
  onOpenLesson,
  onOpenQuiz,
  onOpenCourse,
}: CourseStudyPageProps) {
  const [study, setStudy] = useState<CourseStudy | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'forbidden' | 'not-found'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [activeTab, setActiveTab] = useState<StudyTab>('content')

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
    <section className="hl-student-page hl-study-page">
      {status === 'loading' && (
        <div className="hl-study-grid">
          <div className="hl-study-skeleton" style={{ height: 150 }} />
          <div className="hl-study-skeleton" style={{ height: 40, width: 420 }} />
          <div className="hl-study-skeleton" style={{ height: 320 }} />
        </div>
      )}

      {status === 'forbidden' && (
        <MascotState
          title="Chưa thể truy cập khóa học"
          message="Bạn chưa có quyền truy cập khóa học này."
          actionLabel="Xem thông tin khóa học"
          onAction={onViewCourseInfo}
        />
      )}

      {status === 'not-found' && (
        <MascotState
          title="Không tìm thấy khóa học"
          message="Khóa học này không tồn tại hoặc đã bị gỡ."
          actionLabel="Quay lại Khóa học của tôi"
          onAction={onBackToMyCourses}
        />
      )}

      {status === 'error' && (
        <MascotState
          title="Không thể tải nội dung khóa học"
          message={errorMessage}
          actionLabel="Thử lại"
          onAction={() => {
            setStatus('loading')
            setReloadKey((current) => current + 1)
          }}
        />
      )}

      {status === 'ready' && study && (
        <div className="hl-study-grid">
          <StudyHeader study={study} onBack={onBackToMyCourses} onOpenLesson={onOpenLesson} />

          <div className="hl-study-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`hl-study-tab-btn${activeTab === tab.key ? ' is-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'content' && (
            <>
              {(study.nextLiveClass || study.activeStudyGroupName) && (
                <div className="hl-study-info-row">
                  {study.nextLiveClass && <NextLiveClassCard liveClass={study.nextLiveClass} />}
                  {study.activeStudyGroupName && (
                    <StudyGroupCard name={study.activeStudyGroupName} />
                  )}
                </div>
              )}
              <StudyCurriculum
                phases={study.phases}
                currentLessonId={study.continueLessonId}
                onOpenLesson={onOpenLesson}
                onOpenQuiz={onOpenQuiz}
              />
            </>
          )}

          {activeTab === 'live' && <StudyLiveClassesTab courseId={courseId} />}

          {activeTab === 'plan' && (
            <StudyEnrollmentPlanTab courseId={courseId} onOpenCourse={onOpenCourse} />
          )}
        </div>
      )}
    </section>
  )
}

export default CourseStudyPage
