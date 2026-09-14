import { type ComponentType, useState } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Phone,
  RefreshCw,
  Search,
  Settings,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import Logo from '../common/Logo'
import TeacherCourses from './TeacherCourses'
import TeacherInformation from './TeacherInformation'

const overview = [
  {
    label: 'Lớp đang phụ trách',
    value: '04',
    detail: '128 học viên đang theo học',
    icon: BookOpen,
    tone: 'blue',
  },
  {
    label: 'Buổi học tuần này',
    value: '08',
    detail: '02 buổi đã hoàn thành',
    icon: CalendarDays,
    tone: 'gold',
  },
  {
    label: 'Bài chờ chấm',
    value: '18',
    detail: '06 bài cần xử lý hôm nay',
    icon: ClipboardCheck,
    tone: 'violet',
  },
  {
    label: 'Tỷ lệ tham gia',
    value: '92%',
    detail: 'Tăng 4% so với tuần trước',
    icon: Users,
    tone: 'green',
  },
]

const courses = [
  {
    id: 'course-01',
    subject: 'Tư duy định lượng',
    name: 'ĐGNL 12A · K24',
    students: 36,
    sessions: 24,
    progress: 72,
    next: 'Hôm nay · 19:00',
    color: 'blue',
    description: 'Lộ trình luyện thi ĐGNL chuyên sâu dành cho học sinh lớp 12.',
  },
  {
    id: 'course-02',
    subject: 'Luyện đề tổng hợp',
    name: 'ĐGNL 12B · K24',
    students: 34,
    sessions: 22,
    progress: 58,
    next: 'Thứ Năm · 19:00',
    color: 'violet',
    description: 'Rèn kỹ năng, chiến thuật làm đề và đánh giá năng lực định kỳ.',
  },
  {
    id: 'course-03',
    subject: 'Nền tảng toán học',
    name: 'ĐGNL 11A · K25',
    students: 31,
    sessions: 28,
    progress: 46,
    next: 'Thứ Sáu · 17:30',
    color: 'gold',
    description: 'Củng cố nền tảng kiến thức và tư duy toán học cho lớp 11.',
  },
]

const initialSessions = [
  {
    day: 'HÔM NAY',
    date: '09',
    time: '19:00 — 20:30',
    title: 'Hàm số và đồ thị',
    group: 'ĐGNL 12A · K24',
    room: 'Phòng Live 01',
    tone: 'blue',
  },
  {
    day: 'THỨ NĂM',
    date: '11',
    time: '19:00 — 20:30',
    title: 'Chữa đề mô phỏng số 05',
    group: 'ĐGNL 12B · K24',
    room: 'Phòng Live 02',
    tone: 'violet',
  },
  {
    day: 'THỨ SÁU',
    date: '12',
    time: '17:30 — 19:00',
    title: 'Phương trình và bất phương trình',
    group: 'ĐGNL 11A · K25',
    room: 'Phòng Live 01',
    tone: 'gold',
  },
]

const submissions = [
  {
    initials: 'MA',
    name: 'Nguyễn Minh Anh',
    assignment: 'Bài tập: Hàm số bậc hai',
    group: 'ĐGNL 12A · K24',
    submitted: '12 phút trước',
    tone: 'blue',
  },
  {
    initials: 'HL',
    name: 'Trần Hoàng Long',
    assignment: 'Đề luyện tập số 05',
    group: 'ĐGNL 12B · K24',
    submitted: '35 phút trước',
    tone: 'gold',
  },
  {
    initials: 'TM',
    name: 'Lê Thị Mai',
    assignment: 'Bài tập: Phương trình mũ',
    group: 'ĐGNL 11A · K25',
    submitted: '1 giờ trước',
    tone: 'violet',
  },
  {
    initials: 'GH',
    name: 'Phạm Gia Huy',
    assignment: 'Đề luyện tập số 05',
    group: 'ĐGNL 12B · K24',
    submitted: '2 giờ trước',
    tone: 'green',
  },
]

