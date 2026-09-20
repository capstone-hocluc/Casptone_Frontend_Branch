import { useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  PlayCircle,
  Sparkles,
} from 'lucide-react'
import type {
  CourseStudyChapter,
  CourseStudyLesson,
  CourseStudyPhase,
  CourseStudySection,
} from '../../services/courseService'
import { formatDuration, prettifyEnum } from '../../lib/courseFormat'
import { getLessonStatusLabel } from '../../lib/lessonStatus'
import { bySequence, lessonContainsId } from './studyUtils'
import QuizRow from './QuizRow'
import MascotState from '../common/MascotState'

function clampPercent(value?: number) {
  return Math.max(0, Math.min(100, value ?? 0))
}

interface LessonRowProps {
  lesson: CourseStudyLesson
  isCurrent: boolean
  onOpen: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function LessonRow({ lesson, isCurrent, onOpen, onOpenQuiz }: LessonRowProps) {
  const isCompleted = lesson.status === 'COMPLETED'
  const isInProgress = lesson.status === 'IN_PROGRESS'
  const isVideo = lesson.contentType === 'VIDEO'
  const Icon = isVideo ? PlayCircle : FileText
  const kindLabel = isVideo ? 'Video' : prettifyEnum(lesson.contentType) || 'Bài học'
  const duration = lesson.durationSeconds ? formatDuration(lesson.durationSeconds) : ''

  return (
    <>
      <button
        type="button"
        className={`hl-study-item${isCurrent ? ' is-current' : ''}`}
        onClick={() => onOpen(lesson.id)}
      >
        <span className="hl-study-item-icon is-lesson">
          <Icon size={17} />
        </span>
        <span className="hl-study-item-text">
          <span className="hl-study-item-kind">{kindLabel}</span>
          <span className="hl-study-item-title">
            {lesson.title}
            {lesson.preview && (
              <span className="hl-study-preview-tag">
                <Sparkles size={11} />
                Học thử
              </span>
            )}
          </span>
          {duration && <span className="hl-study-item-meta">{duration}</span>}
        </span>
        <span className="hl-study-item-side">
          {isCompleted ? (
            <span className="hl-study-item-status is-done">
              <CheckCircle2 size={14} />
              Đã hoàn thành
            </span>
          ) : isInProgress || isCurrent ? (
            <span className="hl-study-item-status is-current">Đang học</span>
          ) : (
            <span className="hl-study-item-status">{getLessonStatusLabel(lesson.status)}</span>
          )}
          <ChevronRight size={16} className="hl-study-item-chevron" />
        </span>
      </button>

      {lesson.quizzes.map((quiz) => (
        <div className="hl-study-item-nested" key={quiz.id}>
          <QuizRow quiz={quiz} onOpenQuiz={onOpenQuiz} />
        </div>
      ))}
    </>
  )
}

interface ChapterBlockProps {
  chapter: CourseStudyChapter
  currentLessonId: string | null
  defaultOpen: boolean
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function ChapterBlock({
  chapter,
  currentLessonId,
  defaultOpen,
  onOpenLesson,
  onOpenQuiz,
}: ChapterBlockProps) {
  const [open, setOpen] = useState(defaultOpen)
  const lessons = bySequence(chapter.lessons)

  return (
    <div className="hl-study-chapter">
      <button
        type="button"
        className="hl-study-chapter-header"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <ChevronDown size={16} className={open ? '' : 'is-collapsed'} />
        <span className="hl-study-chapter-title">
          {chapter.title}
          {chapter.completed && <CheckCircle2 size={14} className="hl-study-chapter-done" />}
        </span>
        <span className="hl-study-chapter-count">
          {chapter.completedLessonCount}/{chapter.lessonCount}
        </span>
      </button>

      {open && (
        <div className="hl-study-chapter-body">
          {lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              isCurrent={lesson.id === currentLessonId}
              onOpen={onOpenLesson}
              onOpenQuiz={onOpenQuiz}
            />
          ))}
          {chapter.quizzes.map((quiz) => (
            <QuizRow key={quiz.id} quiz={quiz} onOpenQuiz={onOpenQuiz} />
          ))}
        </div>
      )}
    </div>
  )
}

