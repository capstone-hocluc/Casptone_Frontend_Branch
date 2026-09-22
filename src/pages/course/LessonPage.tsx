import { useRef, useState } from 'react'
import LessonBreadcrumb from '../../components/lesson/LessonBreadcrumb'
import LessonContent from '../../components/lesson/LessonContent'
import LessonInfoCard from '../../components/lesson/LessonInfoCard'
import LessonNavFooter from '../../components/lesson/LessonNavFooter'
import LessonQuizzes from '../../components/lesson/LessonQuizzes'
import ResourceState from '../../components/student/common/ResourceState'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Skeleton from '../../components/ui/Skeleton'
import { usePageResource } from '../../hooks/usePageResource'
import { getLesson, updateLessonProgress } from '../../services/lessonService'
import { getErrorMessage } from '../../lib/errors'
import { showErrorToast, showSuccessToast } from '../../lib/toastBus'

interface LessonPageProps {
  courseId: string | null
  lessonId: string
  onBackToStudy: () => void
  onNavigateLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function LessonPage({ lessonId, onBackToStudy, onNavigateLesson, onOpenQuiz }: LessonPageProps) {
  const [completing, setCompleting] = useState(false)

  const watchSecondsRef = useRef(0)
  const {
    data: lesson,
    setData: setLesson,
    status,
    errorMessage,
    reload,
  } = usePageResource(() => getLesson(lessonId), [lessonId], {
    onLoaded: (data) => {
      watchSecondsRef.current = Math.max(0, data.progress?.watchDurationSeconds ?? 0)
    },
  })

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const savingRef = useRef(false)

  const clampWatchSeconds = () => {
    let seconds = Math.max(0, Math.floor(watchSecondsRef.current))
    if (lesson?.durationSeconds && lesson.durationSeconds > 0) {
      seconds = Math.min(seconds, lesson.durationSeconds)
    }
    return seconds
  }

  // Fire-and-forget checkpoint save (video pause, leaving the lesson). Never
  // sent on every timeupdate tick - only at these controlled moments.
  const saveProgress = async (completed: boolean) => {
    if (!lesson || !lesson.owned || savingRef.current) return null
    savingRef.current = true
    try {
      const updated = await updateLessonProgress(lesson.id, {
        completed,
        watchDurationSeconds: clampWatchSeconds(),
      })
      setLesson((prev) => (prev ? { ...prev, progress: updated } : prev))
      return updated
    } catch (error) {
      showErrorToast(getErrorMessage(error))
      return null
    } finally {
      savingRef.current = false
    }
  }

  const handleTimeUpdate = () => {
    const current = videoRef.current?.currentTime ?? 0
    watchSecondsRef.current = Math.max(watchSecondsRef.current, Math.floor(current))
  }

  const handlePause = () => {
    void saveProgress(false)
  }

  const handleMarkComplete = async () => {
    if (completing) return
    setCompleting(true)
    const updated = await saveProgress(true)
    setCompleting(false)
    if (updated) showSuccessToast('Đã đánh dấu hoàn thành bài học.')
  }

  const goToLesson = (targetLessonId: string) => {
    void saveProgress(false)
    onNavigateLesson(targetLessonId)
  }

  const goBackToStudy = () => {
    void saveProgress(false)
    onBackToStudy()
  }

  return (
    <StudentPageContainer width="narrow" className="pb-8">
      <ResourceState
        status={status}
        errorMessage={errorMessage}
        onRetry={reload}
        loading={
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-[260px] max-w-full" />
            <Skeleton className="h-[360px]" />
            <Skeleton className="h-[120px]" />
          </div>
        }
        forbidden={{
          title: 'Chưa thể truy cập bài học',
          message: 'Bạn chưa có quyền truy cập bài học này.',
          actionLabel: 'Quay lại khóa học',
          onAction: onBackToStudy,
        }}
        notFound={{
          title: 'Không tìm thấy bài học',
          message: 'Bài học này không tồn tại hoặc đã bị gỡ.',
          actionLabel: 'Quay lại khóa học',
          onAction: onBackToStudy,
        }}
        error={{ title: 'Không thể tải bài học' }}
      />

      {status === 'ready' && lesson && (
        <div className="flex flex-col gap-4">
          <LessonBreadcrumb lesson={lesson} onBack={goBackToStudy} />
          <LessonContent
            lesson={lesson}
            videoRef={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
          />
          <LessonInfoCard
            lesson={lesson}
            completing={completing}
            onMarkComplete={handleMarkComplete}
          />
          <LessonQuizzes quizzes={lesson.quizzes} onOpenQuiz={onOpenQuiz} />
          <LessonNavFooter
            previousLessonId={lesson.previousLessonId}
            nextLessonId={lesson.nextLessonId}
            onNavigate={goToLesson}
          />
        </div>
      )}
    </StudentPageContainer>
  )
}

export default LessonPage
