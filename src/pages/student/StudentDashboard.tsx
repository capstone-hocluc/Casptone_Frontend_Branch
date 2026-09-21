import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Flame,
  Lock,
  Star,
  Target,
  Trophy,
} from 'lucide-react'
import {
  activityFrequency,
  dashboardSummary,
  learningProfile,
  myCourses,
  recentLesson,
  studyPlan,
  testPractice,
  todaysGoal,
} from '../../data/studentDashboard'
import { type CSSProperties, useEffect, useState } from 'react'
import { useTransientMessage } from '../../hooks/useTransientMessage'
import StudentToast from '../../components/student/common/StudentToast'

const getVisibleCounts = () => {
  if (typeof window === 'undefined') {
    return { courses: 3, practice: 4 }
  }

  if (window.innerWidth < 768) {
    return { courses: 1, practice: 1 }
  }

  if (window.innerWidth < 1200) {
    return { courses: 2, practice: 2 }
  }

  return { courses: 3, practice: 4 }
}

function LevelLine({ title, data }) {
  return (
    <div className="hl-dashboard-level">
      <strong>{title}</strong>
      <div className="hl-dashboard-level-line">
        <span />
        <span />
        <span />
      </div>
      <div className="hl-dashboard-level-values">
        <span>
          <small>Hiện tại</small>
          {data.current}
        </span>
        <span>
          <small>Dự đoán</small>
          {data.predicted}
        </span>
        <span>
          <small>Mục tiêu</small>
          {data.target}
        </span>
      </div>
    </div>
  )
}

const tabContent = {
  overview: 'Hiển thị tổng quan tiến độ ôn thi trong tuần này.',
  learning: 'Tập trung vào bài học, chuyên đề và khóa học đang theo dõi.',
  practice: 'Theo dõi nhịp luyện đề, mini test và thời lượng làm bài.',
}