const studentStats = [
  {
    label: 'Hoàn thành bài tập',
    value: '86%',
    note: '+5% so với tuần trước',
    width: 86,
    tone: 'blue',
  },
  {
    label: 'Điểm danh trung bình',
    value: '92%',
    note: '118 / 128 học viên tham gia',
    width: 92,
    tone: 'green',
  },
  {
    label: 'Điểm bài tập trung bình',
    value: '7.8',
    note: 'Mục tiêu tuần: 8.0 điểm',
    width: 78,
    tone: 'gold',
  },
]

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<{ size?: number }>
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`hl-teacher-nav-item ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  )
}

function CreateSessionModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    group: 'ĐGNL 12A · K24',
    date: 'THỨ TƯ',
    time: '19:00 — 20:30',
    room: 'Phòng Live 01',
  })
  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    onCreate({ ...form, date: form.date.toUpperCase(), tone: 'blue' })
    onClose()
  }
  return (
    <div className="hl-teacher-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="hl-teacher-modal"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="hl-teacher-modal-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={18} />
        </button>
        <h2>Tạo buổi học</h2>
        <p>Thêm một buổi học mới vào lịch giảng dạy của bạn.</p>
        <label>
          Tên buổi học
          <input
            autoFocus
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Ví dụ: Chữa đề mô phỏng số 06"
          />
        </label>
        <label>
          Lớp học
          <select
            value={form.group}
            onChange={(event) => setForm({ ...form, group: event.target.value })}
          >
            <option>ĐGNL 12A · K24</option>
            <option>ĐGNL 12B · K24</option>
            <option>ĐGNL 11A · K25</option>
          </select>
        </label>
        <div className="hl-teacher-modal-row">
          <label>
            Thứ học
            <input
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>
          <label>
            Thời gian
            <input
              value={form.time}
              onChange={(event) => setForm({ ...form, time: event.target.value })}
            />
          </label>
        </div>
        <label>
          Phòng học
          <input
            value={form.room}
            onChange={(event) => setForm({ ...form, room: event.target.value })}
          />
        </label>
        <div className="hl-teacher-modal-actions">
          <button type="button" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="hl-teacher-primary">
            <CalendarDays size={15} />
            Tạo buổi học
          </button>
        </div>
      </form>
    </div>
  )
}

function TeacherDashboard({ onBack, onNavigate, page = 'dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [graded, setGraded] = useState([])
  const [view, setView] = useState(page)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [upcomingSessions, setUpcomingSessions] = useState(initialSessions)

  const action = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2500)
  }
  const gradeSubmission = (name) => {
    setGraded((items) => [...items, name])
    action(`Đã mở bài làm của ${name} để chấm điểm.`)
  }
  const openCourses = () => {
    setSelectedCourse(null)
    setSidebarOpen(false)
    if (onNavigate) onNavigate('courses')
    else setView('courses')
  }
  const openCourse = (course) => {
    setSelectedCourse(course)
    setView('courses')
  }
  const createSession = (session) => {
    setUpcomingSessions((items) => [
      { ...session, day: session.date, date: '10', tone: 'blue' },
      ...items,
    ])
    action(`Đã tạo buổi học “${session.title}”.`)
  }
  const breadcrumb =
    view === 'dashboard'
      ? 'Tổng quan'
      : view === 'information'
        ? 'Thông tin cá nhân'
        : selectedCourse
          ? selectedCourse.name
          : 'Lớp học của tôi'

  return (
    <main className="hl-teacher-app">
      <aside className={`hl-teacher-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="hl-teacher-brand">
          <Logo />
          <button
            type="button"
            className="hl-teacher-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="hl-teacher-nav">
          <span className="hl-teacher-group-label">Tổng quan</span>
          <NavItem
            icon={LayoutDashboard}
            label="Tổng quan"
            active={view === 'dashboard'}
            onClick={() =>
              onNavigate
                ? onNavigate('dashboard')
                : (setView('dashboard'), setSelectedCourse(null), setSidebarOpen(false))
            }
          />
          <span className="hl-teacher-group-label">Giảng dạy</span>
          <NavItem
            icon={BookOpen}
            label="Lớp học của tôi"
            active={view === 'courses'}
            onClick={openCourses}
          />
          <NavItem
            icon={CalendarDays}
            label="Lịch giảng dạy"
            onClick={() => action('Lịch giảng dạy chi tiết đang được chuẩn bị.')}
          />
          <NavItem
            icon={ClipboardCheck}
            label="Chấm điểm"
            onClick={() => action('Đã lọc các bài tập cần chấm.')}
          />
          <NavItem
            icon={Users}
            label="Học viên"
            onClick={() => action('Danh sách học viên đang được chuẩn bị.')}
          />
        </nav>
      </aside>
      {sidebarOpen && (
        <button
          type="button"
          className="hl-teacher-overlay"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="hl-teacher-content">
       <div className="hl-teacher-card">
        <header className="hl-teacher-header">
          <button
            type="button"
            className="hl-teacher-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
          >
            <Menu size={21} />
          </button>
          <button
            type="button"
            className="hl-teacher-search"
            onClick={() => action('Tìm kiếm toàn hệ thống đang được chuẩn bị.')}
          >
            <Search size={16} />
            <span>Tìm trong hệ thống...</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="hl-teacher-header-actions">
            <button
              type="button"
              className="hl-teacher-icon-button hl-teacher-refresh"
              onClick={() => action('Đã làm mới dữ liệu.')}
            >
              <RefreshCw size={16} />
              <span>Làm mới</span>
            </button>
            <button
              type="button"
              className="hl-teacher-icon-button"
              onClick={() => action('Đã chuyển chế độ giao diện.')}
              aria-label="Chế độ tối"
            >
              <Moon size={17} />
            </button>
            <button
              type="button"
              className="hl-teacher-icon-button"
              onClick={() => action('Bạn có 4 thông báo mới.')}
              aria-label="Thông báo"
            >
              <Bell size={19} />
              <i />
            </button>
            <div className="hl-teacher-profile-wrap">
              <button
                type="button"
                className="hl-teacher-profile-trigger"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="Mở hồ sơ giảng viên"
                aria-expanded={profileOpen}
              >
                <img src="/expert-1.jpg" alt="Nguyễn Hoài Nam" />
                <span className="hl-teacher-profile-trigger-name">Nguyễn Hoài Nam</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="hl-teacher-profile-menu">
                  <div className="hl-teacher-profile-summary">
                    <img src="/expert-1.jpg" alt="" />
                    <div>
                      <strong>Nguyễn Hoài Nam</strong>
                      <small>Giảng viên Toán</small>
                    </div>
                  </div>
                  <div className="hl-teacher-profile-info">
                    <span>
                      <Mail size={15} />
                      nam.nguyen@hocluc.com
                    </span>
                    <span>
                      <Phone size={15} />
                      0901 234 567
                    </span>
                  </div>
                  <div className="hl-teacher-profile-links">
                    <button type="button" onClick={() => onNavigate?.('information')}>
                      <UserRound size={17} />
                      Hồ sơ cá nhân
                    </button>
                    <button
                      type="button"
                      onClick={() => action('Cài đặt giảng viên đang được chuẩn bị.')}
                    >
                      <Settings size={17} />
                      Cài đặt
                    </button>
                    <button
                      type="button"
                      onClick={() => action('Tính năng đăng xuất đang được chuẩn bị.')}
                    >
                      <LogOut size={17} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button type="button" className="hl-teacher-back" onClick={onBack}>
              Về trang chủ
            </button>
          </div>
        </header>
        <div className="hl-teacher-main">
          <div className="hl-teacher-breadcrumb">
            <span>Giảng viên</span>
            <ChevronRight size={14} />
            <strong>{breadcrumb}</strong>
          </div>
          {notice && (
            <div className="hl-teacher-toast">
              <CheckCircle2 size={17} />
              {notice}
            </div>
          )}
          {view === 'information' ? (
            <TeacherInformation onBack={() => onNavigate?.('dashboard')} onNotify={action} />
          ) : view === 'dashboard' ? (
            <>
              <div className="hl-teacher-title">
                <div>
                  <span>THỨ BA, 09 THÁNG 09</span>
                  <h1>Chào buổi sáng, thầy Nam!</h1>
                  <p>Theo dõi lịch giảng dạy, tiến độ lớp học và các bài tập cần chấm.</p>
                </div>
                <div className="hl-teacher-welcome-actions">
                  <div className="hl-teacher-mascot-message">
                    Chúc Thầy một ngày giảng dạy hiệu quả nhé!
                  </div>
                  <img src="/owl-mascot2.png" alt="Mascot HocLuc" />
                  <button
                    type="button"
                    className="hl-teacher-primary"
                    onClick={() => setSessionModalOpen(true)}
                  >
                    <CalendarDays size={16} />
                    Tạo buổi học
                  </button>
                </div>
              </div>
              <section className="hl-teacher-kpis">
                {overview.map(({ label, value, detail, icon: Icon, tone }) => (
                  <article className="hl-teacher-kpi" key={label}>
                    <span className={tone}>
                      <Icon size={20} />
                    </span>
                    <div>
                      <p>{label}</p>
                      <strong>{value}</strong>
                      <small>{detail}</small>
                    </div>
                  </article>
                ))}
              </section>

              <div className="hl-teacher-dashboard-grid">
                <div className="hl-teacher-column">
                  <section className="hl-teacher-panel">
                    <div className="hl-teacher-panel-heading">
                      <div>
                        <h2>Lớp học phụ trách</h2>
                      </div>
                      <button type="button" onClick={openCourses}>
                        Xem tất cả <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="hl-teacher-course-list">
                      {courses.map((course) => (
                        <article key={course.id} className="hl-teacher-course">
                          <div className={`hl-teacher-course-mark ${course.color}`}>
                            <BookOpen size={20} />
                          </div>
                          <div className="hl-teacher-course-info">
                            <span>{course.subject}</span>
                            <h3>{course.name}</h3>
                            <p>
                              <Users size={13} /> {course.students} học viên <i />{' '}
                              <Clock3 size={13} /> {course.next}
                            </p>
                            <div className="hl-teacher-progress">
                              <b style={{ width: `${course.progress}%` }} />
                              <small>{course.progress}% chương trình</small>
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={`Xem lớp ${course.name}`}
                            onClick={() => openCourse(course)}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                  <section className="hl-teacher-panel">
                    <div className="hl-teacher-panel-heading">
                      <div>
                        <h2>Buổi học sắp tới</h2>
                      </div>
                      <button type="button" onClick={() => action('Đang mở lịch giảng dạy.')}>
                        Xem lịch <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="hl-teacher-sessions">
                      {upcomingSessions.map((session, index) => (
                        <article className="hl-teacher-session" key={`${session.title}-${index}`}>
                          <div className={`hl-teacher-session-date ${session.tone}`}>
                            <small>{session.day}</small>
                            <strong>{session.date}</strong>
                          </div>
                          <div>
                            <h3>{session.title}</h3>
                            <p>
                              {session.group} · {session.room}
                            </p>
                          </div>
                          <time>
                            <Clock3 size={14} />
                            {session.time}
                          </time>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
                <aside className="hl-teacher-column">
                  <section className="hl-teacher-panel hl-teacher-grading-panel">
                    <div className="hl-teacher-panel-heading">
                      <div>
                        <h2>
                          Cần chấm điểm <em>{submissions.length - graded.length}</em>
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => action('Đã hiển thị tất cả bài nộp cần chấm.')}
                      >
                        Xem tất cả
                      </button>
                    </div>
                    <div className="hl-teacher-submissions">
                      {submissions.map((item) => (
                        <article
                          key={item.name}
                          className={graded.includes(item.name) ? 'is-graded' : ''}
                        >
                          <span className={`hl-teacher-avatar ${item.tone}`}>{item.initials}</span>
                          <div>
                            <h3>{item.name}</h3>
                            <p>{item.assignment}</p>
                            <small>
                              {item.group} · {item.submitted}
                            </small>
                          </div>
                          <button
                            type="button"
                            disabled={graded.includes(item.name)}
                            onClick={() => gradeSubmission(item.name)}
                          >
                            {graded.includes(item.name) ? <CheckCircle2 size={17} /> : 'Chấm'}
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                  <section className="hl-teacher-panel">
                    <div className="hl-teacher-panel-heading">
                      <div>
                        <h2>Thống kê học viên</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => action('Báo cáo học viên chi tiết đang được chuẩn bị.')}
                      >
                        Báo cáo
                      </button>
                    </div>
                    <div className="hl-teacher-stats">
                      {studentStats.map((stat) => (
                        <div key={stat.label}>
                          <div>
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                          </div>
                          <p>{stat.note}</p>
                          <i>
                            <b className={stat.tone} style={{ width: `${stat.width}%` }} />
                          </i>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="hl-teacher-tip">
                    <FileCheck2 size={21} />
                    <div>
                      <strong>Gợi ý cho hôm nay</strong>
                      <p>Hoàn tất 6 bài chấm ưu tiên trước buổi học lúc 19:00.</p>
                    </div>
                  </section>
                </aside>
              </div>
            </>
          ) : (
            <TeacherCourses
              courses={courses}
              selectedCourse={selectedCourse}
              onOpenCourse={openCourse}
              onBack={openCourses}
              onAction={action}
            />
          )}
        </div>
       </div>
        {sessionModalOpen && (
          <CreateSessionModal onClose={() => setSessionModalOpen(false)} onCreate={createSession} />
        )}
      </section>
    </main>
  )
}

export default TeacherDashboard
