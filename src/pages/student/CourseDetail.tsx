import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleAlert,
  ClipboardCheck,
  GraduationCap,
  Lock,
  Play,
  Radio,
  Target,
} from 'lucide-react'
import { getActivityRouteType, getStudentCourseDetail } from '../../data/courseLookup'
import { useTransientMessage } from '../../hooks/useTransientMessage'
import StudentToast from '../../components/student/common/StudentToast'
import MascotState from '../../components/common/MascotState'
import StudentPageContainer from '../../components/student/layout/StudentPageContainer'
import Card from '../../components/ui/Card'

const activityIcons = {
  Video: Play,
  'Bài tập': ClipboardCheck,
  'Mini Test': Target,
  'Mock Test': Target,
  'Buổi giải đề': Radio,
}

const statusMeta = {
  completed: { label: 'Đã hoàn thành', icon: CheckCircle2 },
  'in-progress': { label: 'Đang học', icon: Play },
  'not-started': { label: 'Chưa làm', icon: Circle },
  locked: { label: 'Đang khóa', icon: Lock },
  overdue: { label: 'Quá hạn', icon: CircleAlert },
}

function ProgressLine({ value }) {
  return (
    <div className="hl-course-detail-progress-line" aria-hidden="true">
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

function getActivityClass(type) {
  return type
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getActivityMeta(activity) {
  return [
    activity.questionCount ? `${activity.questionCount} câu` : '',
    activity.duration || '',
    activity.deadline ? `Hạn ${activity.deadline}` : '',
    activity.instructor ? `Giảng viên ${activity.instructor}` : '',
    activity.date ? `${activity.date}${activity.time ? ` · ${activity.time}` : ''}` : '',
  ].filter(Boolean)
}

function getActivityMessage(activity) {
  if (activity.status === 'locked') return 'Nội dung này đang được khóa theo lộ trình học.'
  if (activity.type === 'Video') return 'Trình phát video đang được phát triển.'
  if (activity.type === 'Buổi giải đề') return 'Buổi giải đề đang được chuẩn bị.'
  if (activity.type === 'Bài tập') return 'Bài tập sẽ được mở ở bước tiếp theo.'
  if (activity.type === 'Mini Test' || activity.type === 'Mock Test')
    return 'Chức năng làm bài đang được phát triển.'
  return 'Tính năng này đang được phát triển.'
}

function ActivityRow({ activity, onAction, onOpenActivity }) {
  const Icon = activityIcons[activity.type] || BookOpen
  const StatusIcon = statusMeta[activity.status]?.icon || Circle
  const meta = getActivityMeta(activity)
  const isCurrent = activity.status === 'in-progress'

  return (
    <button
      type="button"
      className={`hl-course-detail-activity is-${activity.status} is-type-${getActivityClass(activity.type)}`}
      onClick={() => {
        if (activity.status === 'locked') {
          onAction('Bạn cần hoàn thành nội dung trước đó để mở khóa.')
          return
        }

        if (!getActivityRouteType(activity)) {
          onAction(getActivityMessage(activity))
          return
        }

        onOpenActivity(activity)
      }}
    >
      <span className="hl-course-detail-activity-icon">
        <Icon size={15} />
      </span>
      <span className="hl-course-detail-activity-copy">
        <small>{activity.type}</small>
        <strong>{activity.title}</strong>
        {meta.length > 0 && <em>{meta.join(' · ')}</em>}
      </span>
      <span className="hl-course-detail-activity-state">
        {activity.score && <b>{activity.score}</b>}
        <i>
          <StatusIcon size={14} />
          {statusMeta[activity.status]?.label || activity.status}
        </i>
        {isCurrent && <mark>Đang học</mark>}
      </span>
      {activity.status !== 'locked' && getActivityRouteType(activity) && (
        <ChevronRight className="hl-course-detail-activity-next" size={16} />
      )}
    </button>
  )
}

function ChapterAccordion({ chapter, index, open, onToggle, onAction, onOpenActivity }) {
  return (
    <article className="hl-course-detail-chapter">
      <button
        type="button"
        className="hl-course-detail-chapter-head"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>
          <ChevronDown size={16} />
          {String(index + 1).padStart(2, '0')} · {chapter.title.replace(/^Chương \d+ - /, '')}
        </span>
        <strong>
          {chapter.completed}/{chapter.total}
        </strong>
      </button>
      {open && (
        <div className="hl-course-detail-activity-list">
          {chapter.activities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              onAction={onAction}
              onOpenActivity={onOpenActivity}
            />
          ))}
        </div>
      )}
    </article>
  )
}

function CurriculumSection({ section, index, openState, toggle, onAction, onOpenActivity }) {
  const sectionOpen = openState.sections.includes(section.id)

  return (
    <article className="hl-course-detail-accordion">
      <button
        type="button"
        className="hl-course-detail-accordion-head"
        aria-expanded={sectionOpen}
        onClick={() => toggle('sections', section.id)}
      >
        <div>
          <span>
            <ChevronDown size={17} />
            <b>{String(index + 1).padStart(2, '0')}</b>
            {section.title.replace(/^Phần \d+ - /, 'PHẦN ' + (index + 1) + ' · ').toUpperCase()}
          </span>
          <small>{section.summary}</small>
        </div>
        <strong>{section.progress}%</strong>
      </button>
      <ProgressLine value={section.progress} />

      {sectionOpen && (
        <div className="hl-course-detail-group-list">
          {section.groups.map((group) => {
            const groupOpen = openState.groups.includes(group.id)
            return (
              <article key={group.id} className="hl-course-detail-group">
                <button
                  type="button"
                  className="hl-course-detail-group-head"
                  aria-expanded={groupOpen}
                  onClick={() => toggle('groups', group.id)}
                >
                  <div>
                    <span>
                      <ChevronDown size={16} />
                      {group.title}
                    </span>
                    <small>{group.questionCount} câu</small>
                  </div>
                  <strong>{group.progress}%</strong>
                </button>
                <ProgressLine value={group.progress} />

                {groupOpen && (
                  <div className="hl-course-detail-chapter-list">
                    {group.chapters.map((chapter, chapterIndex) => (
                      <ChapterAccordion
                        key={chapter.id}
                        chapter={chapter}
                        index={chapterIndex}
                        open={openState.chapters.includes(chapter.id)}
                        onToggle={() => toggle('chapters', chapter.id)}
                        onAction={onAction}
                        onOpenActivity={onOpenActivity}
                      />
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </article>
  )
}

function FullMockTests({ course, open, onToggle, onAction, onOpenActivity }) {
  return (
    <article className="hl-course-detail-accordion hl-course-detail-full-mock">
      <button
        type="button"
        className="hl-course-detail-accordion-head"
        aria-expanded={open}
        onClick={onToggle}
      >
        <div>
          <span>
            <ChevronDown size={17} />
            <b>04</b>
            LUYỆN ĐỀ TỔNG HỢP
          </span>
          <small>Full ĐGNL Mock Tests</small>
        </div>
        <strong>
          {course.fullMockTests.filter((item) => item.status === 'completed').length}/
          {course.fullMockTests.length}
        </strong>
      </button>
      {open && (
        <div className="hl-course-detail-activity-list">
          {course.fullMockTests.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              onAction={onAction}
              onOpenActivity={onOpenActivity}
            />
          ))}
        </div>
      )}
    </article>
  )
}

function SupplementaryCurriculum({ course, openState, toggle, onAction, onOpenActivity }) {
  return (
    <>
      {course.chapters.map((chapter, index) => (
        <article
          key={chapter.id}
          className="hl-course-detail-accordion hl-course-detail-supp-chapter"
        >
          <ChapterAccordion
            chapter={chapter}
            index={index}
            open={openState.chapters.includes(chapter.id)}
            onToggle={() => toggle('chapters', chapter.id)}
            onAction={onAction}
            onOpenActivity={onOpenActivity}
          />
          <ProgressLine value={chapter.progress} />
        </article>
      ))}
      <article className="hl-course-detail-accordion hl-course-detail-full-mock">
        <button
          type="button"
          className="hl-course-detail-accordion-head"
          aria-expanded={openState.finalTest}
          onClick={() => toggle('finalTest')}
        >
          <div>
            <span>
              <ChevronDown size={17} />
              <b>{String(course.chapters.length + 1).padStart(2, '0')}</b>
              MOCK TEST
            </span>
            <small>
              {course.finalTest.questionCount} câu · {course.finalTest.duration}
            </small>
          </div>
          <strong>{course.finalTest.status === 'completed' ? '1/1' : '0/1'}</strong>
        </button>
        {openState.finalTest && (
          <div className="hl-course-detail-activity-list">
            <ActivityRow
              activity={course.finalTest}
              onAction={onAction}
              onOpenActivity={onOpenActivity}
            />
          </div>
        )}
      </article>
    </>
  )
}

function CourseDetail({ courseId, onBack, onOpenActivity }) {
  const courseEntry = getStudentCourseDetail(courseId)
  const currentChapterId =
    courseEntry?.kind === 'supplementary' ? courseEntry.data.currentChapterId : 'reading-vietnamese'
  const [openState, setOpenState] = useState(() => ({
    sections: ['part-language'],
    groups: ['vietnamese'],
    chapters: [currentChapterId],
    fullMock: false,
    finalTest: false,
  }))
  const { message, show: showMessage } = useTransientMessage(2400)
  const course = courseEntry?.data || null
  const isSupplementary = courseEntry?.kind === 'supplementary'


  const openActivity = (activity) => {
    const routeType = getActivityRouteType(activity)
    if (!routeType) {
      showMessage(getActivityMessage(activity))
      return
    }

    onOpenActivity?.(course.id, routeType, activity.id)
  }

  const toggle = (level, id) => {
    if (level === 'finalTest') {
      setOpenState((current) => ({ ...current, finalTest: !current.finalTest }))
      return
    }

    setOpenState((current) => ({
      ...current,
      [level]: current[level].includes(id)
        ? current[level].filter((item) => item !== id)
        : [...current[level], id],
    }))
  }

  if (!course) {
    return (
      <StudentPageContainer>
        <Card padding="lg" radius="xl">
          <MascotState
            title="Không tìm thấy khóa học"
            message="Khóa học này không tồn tại hoặc chưa được thêm vào."
            actionLabel="Quay lại Khóa học của tôi"
            onAction={onBack}
          />
        </Card>
      </StudentPageContainer>
    )
  }

  return (
    <section className="hl-student-page hl-course-detail-page">
      <header className="hl-course-detail-hero">
        <button type="button" className="hl-course-detail-back" onClick={onBack}>
          <ArrowLeft size={17} />
          Khóa học của tôi
        </button>
        <div className="hl-course-detail-hero-grid">
          <div>
            <span className="hl-course-detail-badge">{course.subject || 'ĐGNL'}</span>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="hl-course-detail-meta">
              <span>
                <GraduationCap size={16} />
                Giảng viên: {course.instructor}
              </span>
              <span>
                <BookOpen size={16} />
                {course.totalContent || course.totalLessons} nội dung học
              </span>
            </div>
          </div>
          <div className="hl-course-detail-hero-action">
            <span>Tiến độ khóa học</span>
            <div>
              <small>
                {course.completedContent || course.completedLessons}/
                {course.totalContent || course.totalLessons} bài học
              </small>
              <strong>{course.progress}%</strong>
            </div>
            <ProgressLine value={course.progress} />
            <button
              type="button"
              onClick={() => showMessage('Trình phát video đang được phát triển.')}
            >
              Tiếp tục học
              <Play size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="hl-course-detail-curriculum">
        <div className="hl-course-detail-content-head">
          <h2>Nội dung khóa học</h2>
          <p>
            Học tuần tự từ phần đang mở, hoàn thành từng hoạt động để mở khóa các bài tiếp theo.
          </p>
        </div>

        <div className="hl-course-detail-curriculum-list">
          {isSupplementary ? (
            <SupplementaryCurriculum
              course={course}
              openState={openState}
              toggle={toggle}
              onAction={showMessage}
              onOpenActivity={openActivity}
            />
          ) : (
            <>
              {course.sections.map((section, index) => (
                <CurriculumSection
                  key={section.id}
                  section={section}
                  index={index}
                  openState={openState}
                  toggle={toggle}
                  onAction={showMessage}
                  onOpenActivity={openActivity}
                />
              ))}
              <FullMockTests
                course={course}
                open={openState.fullMock}
                onToggle={() =>
                  setOpenState((current) => ({ ...current, fullMock: !current.fullMock }))
                }
                onAction={showMessage}
                onOpenActivity={openActivity}
              />
            </>
          )}
        </div>
      </main>

      <StudentToast message={message} />
    </section>
  )
}

export default CourseDetail
