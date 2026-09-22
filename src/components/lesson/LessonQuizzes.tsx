import type { LessonQuiz } from '../../services/lessonService'
import { getLessonQuizLockMessage } from '../../lib/quizLock'
import Card, { CardTitle } from '../ui/Card'
import QuizRow from '../student/course/QuizRow'

interface LessonQuizzesProps {
  quizzes: LessonQuiz[]
  onOpenQuiz: (quizId: string) => void
}

function LessonQuizzes({ quizzes, onOpenQuiz }: LessonQuizzesProps) {
  if (quizzes.length === 0) return null

  return (
    <Card as="section" padding="none" className="px-5 py-[18px]">
      <CardTitle className="mb-3.5">Bài kiểm tra</CardTitle>
      <div className="flex flex-col gap-2">
        {quizzes.map((quiz) => (
          <QuizRow
            key={quiz.id}
            quiz={quiz}
            lockMessage={quiz.locked ? getLessonQuizLockMessage(quiz.lockReason) : undefined}
            onOpenQuiz={onOpenQuiz}
          />
        ))}
      </div>
    </Card>
  )
}

export default LessonQuizzes
