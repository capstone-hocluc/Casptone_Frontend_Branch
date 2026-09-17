import { useState } from 'react'
import { CheckCircle2, ChevronDown, PlayCircle, Sparkles } from 'lucide-react'
import type {
  CourseStudyChapter,
  CourseStudyLesson,
  CourseStudyPhase,
} from '../../services/courseService'
import { formatDuration, prettifyEnum } from '../../lib/courseFormat'
import { getLessonStatusLabel, getLessonStatusTone } from '../../lib/lessonStatus'
import { bySequence } from './studyUtils'
import QuizRow from './QuizRow'

interface LessonRowProps {
  lesson: CourseStudyLesson
  onOpen: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function LessonRow({ lesson, onOpen, onOpenQuiz }: LessonRowProps) {
  const isCompleted = lesson.status === 'COMPLETED'
  const tone = getLessonStatusTone(lesson.status)

  return (
    <div className="hl-study-lesson">
      <button type="button" className="hl-study-lesson-main" onClick={() => onOpen(lesson.id)}>
        <span className="hl-study-lesson-icon">
          {isCompleted ? <CheckCircle2 size={16} /> : <PlayCircle size={16} />}
        </span>
        <span className="hl-study-lesson-title">{lesson.title}</span>
        {lesson.preview && (
          <span className="hl-study-lesson-badge">
            <Sparkles size={11} />
            Học thử
          </span>
        )}
        <span className="hl-study-lesson-meta">
          {lesson.contentType && <span>{prettifyEnum(lesson.contentType)}</span>}
          {Boolean(lesson.durationSeconds) && <span>{formatDuration(lesson.durationSeconds)}</span>}
          <span className={`hl-study-lesson-status is-${tone}`}>
            {getLessonStatusLabel(lesson.status)}
          </span>
        </span>
      </button>

      {lesson.quizzes.length > 0 && (
        <div className="hl-study-lesson-quizzes">
          {lesson.quizzes.map((quiz) => (
            <QuizRow key={quiz.id} quiz={quiz} onOpenQuiz={onOpenQuiz} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ChapterBlockProps {
  chapter: CourseStudyChapter
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function ChapterBlock({ chapter, onOpenLesson, onOpenQuiz }: ChapterBlockProps) {
  const [open, setOpen] = useState(false)
  const lessons = bySequence(chapter.lessons)

  return (
    <div className="hl-study-chapter">
      <button
        type="button"
        className="hl-study-chapter-header"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <ChevronDown size={16} className={open ? 'is-open' : ''} />
        <span className="hl-study-chapter-title">
          {chapter.completed && <CheckCircle2 size={14} className="hl-study-chapter-done" />}
          {chapter.title}
        </span>
        <span className="hl-study-chapter-count">
          {chapter.completedLessonCount}/{chapter.lessonCount} bài học
        </span>
      </button>

      {open && (
        <div className="hl-study-chapter-body">
          {lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onOpen={onOpenLesson}
              onOpenQuiz={onOpenQuiz}
            />
          ))}

          {chapter.quizzes.length > 0 && (
            <div className="hl-study-chapter-quizzes">
              {chapter.quizzes.map((quiz) => (
                <QuizRow key={quiz.id} quiz={quiz} onOpenQuiz={onOpenQuiz} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface StudyCurriculumProps {
  phases: CourseStudyPhase[]
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function StudyCurriculum({ phases, onOpenLesson, onOpenQuiz }: StudyCurriculumProps) {
  const sortedPhases = bySequence(phases)
  const [openPhaseId, setOpenPhaseId] = useState<string | null>(sortedPhases[0]?.id ?? null)

  if (sortedPhases.length === 0) {
    return (
      <section className="hl-study-card">
        <h2>Nội dung khóa học</h2>
        <p className="hl-study-empty-curriculum">Nội dung khóa học đang được cập nhật</p>
      </section>
    )
  }

  return (
    <section className="hl-study-card hl-study-curriculum-card">
      <h2>Nội dung khóa học</h2>
      <div className="hl-study-curriculum">
        {sortedPhases.map((phase) => {
          const isOpen = openPhaseId === phase.id
          return (
            <div className="hl-study-phase" key={phase.id}>
              <button
                type="button"
                className="hl-study-phase-header"
                onClick={() => setOpenPhaseId(isOpen ? null : phase.id)}
                aria-expanded={isOpen}
              >
                <ChevronDown size={18} className={isOpen ? 'is-open' : ''} />
                <div>
                  <span className="hl-study-phase-title">{phase.name}</span>
                  {phase.description && (
                    <span className="hl-study-phase-desc">{phase.description}</span>
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="hl-study-phase-body">
                  {bySequence(phase.sections).map((section) => (
                    <div className="hl-study-section-block" key={section.sectionCourseId}>
                      <div className="hl-study-section-header">
                        <div>
                          <span className="hl-study-section-title">{section.title}</span>
                          {section.categoryName && (
                            <span className="hl-study-section-category">
                              {section.categoryName}
                            </span>
                          )}
                        </div>
                        <div className="hl-study-section-progress">
                          <span>
                            {section.completedLessonCount}/{section.lessonCount} bài học
                          </span>
                          <div className="hl-study-section-bar" aria-hidden="true">
                            <span
                              style={{
                                width: `${Math.max(0, Math.min(100, section.progressPercentage ?? 0))}%`,
                              }}
                            />
                          </div>
                          <strong>
                            {Math.max(0, Math.min(100, section.progressPercentage ?? 0))}%
                          </strong>
                        </div>
                      </div>

                      {bySequence(section.chapters).map((chapter) => (
                        <ChapterBlock
                          key={chapter.id}
                          chapter={chapter}
                          onOpenLesson={onOpenLesson}
                          onOpenQuiz={onOpenQuiz}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default StudyCurriculum
