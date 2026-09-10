import { useMemo, useState } from 'react'
import { BookOpen, CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Clock3, LayoutDashboard, MoreHorizontal, Settings, Users } from 'lucide-react'
import Logo from '../common/Logo'

const sessions = [
  { id: 'session-1', label: '09/09 · 09:00 · Tư duy định lượng', batch: 'ĐGNL 12A · K24', group: 'Nhóm Nền tảng' },
  { id: 'session-2', label: '09/09 · 14:30 · Chuyên đề Đọc hiểu', batch: 'ĐGNL 11A · K25', group: 'Nhóm Tăng tốc' },
  { id: 'session-3', label: '09/09 · 19:00 · Luyện đề tổng hợp', batch: 'ĐGNL 12B · K24', group: 'Nhóm Nền tảng' },
]
const statusOptions = ['Có mặt', 'Muộn', 'Có phép', 'Vắng']
const seedRecords = [
  { id: 'ATT-001', sessionId: 'session-1', studentId: 'HS-24091', status: 'Có mặt', note: 'Đúng giờ' },
  { id: 'ATT-002', sessionId: 'session-1', studentId: 'HS-24126', status: 'Muộn', note: 'Muộn 10 phút' },
  { id: 'ATT-003', sessionId: 'session-1', studentId: 'HS-23984', status: 'Có phép', note: 'Đã báo trước' },
  { id: 'ATT-004', sessionId: 'session-1', studentId: 'HS-24152', status: 'Vắng', note: 'Chưa liên hệ được' },
  { id: 'ATT-005', sessionId: 'session-1', studentId: 'HS-24203', status: 'Có mặt', note: '' },
  { id: 'ATT-006', sessionId: 'session-1', studentId: 'HS-24217', status: 'Có mặt', note: '' },
]