function CarouselControls({ canPrevious, canNext, onPrevious, onNext, label }) {
  if (!canPrevious && !canNext) return null

  return (
    <div className="hl-dashboard-carousel-controls" aria-label={label}>
      <button
        type="button"
        className="hl-dashboard-carousel-button"
        onClick={onPrevious}
        disabled={!canPrevious}
        aria-label="Xem mục trước"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className="hl-dashboard-carousel-button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Xem mục tiếp theo"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

function StudentDashboard({ onOpenLearningProfile }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [visibleCounts, setVisibleCounts] = useState(getVisibleCounts)
  const [courseStartIndex, setCourseStartIndex] = useState(0)
  const [practiceStartIndex, setPracticeStartIndex] = useState(0)
  const { message, show: showMessage } = useTransientMessage(2600)

  const courseVisibleCount = visibleCounts.courses
  const practiceVisibleCount = visibleCounts.practice
  const maxCourseStartIndex = Math.max(0, myCourses.length - courseVisibleCount)
  const maxPracticeStartIndex = Math.max(0, testPractice.length - practiceVisibleCount)
  const visibleCourses = myCourses.slice(courseStartIndex, courseStartIndex + courseVisibleCount)
  const visiblePracticeItems = testPractice.slice(
    practiceStartIndex,
    practiceStartIndex + practiceVisibleCount
  )

  useEffect(() => {
    const syncVisibleCounts = () => setVisibleCounts(getVisibleCounts())

    syncVisibleCounts()
    window.addEventListener('resize', syncVisibleCounts)
    return () => window.removeEventListener('resize', syncVisibleCounts)
  }, [])

  useEffect(() => {
    setCourseStartIndex((current) => Math.min(current, maxCourseStartIndex))
  }, [maxCourseStartIndex])

  useEffect(() => {
    setPracticeStartIndex((current) => Math.min(current, maxPracticeStartIndex))
  }, [maxPracticeStartIndex])

  const showComingSoon = () => showMessage('Tính năng đang được phát triển.')
  const openLearningProfile = () => {
    if (onOpenLearningProfile) {
      onOpenLearningProfile()
      return
    }

    showMessage('Tính năng Hồ sơ năng lực chi tiết đang được phát triển.')
  }

  return (
    <section className="hl-student-page hl-dashboard-page">
      <StudentToast message={message} />

      <div className="hl-dashboard-home-grid">
        <div className="hl-dashboard-left">
          <section className="hl-dashboard-goal">
            <div className="hl-dashboard-goal-head">
              <div className="hl-dashboard-goal-title">
                <Flame size={22} />
                <span>Mục tiêu hôm nay</span>
              </div>

              <div className="hl-dashboard-goal-coach">
                <div className="hl-dashboard-goal-bubble">Bắt tay vào mục tiêu đầu tiên thôi!</div>

                <div className="hl-dashboard-mascot">
                  <img src="/owl-mascot2.png" alt="" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="hl-dashboard-goal-box">
              <div className="hl-dashboard-goal-action">
                <span className="hl-dashboard-goal-icon">
                  <Target size={22} />
                </span>

                <div className="hl-dashboard-goal-content">
                  <strong>{todaysGoal.title}</strong>
                  <p>{todaysGoal.description}</p>
                </div>

                <button type="button" onClick={showComingSoon}>
                  Bắt đầu
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="hl-dashboard-locked">
                <Lock size={18} />
                <span>{todaysGoal.lockedNote}</span>
              </div>
            </div>
          </section>

          <section className="hl-dashboard-section">
            <h3>Bài học gần nhất</h3>
            <article className="hl-dashboard-recent">
              <div className="hl-dashboard-lesson-badge">
                <strong>{recentLesson.lessonNo}</strong>
                <span>Bài học</span>
              </div>
              <div>
                <strong>{recentLesson.title}</strong>
                <p>
                  {recentLesson.course} · {recentLesson.meta} <Star size={17} />{' '}
                  {recentLesson.score}
                </p>
              </div>
              <button type="button" onClick={showComingSoon}>
                Tiếp tục học <ArrowRight size={18} />
              </button>
            </article>
          </section>

          <section className="hl-dashboard-section">
            <h3>Kế hoạch ôn thi</h3>
            <div className="hl-dashboard-study-plan">
              <p>
                {studyPlan.title}. {studyPlan.description}
              </p>
              <button
                type="button"
                onClick={() => showMessage('Tính năng Kế hoạch ôn thi đang được phát triển.')}
              >
                Khởi tạo <ArrowRight size={17} />
              </button>
            </div>
          </section>

          <section className="hl-dashboard-section">
            <div className="hl-dashboard-section-row">
              <h3>Khóa học của tôi</h3>
              <div className="hl-dashboard-section-actions">
                <CarouselControls
                  label="Điều hướng khóa học"
                  canPrevious={courseStartIndex > 0}
                  canNext={courseStartIndex < maxCourseStartIndex}
                  onPrevious={() => setCourseStartIndex((current) => Math.max(0, current - 1))}
                  onNext={() =>
                    setCourseStartIndex((current) => Math.min(maxCourseStartIndex, current + 1))
                  }
                />
                <button type="button" onClick={showComingSoon}>
                  Xem tất cả
                </button>
              </div>
            </div>
            <div
              className="hl-dashboard-course-list"
              style={{ '--hl-dashboard-visible-cards': courseVisibleCount } as CSSProperties}
            >
              {visibleCourses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  className="hl-dashboard-mini-course"
                  onClick={showComingSoon}
                >
                  <div className="hl-dashboard-course-cover">
                    <span>{course.category}</span>
                    <strong>{course.title}</strong>
                    <BookOpen size={26} />
                  </div>
                  <div className="hl-dashboard-mini-course-body">
                    <h4>{course.title}</h4>
                    <div>
                      <span>{course.progress}</span>
                      <strong>
                        <Trophy size={17} /> {course.score}
                      </strong>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="hl-dashboard-right">
          <section className="hl-dashboard-profile-card">
            <div className="hl-dashboard-section-row">
              <h3>Hồ sơ năng lực</h3>
              <button type="button" onClick={openLearningProfile}>
                Xem tất cả
              </button>
            </div>
            <div className="hl-dashboard-profile-box">
              <div className="hl-dashboard-competency-section">
                <h4>Điểm năng lực {learningProfile.program} của bạn</h4>
                <div className="hl-dashboard-competency-list">
                  {learningProfile.dimensions.map((dimension) => (
                    <LevelLine key={dimension.title} title={dimension.title} data={dimension} />
                  ))}
                </div>
              </div>
              <div className="hl-dashboard-summary-list">
                <strong>Tổng quan ôn luyện</strong>
                <p>
                  <Clock3 size={16} /> Tổng thời lượng <b>{dashboardSummary.studyTime}</b>
                </p>
                <p>
                  <BookOpen size={16} /> Bài học đã hoàn thành{' '}
                  <b>{dashboardSummary.completedLessons}</b>
                </p>
                <p>
                  <ClipboardCheck size={16} /> Đề đã làm <b>{dashboardSummary.completedTests}</b>
                </p>
                <p>
                  <Trophy size={16} /> Điểm cao nhất <b>{dashboardSummary.bestScore}</b>
                </p>
                <p>
                  <Flame size={16} /> Chuỗi học tập <b>{dashboardSummary.currentStreak} ngày</b>
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <section className="hl-dashboard-section hl-dashboard-practice-section">
        <div className="hl-dashboard-section-row">
          <h3>Luyện đề</h3>
          <div className="hl-dashboard-section-actions">
            <CarouselControls
              label="Điều hướng luyện đề"
              canPrevious={practiceStartIndex > 0}
              canNext={practiceStartIndex < maxPracticeStartIndex}
              onPrevious={() => setPracticeStartIndex((current) => Math.max(0, current - 1))}
              onNext={() =>
                setPracticeStartIndex((current) => Math.min(maxPracticeStartIndex, current + 1))
              }
            />
            <button type="button" onClick={showComingSoon}>
              Xem tất cả
            </button>
          </div>
        </div>
        <div
          className="hl-dashboard-test-list"
          style={{ '--hl-dashboard-visible-cards': practiceVisibleCount } as CSSProperties}
        >
          {visiblePracticeItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="hl-dashboard-test-card"
              onClick={() => showMessage(`${item.title}: tính năng luyện đề đang được phát triển.`)}
            >
              <div className={`hl-dashboard-test-cover is-${item.tone}`}>
                <small>Đánh giá năng lực</small>
                <strong>{item.title}</strong>
              </div>
              <h4>{item.title}</h4>
              <p>
                {item.questions} · {item.duration}
              </p>
              <div className="hl-dashboard-test-meta">
                <span>{item.badge}</span>
                <small>{item.score}</small>
              </div>
              <small className="hl-dashboard-test-status">{item.status}</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}

export default StudentDashboard