interface SectionBlockProps {
  section: CourseStudySection
  currentLessonId: string | null
  defaultOpen: boolean
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function SectionBlock({
  section,
  currentLessonId,
  defaultOpen,
  onOpenLesson,
  onOpenQuiz,
}: SectionBlockProps) {
  const [open, setOpen] = useState(defaultOpen)
  const chapters = bySequence(section.chapters)
  const percent = clampPercent(section.progressPercentage)
  const currentChapterId = chapters.find((chapter) =>
    lessonContainsId(chapter, currentLessonId)
  )?.id

  return (
    <div className="hl-study-section">
      <button
        type="button"
        className="hl-study-section-header"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <ChevronDown size={18} className={open ? '' : 'is-collapsed'} />
        <span className="hl-study-section-text">
          <span className="hl-study-section-title">{section.title}</span>
          <span className="hl-study-section-sub">
            {section.categoryName ? `${section.categoryName} · ` : ''}
            {section.completedLessonCount}/{section.lessonCount} bài học
          </span>
        </span>
        <span className="hl-study-section-percent">{percent}%</span>
      </button>
      <div className="hl-study-section-bar" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>

      {open && (
        <div className="hl-study-section-body">
          {chapters.map((chapter, index) => (
            <ChapterBlock
              key={chapter.id}
              chapter={chapter}
              currentLessonId={currentLessonId}
              defaultOpen={currentChapterId ? chapter.id === currentChapterId : index === 0}
              onOpenLesson={onOpenLesson}
              onOpenQuiz={onOpenQuiz}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface PhaseBlockProps {
  phase: CourseStudyPhase
  index: number
  currentLessonId: string | null
  defaultOpen: boolean
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function PhaseBlock({
  phase,
  index,
  currentLessonId,
  defaultOpen,
  onOpenLesson,
  onOpenQuiz,
}: PhaseBlockProps) {
  const [open, setOpen] = useState(defaultOpen)
  const sections = bySequence(phase.sections)
  const currentSectionId = sections.find((section) =>
    section.chapters.some((chapter) => lessonContainsId(chapter, currentLessonId))
  )?.sectionCourseId

  // Derived from the sections' real lesson counts - the API has no phase-level figure.
  const totalLessons = sections.reduce((sum, section) => sum + (section.lessonCount ?? 0), 0)
  const doneLessons = sections.reduce(
    (sum, section) => sum + (section.completedLessonCount ?? 0),
    0
  )
  const percent =
    totalLessons > 0 ? clampPercent(Math.round((doneLessons / totalLessons) * 100)) : 0

  return (
    <article className="hl-study-phase">
      <button
        type="button"
        className="hl-study-phase-header"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <ChevronDown size={18} className={open ? '' : 'is-collapsed'} />
        <span className="hl-study-phase-text">
          <span className="hl-study-phase-title">
            <b>{String(index + 1).padStart(2, '0')}</b>
            {phase.name}
          </span>
          {phase.description && <span className="hl-study-phase-desc">{phase.description}</span>}
        </span>
        <span className="hl-study-phase-percent">{percent}%</span>
      </button>
      <div className="hl-study-progress-bar" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>

      {open && (
        <div className="hl-study-phase-body">
          {sections.map((section, sectionIndex) => (
            <SectionBlock
              key={section.sectionCourseId}
              section={section}
              currentLessonId={currentLessonId}
              defaultOpen={
                currentSectionId ? section.sectionCourseId === currentSectionId : sectionIndex === 0
              }
              onOpenLesson={onOpenLesson}
              onOpenQuiz={onOpenQuiz}
            />
          ))}
        </div>
      )}
    </article>
  )
}

interface StudyCurriculumProps {
  phases: CourseStudyPhase[]
  currentLessonId: string | null
  onOpenLesson: (lessonId: string) => void
  onOpenQuiz: (quizId: string) => void
}

function StudyCurriculum({
  phases,
  currentLessonId,
  onOpenLesson,
  onOpenQuiz,
}: StudyCurriculumProps) {
  const sortedPhases = bySequence(phases)
  const currentPhaseId = sortedPhases.find((phase) =>
    phase.sections.some((section) =>
      section.chapters.some((chapter) => lessonContainsId(chapter, currentLessonId))
    )
  )?.id

  return (
    <section className="hl-study-curriculum">
      {sortedPhases.length === 0 ? (
        <MascotState
          title="Nội dung khóa học đang được cập nhật"
          message="Nội dung học sẽ sớm xuất hiện tại đây."
        />
      ) : (
        <div className="hl-study-phase-list">
          {sortedPhases.map((phase, index) => (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              index={index}
              currentLessonId={currentLessonId}
              defaultOpen={currentPhaseId ? phase.id === currentPhaseId : index === 0}
              onOpenLesson={onOpenLesson}
              onOpenQuiz={onOpenQuiz}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default StudyCurriculum