function AttendanceManagement({ batches, students, onNavigate, onBack, embedded = false }) {
  const [batch, setBatch] = useState('ĐGNL 12A · K24')
  const [group, setGroup] = useState('Tất cả')
  const [sessionId, setSessionId] = useState('session-1')
  const [records, setRecords] = useState(seedRecords)
  const [notice, setNotice] = useState('')
  const availableSessions = useMemo(() => sessions.filter((item) => item.batch === batch && (group === 'Tất cả' || item.group === group)), [batch, group])
  const activeSession = sessions.find((item) => item.id === sessionId) || availableSessions[0]
  const list = records.filter((record) => record.sessionId === activeSession?.id).map((record) => ({ ...record, student: students.find((item) => item.id === record.studentId) })).filter((record) => record.student)
  const summary = statusOptions.reduce((result, status) => ({ ...result, [status]: list.filter((item) => item.status === status).length }), {})
  const changeFilter = (nextBatch, nextGroup) => { const nextSessions = sessions.filter((item) => item.batch === nextBatch && (nextGroup === 'Tất cả' || item.group === nextGroup)); setSessionId(nextSessions[0]?.id || '') }
  const updateRecord = (id, key, value) => { setRecords((current) => current.map((item) => item.id === id ? { ...item, [key]: value } : item)); setNotice('Đã cập nhật điểm danh cục bộ.'); window.setTimeout(() => setNotice(''), 2200) }

  return <main className={embedded ? "hl-staff-app hl-staff-embedded" : "hl-staff-app"}><aside className="hl-staff-sidebar"><div className="hl-staff-brand"><Logo monochrome /></div><span className="hl-staff-role">CỔNG VẬN HÀNH</span><nav className="hl-staff-nav"><button className="hl-staff-nav-item" onClick={() => onNavigate('dashboard')}><LayoutDashboard size={19} /><span>Tổng quan</span></button><button className="hl-staff-nav-item" onClick={() => onNavigate('students')}><Users size={19} /><span>Học viên</span></button><button className="hl-staff-nav-item" onClick={() => onNavigate('enrollments')}><ClipboardList size={19} /><span>Ghi danh</span></button><button className="hl-staff-nav-item" onClick={() => onNavigate('batches')}><BookOpen size={19} /><span>Lớp học</span></button><button className="hl-staff-nav-item" onClick={() => onNavigate('schedules')}><CalendarDays size={19} /><span>Lịch học</span></button><button className="hl-staff-nav-item is-active" onClick={() => onNavigate('attendance')}><CheckCircle2 size={19} /><span>Điểm danh</span><ChevronRight size={16} /></button></nav><div className="hl-staff-side-bottom"><button className="hl-staff-nav-item"><Settings size={19} /><span>Cài đặt</span></button><button type="button" className="hl-staff-user"><span>TL</span><div><strong>Thảo Linh</strong><small>Nhân viên vận hành</small></div><MoreHorizontal size={18} /></button></div></aside><section className="hl-staff-content"><header className="hl-staff-header"><div className="hl-staff-breadcrumb"><span>Vận hành</span><ChevronRight size={14} /><strong>Điểm danh</strong></div><button className="hl-staff-back" onClick={onBack}>Về trang chủ</button></header><div className="hl-staff-main"><div className="hl-staff-title"><div><span className="hl-staff-date">SF-10 · ATTENDANCE MANAGEMENT</span><h1>Quản lý điểm danh</h1><p>Kiểm tra và cập nhật tình trạng tham gia theo buổi học.</p></div></div>{notice && <div className="hl-staff-toast"><CheckCircle2 size={17} />{notice}</div>}<section className="hl-staff-panel hl-attendance-panel"><div className="hl-attendance-filters"><label>Batch<select value={batch} onChange={(event) => { setBatch(event.target.value); setGroup('Tất cả'); changeFilter(event.target.value, 'Tất cả') }}>{batches.map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label>Nhóm học<select value={group} onChange={(event) => { setGroup(event.target.value); changeFilter(batch, event.target.value) }}><option>Tất cả</option><option>Nhóm Nền tảng</option><option>Nhóm Tăng tốc</option></select></label><label>Buổi học<select value={activeSession?.id || ''} onChange={(event) => setSessionId(event.target.value)}>{availableSessions.length ? availableSessions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>) : <option value="">Chưa có buổi học</option>}</select></label></div>{activeSession ? <><div className="hl-attendance-session"><div><span className="hl-staff-eyebrow">{activeSession.batch} · {activeSession.group}</span><h2>{activeSession.label}</h2></div><span><Clock3 size={17} />Có thể chỉnh sửa bản ghi</span></div><div className="hl-attendance-summary">{statusOptions.map((status) => <span key={status} className={status === 'Có mặt' ? 'present' : status === 'Muộn' ? 'late' : status === 'Có phép' ? 'excused' : 'absent'}><b>{summary[status] || 0}</b>{status}</span>)}</div><div className="hl-attendance-table"><div className="hl-attendance-row head"><span>Học viên</span><span>Trạng thái</span><span>Ghi chú</span></div>{list.map(({ id, student, status, note }) => <div className="hl-attendance-row" key={id}><span className="hl-attendance-student"><i className={`hl-study-group-avatar ${student.tone}`}>{student.initials}</i><b>{student.name}<small>{student.id} · {student.email}</small></b></span><select className={`hl-attendance-status ${status === 'Có mặt' ? 'present' : status === 'Muộn' ? 'late' : status === 'Có phép' ? 'excused' : 'absent'}`} value={status} onChange={(event) => updateRecord(id, 'status', event.target.value)}>{statusOptions.map((option) => <option key={option}>{option}</option>)}</select><input value={note} onChange={(event) => updateRecord(id, 'note', event.target.value)} placeholder="Thêm ghi chú..." /></div>)}</div></> : <div className="hl-staff-empty">Không có buổi học phù hợp với bộ lọc.</div>}</section></div></section></main>
}

export default AttendanceManagement
