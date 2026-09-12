import { useState } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Settings,
  Users,
  X,
} from 'lucide-react'
import Logo from '../common/Logo'

const overview = [
  { label: 'Lớp đang phụ trách', value: '04', detail: '128 học viên đang theo học', icon: BookOpen, tone: 'blue' },
  { label: 'Buổi học tuần này', value: '08', detail: '02 buổi đã hoàn thành', icon: CalendarDays, tone: 'gold' },
  { label: 'Bài chờ chấm', value: '18', detail: '06 bài cần xử lý hôm nay', icon: ClipboardCheck, tone: 'violet' },
  { label: 'Tỷ lệ tham gia', value: '92%', detail: 'Tăng 4% so với tuần trước', icon: Users, tone: 'green' },
]

const courses = [
  { id: 'course-01', subject: 'Tư duy định lượng', name: 'ĐGNL 12A · K24', students: 36, progress: 72, next: 'Hôm nay · 19:00', color: 'blue' },
  { id: 'course-02', subject: 'Luyện đề tổng hợp', name: 'ĐGNL 12B · K24', students: 34, progress: 58, next: 'Thứ Năm · 19:00', color: 'violet' },
  { id: 'course-03', subject: 'Nền tảng toán học', name: 'ĐGNL 11A · K25', students: 31, progress: 46, next: 'Thứ Sáu · 17:30', color: 'gold' },
]

const sessions = [
  { day: 'HÔM NAY', date: '09', time: '19:00 — 20:30', title: 'Hàm số và đồ thị', group: 'ĐGNL 12A · K24', room: 'Phòng Live 01', tone: 'blue' },
  { day: 'THỨ NĂM', date: '11', time: '19:00 — 20:30', title: 'Chữa đề mô phỏng số 05', group: 'ĐGNL 12B · K24', room: 'Phòng Live 02', tone: 'violet' },
  { day: 'THỨ SÁU', date: '12', time: '17:30 — 19:00', title: 'Phương trình và bất phương trình', group: 'ĐGNL 11A · K25', room: 'Phòng Live 01', tone: 'gold' },
]

const submissions = [
  { initials: 'MA', name: 'Nguyễn Minh Anh', assignment: 'Bài tập: Hàm số bậc hai', group: 'ĐGNL 12A · K24', submitted: '12 phút trước', tone: 'blue' },
  { initials: 'HL', name: 'Trần Hoàng Long', assignment: 'Đề luyện tập số 05', group: 'ĐGNL 12B · K24', submitted: '35 phút trước', tone: 'gold' },
  { initials: 'TM', name: 'Lê Thị Mai', assignment: 'Bài tập: Phương trình mũ', group: 'ĐGNL 11A · K25', submitted: '1 giờ trước', tone: 'violet' },
  { initials: 'GH', name: 'Phạm Gia Huy', assignment: 'Đề luyện tập số 05', group: 'ĐGNL 12B · K24', submitted: '2 giờ trước', tone: 'green' },
]

const studentStats = [
  { label: 'Hoàn thành bài tập', value: '86%', note: '+5% so với tuần trước', width: 86, tone: 'blue' },
  { label: 'Điểm danh trung bình', value: '92%', note: '118 / 128 học viên tham gia', width: 92, tone: 'green' },
  { label: 'Điểm bài tập trung bình', value: '7.8', note: 'Mục tiêu tuần: 8.0 điểm', width: 78, tone: 'gold' },
]

function NavItem({ icon: Icon, label, active, onClick }) {
  return <button type="button" className={`hl-teacher-nav-item ${active ? 'is-active' : ''}`} onClick={onClick}><Icon size={18} /><span>{label}</span></button>
}

