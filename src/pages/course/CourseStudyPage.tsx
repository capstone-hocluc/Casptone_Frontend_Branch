import { useEffect, useState } from 'react'
import MascotState from '../../components/common/MascotState'
import CourseOverview from '../../components/student/course/CourseOverview'
import NextLiveClassCard from '../../components/student/course/NextLiveClassCard'
import StudyGroupCard from '../../components/student/course/StudyGroupCard'
import StudyCurriculum from '../../components/student/course/StudyCurriculum'
import CourseLiveClassesTab from '../../components/student/course/CourseLiveClassesTab'
import CourseEnrollmentPlanTab from '../../components/student/course/CourseEnrollmentPlanTab'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Skeleton from '../../components/ui/Skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs'
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
    <StudentPageContainer className="pb-8">
      {status === 'loading' && (
        <div className="flex flex-col gap-5">
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-10 w-[420px] max-w-full" />
          <Skeleton className="h-80" />
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
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as StudyTab)}
          className="flex flex-col gap-5"
        >
          <CourseOverview study={study} onBack={onBackToMyCourses} onOpenLesson={onOpenLesson} />

          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="content" className="flex flex-col gap-5">
            {(study.nextLiveClass || study.activeStudyGroupName) && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
                {study.nextLiveClass && <NextLiveClassCard liveClass={study.nextLiveClass} />}
                {study.activeStudyGroupName && <StudyGroupCard name={study.activeStudyGroupName} />}
              </div>
            )}
            <StudyCurriculum
              phases={study.phases}
              currentLessonId={study.continueLessonId}
              onOpenLesson={onOpenLesson}
              onOpenQuiz={onOpenQuiz}
            />
          </TabsContent>

          <TabsContent value="live">
            <CourseLiveClassesTab courseId={courseId} />
          </TabsContent>

          <TabsContent value="plan">
            <CourseEnrollmentPlanTab courseId={courseId} onOpenCourse={onOpenCourse} />
          </TabsContent>
        </Tabs>
      )}
    </StudentPageContainer>
  )
}

export default CourseStudyPage
