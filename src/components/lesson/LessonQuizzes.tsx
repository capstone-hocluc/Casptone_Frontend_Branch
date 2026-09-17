import type { LessonQuiz } from '../../services/lessonService'
import { getLessonQuizLockMessage } from '../../lib/quizLock'
import QuizRow from '../study/QuizRow'

interface LessonQuizzesProps {
  quizzes: LessonQuiz[]
  onOpenQuiz: (quizId: string) => void
}

function LessonQuizzes({ quizzes, onOpenQuiz }: LessonQuizzesProps) {
  if (quizzes.length === 0) return null

  return (
    <section className="hl-lesson-card">
      <h2>Bài kiểm tra</h2>
      <div className="hl-lesson-quizzes">
        {quizzes.map((quiz) => (
          <QuizRow
            key={quiz.id}
            quiz={quiz}
            lockMessage={quiz.locked ? getLessonQuizLockMessage(quiz.lockReason) : undefined}
            onOpenQuiz={onOpenQuiz}
          />
        ))}
      </div>
    </section>
  )
}

export default LessonQuizzes