function TeacherDashboard({ onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [graded, setGraded] = useState([])

  const action = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2500)
  }
  const gradeSubmission = (name) => {
    setGraded((items) => [...items, name])
    action(`Đã mở bài làm của ${name} để chấm điểm.`)
  }

  return (
    <main className="hl-teacher-app">
      <aside className={`hl-teacher-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="hl-teacher-brand"><Logo /><button type="button" className="hl-teacher-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu"><X size={20} /></button></div>
        <span className="hl-teacher-role">CỔNG GIẢNG VIÊN</span>
        <nav className="hl-teacher-nav">
          <NavItem icon={LayoutDashboard} label="Tổng quan" active onClick={() => setSidebarOpen(false)} />
          <NavItem icon={BookOpen} label="Lớp học của tôi" onClick={() => action('Danh sách lớp học đang được chuẩn bị.')} />
          <NavItem icon={CalendarDays} label="Lịch giảng dạy" onClick={() => action('Lịch giảng dạy chi tiết đang được chuẩn bị.')} />
          <NavItem icon={ClipboardCheck} label="Chấm điểm" onClick={() => action('Đã lọc các bài tập cần chấm.')} />
          <NavItem icon={Users} label="Học viên" onClick={() => action('Danh sách học viên đang được chuẩn bị.')} />
        </nav>
        <div className="hl-teacher-side-bottom">
          <NavItem icon={Settings} label="Cài đặt" onClick={() => action('Cài đặt giảng viên đang được chuẩn bị.')} />
          <button type="button" className="hl-teacher-user" onClick={() => action('Hồ sơ giảng viên đang được chuẩn bị.')}><span>NH</span><div><strong>Nguyễn Hoài Nam</strong><small>Giảng viên Toán</small></div><MoreHorizontal size={18} /></button>
        </div>
      </aside>
      {sidebarOpen && <button type="button" className="hl-teacher-overlay" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)} />}

      <section className="hl-teacher-content">
        <header className="hl-teacher-header">
          <button type="button" className="hl-teacher-menu" onClick={() => setSidebarOpen(true)} aria-label="Mở menu"><Menu size={21} /></button>
          <div className="hl-teacher-breadcrumb"><span>Giảng viên</span><ChevronRight size={14} /><strong>Tổng quan</strong></div>
          <div className="hl-teacher-header-actions"><button type="button" className="hl-teacher-icon-button" onClick={() => action('Bạn có 4 thông báo mới.')} aria-label="Thông báo"><Bell size={19} /><i /></button><button type="button" className="hl-teacher-back" onClick={onBack}>Về trang chủ</button></div>
        </header>
        <div className="hl-teacher-main">
          <div className="hl-teacher-title"><div><span>THỨ BA, 09 THÁNG 09</span><h1>Chào buổi sáng, thầy Nam!</h1><p>Theo dõi lịch giảng dạy, tiến độ lớp học và các bài tập cần chấm.</p></div><div className="hl-teacher-welcome-actions"><div className="hl-teacher-mascot-message">Chúc Thầy một ngày giảng dạy hiệu quả nhé!</div><img src="/owl-mascot2.png" alt="Mascot HocLuc" /><button type="button" className="hl-teacher-primary" onClick={() => action('Đã mở màn hình tạo buổi học mới.')}><CalendarDays size={16} />Tạo buổi học</button></div></div>
          {notice && <div className="hl-teacher-toast"><CheckCircle2 size={17} />{notice}</div>}

          <section className="hl-teacher-kpis">{overview.map(({ label, value, detail, icon: Icon, tone }) => <article className="hl-teacher-kpi" key={label}><span className={tone}><Icon size={20} /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>)}</section>

          <div className="hl-teacher-dashboard-grid">
            <div className="hl-teacher-column">
              <section className="hl-teacher-panel">
                <div className="hl-teacher-panel-heading"><div><span className="hl-teacher-eyebrow">TEACHING OVERVIEW</span><h2>Lớp học phụ trách</h2></div><button type="button" onClick={() => action('Đang mở danh sách lớp học của bạn.')}>Xem tất cả <ArrowRight size={14} /></button></div>
                <div className="hl-teacher-course-list">{courses.map((course) => <article key={course.id} className="hl-teacher-course"><div className={`hl-teacher-course-mark ${course.color}`}><BookOpen size={20} /></div><div className="hl-teacher-course-info"><span>{course.subject}</span><h3>{course.name}</h3><p><Users size={13} /> {course.students} học viên <i /> <Clock3 size={13} /> {course.next}</p><div className="hl-teacher-progress"><b style={{ width: `${course.progress}%` }} /><small>{course.progress}% chương trình</small></div></div><button type="button" aria-label={`Xem lớp ${course.name}`} onClick={() => action(`Đã mở lớp ${course.name}.`)}><ChevronRight size={18} /></button></article>)}</div>
              </section>
              <section className="hl-teacher-panel">
                <div className="hl-teacher-panel-heading"><div><span className="hl-teacher-eyebrow">UPCOMING SESSIONS</span><h2>Buổi học sắp tới</h2></div><button type="button" onClick={() => action('Đang mở lịch giảng dạy.')}>Xem lịch <ArrowRight size={14} /></button></div>
                <div className="hl-teacher-sessions">{sessions.map((session) => <article className="hl-teacher-session" key={session.title}><div className={`hl-teacher-session-date ${session.tone}`}><small>{session.day}</small><strong>{session.date}</strong></div><div><h3>{session.title}</h3><p>{session.group} · {session.room}</p></div><time><Clock3 size={14} />{session.time}</time></article>)}</div>
              </section>
            </div>
            <aside className="hl-teacher-column">
              <section className="hl-teacher-panel hl-teacher-grading-panel">
                <div className="hl-teacher-panel-heading"><div><span className="hl-teacher-eyebrow">PENDING GRADING</span><h2>Cần chấm điểm <em>{submissions.length - graded.length}</em></h2></div><button type="button" onClick={() => action('Đã hiển thị tất cả bài nộp cần chấm.')}>Xem tất cả</button></div>
                <div className="hl-teacher-submissions">{submissions.map((item) => <article key={item.name} className={graded.includes(item.name) ? 'is-graded' : ''}><span className={`hl-teacher-avatar ${item.tone}`}>{item.initials}</span><div><h3>{item.name}</h3><p>{item.assignment}</p><small>{item.group} · {item.submitted}</small></div><button type="button" disabled={graded.includes(item.name)} onClick={() => gradeSubmission(item.name)}>{graded.includes(item.name) ? <CheckCircle2 size={17} /> : 'Chấm'}</button></article>)}</div>
              </section>
              <section className="hl-teacher-panel">
                <div className="hl-teacher-panel-heading"><div><span className="hl-teacher-eyebrow">STUDENT STATS</span><h2>Thống kê học viên</h2></div><button type="button" onClick={() => action('Báo cáo học viên chi tiết đang được chuẩn bị.')}>Báo cáo</button></div>
                <div className="hl-teacher-stats">{studentStats.map((stat) => <div key={stat.label}><div><span>{stat.label}</span><strong>{stat.value}</strong></div><p>{stat.note}</p><i><b className={stat.tone} style={{ width: `${stat.width}%` }} /></i></div>)}</div>
              </section>
              <section className="hl-teacher-tip"><FileCheck2 size={21} /><div><strong>Gợi ý cho hôm nay</strong><p>Hoàn tất 6 bài chấm ưu tiên trước buổi học lúc 19:00.</p></div></section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TeacherDashboard
