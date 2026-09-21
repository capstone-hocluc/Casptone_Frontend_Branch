import { useState } from 'react'
import CourseOverview from '../../components/student/course/CourseOverview'
import NextLiveClassCard from '../../components/student/course/NextLiveClassCard'
import StudyGroupCard from '../../components/student/course/StudyGroupCard'
import StudyCurriculum from '../../components/student/course/StudyCurriculum'
import CourseLiveClassesTab from '../../components/student/course/CourseLiveClassesTab'
import CourseEnrollmentPlanTab from '../../components/student/course/CourseEnrollmentPlanTab'
import ResourceState from '../../components/student/common/ResourceState'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Skeleton from '../../components/ui/Skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs'
import { usePageResource } from '../../hooks/usePageResource'
import { getCourseStudy, type Course } from '../../services/courseService'

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
  const {
    data: study,
    status,
    errorMessage,
    reload,
  } = usePageResource(() => getCourseStudy(courseId), [courseId])
  const [activeTab, setActiveTab] = useState<StudyTab>('content')

  return (
    <StudentPageContainer className="pb-8">
      <ResourceState
        status={status}
        errorMessage={errorMessage}
        onRetry={reload}
        loading={
          <div className="flex flex-col gap-5">
            <Skeleton className="h-[150px]" />
            <Skeleton className="h-10 w-[420px] max-w-full" />
            <Skeleton className="h-80" />
          </div>
        }
        forbidden={{
          title: 'Chưa thể truy cập khóa học',
          message: 'Bạn chưa có quyền truy cập khóa học này.',
          actionLabel: 'Xem thông tin khóa học',
          onAction: onViewCourseInfo,
        }}
        notFound={{
          title: 'Không tìm thấy khóa học',
          message: 'Khóa học này không tồn tại hoặc đã bị gỡ.',
          actionLabel: 'Quay lại Khóa học của tôi',
          onAction: onBackToMyCourses,
        }}
        error={{ title: 'Không thể tải nội dung khóa học' }}
      />

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
