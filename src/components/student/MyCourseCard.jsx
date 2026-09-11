import { ArrowRight, BookOpen, CheckCircle2, CircleDot } from 'lucide-react'

const subjectTone = {
  'Toán học': 'green',
  'Tiếng Việt': 'blue',
  'Tiếng Anh': 'amber',
  'Tư duy khoa học': 'violet',
}

const statusLabels = {
  'not-started': 'Chưa bắt đầu',
  'in-progress': 'Đang học',
  completed: 'Hoàn thành',
}

function MyCourseCard({ course, onOpen }) {
  const tone = subjectTone[course.subject] || 'blue'
  const isCompleted = course.status === 'completed'

  return (
    <button type="button" className="hl-my-course-card" onClick={() => onOpen(course)}>
      <div className={`hl-my-course-cover is-${tone}`}>
        <span>{course.subject}</span>
        <BookOpen size={34} />
      </div>

      <div className="hl-my-course-body">
        <div>
          <span className={`hl-my-course-subject is-${tone}`}>{course.subject}</span>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
        </div>

        <div className="hl-my-course-progress">
          <div>
            <span>Tiến độ</span>
            <strong>{course.progress}%</strong>
          </div>
          <div className="hl-my-course-progress-bar" aria-hidden="true">
            <span style={{ width: `${course.progress}%` }} />
          </div>
          <div>
            <span>{course.completedLessons}/{course.totalLessons} bài học</span>
            <strong className={isCompleted ? 'is-completed' : ''}>
              {isCompleted ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}
              {statusLabels[course.status]}
            </strong>
          </div>
        </div>

        <span className="hl-my-course-cta">
          Tiếp tục học
          <ArrowRight size={15} />
        </span>
      </div>
    </button>
  )
}

export default MyCourseCard
