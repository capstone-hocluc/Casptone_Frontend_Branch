import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, BookOpen, Check, ChevronDown, GraduationCap, Search, Target, TrendingUp } from 'lucide-react'
import Logo from './Logo'

const subjectGroups = [
  { label: 'Tư duy & Ngôn ngữ', description: 'Bao gồm Toán, Logic & Phân tích số liệu', subjects: ['Toán học', 'Ngữ văn', 'Tiếng Anh'] },
  { label: 'Khoa học tự nhiên', description: 'Khám phá và lý giải thế giới', subjects: ['Vật lý', 'Hóa học', 'Sinh học'] },
  { label: 'Khoa học xã hội', description: 'Hiểu người và xã hội', subjects: ['Lịch sử', 'Địa lý'] },
]

const universities = [
  'Trường Đại học Bách khoa (VNUHCM-UT)',
  'Trường Đại học Khoa học Tự nhiên (VNUHCM-US)',
  'Trường Đại học Khoa học Xã hội và Nhân văn (VNUHCM-USSH)',
  'Trường Đại học Quốc tế (VNUHCM-IU)',
  'Trường Đại học Công nghệ Thông tin (VNUHCM-UIT)',
  'Trường Đại học Kinh tế - Luật (VNUHCM-UEL)',
  'Trường Đại học Khoa học Sức khỏe (VNUHCM-UHS)',
  'Trường Đại học An Giang (VNUHCM-AGU)'
]
const majors = ['Công nghệ thông tin', 'Kinh doanh quốc tế', 'Kinh tế', 'Kỹ thuật điện - điện tử', 'Ngôn ngữ Anh', 'Truyền thông đa phương tiện', 'Khác']

function SearchSelect({ label, placeholder, options, value, onChange, icon: Icon, error }) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const filtered = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const choose = (option) => { setQuery(option); onChange(option); setOpen(false) }

  return (
    <label className="hl-onboard-field" ref={containerRef}>
      <span className="hl-onboard-label"><Icon size={16} />{label}</span>
      <span className={`hl-onboard-search ${error ? 'has-error' : ''}`}>
        <Search size={17} />
        <input value={query} placeholder={placeholder} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); onChange(''); setOpen(true) }} />
        <ChevronDown size={17} className={open ? 'is-open' : ''} />
      </span>
      {open && <span className="hl-onboard-options">{filtered.length ? filtered.map((option) => <button type="button" key={option} onMouseDown={() => choose(option)}>{option}</button>) : <small>Không tìm thấy kết quả phù hợp</small>}</span>}
      {error && <small className="hl-onboard-error">{error}</small>}
    </label>
  )
}

function SubjectChoice({ label, hint, selected, onChange, error }) {
  const toggleSubject = (subject) => {
    if (selected.includes(subject)) {
      onChange(selected.filter((item) => item !== subject))
      return
    }
    onChange([...selected, subject])
  }

  return (
    <div className="hl-onboard-field">
      <span className="hl-onboard-label"><BookOpen size={16} />{label}<strong>{selected.length} môn đã chọn</strong></span>
      <span className="hl-onboard-hint">{hint}</span>
      <div className="hl-onboard-subject-groups">
        {subjectGroups.map((group) => (
          <div className="hl-onboard-subject-group" key={group.label}>
            <div className="hl-onboard-subject-group-heading">
              <strong>{group.label}</strong>
              <span>{group.description}</span>
            </div>
            <div className="hl-onboard-subjects">
              {group.subjects.map((subject) => {
                const isSelected = selected.includes(subject)
                return <button type="button" key={subject} aria-pressed={isSelected} className={isSelected ? 'is-selected' : ''} onClick={() => toggleSubject(subject)}>{isSelected && <Check size={14} />}{subject}</button>
              })}
            </div>
          </div>
        ))}
      </div>
      {error && <small className="hl-onboard-error">{error}</small>}
    </div>
  )
}

function StudentOnboarding({ onBack }) {
  const [form, setForm] = useState({ university: '', major: '', score: 600, weakest: [], strongest: [] })
  const [otherMajor, setOtherMajor] = useState(false)
  const [errors, setErrors] = useState({})
  const [scoreLimitOpen, setScoreLimitOpen] = useState(false)

  useEffect(() => {
    if (!scoreLimitOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setScoreLimitOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [scoreLimitOpen])

  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })) }
  const handleScoreChange = (rawValue) => {
    if (rawValue === '') {
      update('score', 0)
      return
    }

    const nextScore = Number(rawValue)
    if (Number.isNaN(nextScore)) return

    if (nextScore > 1200) {
      setScoreLimitOpen(true)
      update('score', 1200)
      return
    }

    update('score', Math.max(0, nextScore))
  }
  const validate = () => {
    const next = {}
    if (!form.university) next.university = 'Bạn hãy chọn trường đại học mục tiêu.'
    if (!form.major) next.major = 'Bạn hãy chọn ngành học mục tiêu.'
    if (!form.weakest.length) next.weakest = 'Hãy chọn ít nhất một môn bạn muốn cải thiện.'
    if (!form.strongest.length) next.strongest = 'Hãy chọn ít nhất một môn bạn tự tin nhất.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  return (
    <main className="hl-onboard-page">
      <header className="hl-onboard-top"><button type="button" onClick={onBack} aria-label="Quay lại"><ArrowLeft size={18} /></button><span className="hl-onboard-logo"><Logo /></span><span /></header>
      <section className="hl-onboard-card">
        <div className="hl-onboard-layout">
          <div className="hl-onboard-main">
            <div className="hl-onboard-intro">
              <span className="hl-onboard-kicker">BƯỚC 1 / 1 · HỒ SƠ HỌC TẬP</span>
              <h1>Cùng thiết lập mục tiêu học tập của bạn</h1>
              <p>Cho chúng mình biết một chút về mục tiêu và điểm mạnh, điểm yếu của bạn để cá nhân hóa lộ trình học phù hợp hơn.</p>
              <div className="hl-onboard-meta" aria-label="Điểm nổi bật của onboarding">
                <span>3 phút hoàn thành</span>
                <span>Cá nhân hóa ngay từ đầu</span>
                <span>Có thể cập nhật sau</span>
              </div>
            </div>
            <div className="hl-onboard-exam"><span className="hl-onboard-icon"><GraduationCap size={22} /></span><div><small>Kỳ thi đang ôn luyện</small><strong>Đánh giá năng lực ĐHQG TP.HCM</strong></div><Check size={20} /></div>
            <div className="hl-onboard-grid">
              <SearchSelect label="Trường đại học mục tiêu" placeholder="Tìm hoặc chọn trường đại học" options={universities} value={form.university} onChange={(value) => update('university', value)} icon={GraduationCap} error={errors.university} />
              <div className="hl-onboard-major-wrap"><SearchSelect label="Ngành học mục tiêu" placeholder="Tìm hoặc chọn ngành học" options={majors} value={otherMajor ? 'Khác' : form.major} onChange={(value) => { setOtherMajor(value === 'Khác'); update('major', value === 'Khác' ? '' : value) }} icon={Target} error={otherMajor ? '' : errors.major} />{otherMajor && <label className="hl-onboard-other-major"><span>Tên ngành học của bạn</span><input value={form.major} placeholder="Nhập tên ngành học" onChange={(event) => update('major', event.target.value)} />{errors.major && <small className="hl-onboard-error">{errors.major}</small>}</label>}</div>
              <div className="hl-onboard-field hl-score-field"><span className="hl-onboard-label"><TrendingUp size={16} />Điểm ĐGNL mục tiêu</span><div className="hl-score-value"><strong>{form.score}</strong><span>/ 1200 điểm</span></div><input className="hl-score-range" type="range" min="0" max="1200" step="10" value={form.score} onChange={(event) => update('score', Number(event.target.value))} /><div className="hl-score-input"><input type="number" min="0" max="1200" value={form.score} onChange={(event) => handleScoreChange(event.target.value)} /><span>điểm</span></div></div>
              <SubjectChoice label="Môn học cần cải thiện" hint="Chọn tất cả môn bạn muốn ưu tiên cải thiện" selected={form.weakest} onChange={(value) => update('weakest', value)} error={errors.weakest} />
              <SubjectChoice label="Môn học tự tin nhất" hint="Chọn tất cả môn bạn cảm thấy có nền tảng tốt" selected={form.strongest} onChange={(value) => update('strongest', value)} error={errors.strongest} />
            </div>
            <div className="hl-onboard-actions"><span><span className="hl-onboard-dot" />Thông tin này có thể cập nhật sau</span><button type="button" className="hl-onboard-continue" onClick={() => { if (validate()) alert('Thông tin đã được ghi nhận!') }}>Tiếp tục làm bài đánh giá đầu vào <span>→</span></button></div>
          </div>
          <aside className="hl-onboard-rail" aria-label="Tóm tắt cá nhân hóa">
            <div className="hl-onboard-rail-card hl-onboard-rail-highlight">
              <span className="hl-onboard-rail-kicker">Lộ trình tinh gọn</span>
              <h2>Hồ sơ này giúp hệ thống hiểu bạn nhanh hơn.</h2>
              <p>Chỉ vài thông tin cốt lõi, nhưng đủ để đề xuất bài tập, môn học và nhịp ôn luyện phù hợp với mục tiêu của bạn.</p>
            </div>
            <div className="hl-onboard-rail-card">
              <span className="hl-onboard-rail-title">Bạn sẽ nhận được</span>
              <ul className="hl-onboard-checklist">
                <li><Check size={14} />Gợi ý môn học nên ưu tiên</li>
                <li><Check size={14} />Mốc điểm mục tiêu rõ ràng hơn</li>
                <li><Check size={14} />Lộ trình ôn luyện bám sát ngành học</li>
              </ul>
            </div>
            <div className="hl-onboard-rail-card hl-onboard-rail-note">
              <span className="hl-onboard-rail-title">Gợi ý nhỏ</span>
              <p>Hãy chọn trường và ngành gần nhất với mục tiêu thật của bạn. Những chi tiết này làm cho phần gợi ý sau đó trông “đúng người” hơn rất nhiều.</p>
            </div>
          </aside>
        </div>
      </section>
      {scoreLimitOpen && (
        <div className="hl-score-modal-backdrop" role="presentation" onClick={() => setScoreLimitOpen(false)}>
          <div className="hl-score-modal" role="dialog" aria-modal="true" aria-labelledby="hl-score-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="hl-score-modal-icon">!</div>
            <h2 id="hl-score-modal-title">Điểm tối đa đã đạt tới</h2>
            <p>
              Điểm tối đa của kỳ thi đánh giá năng lực do <strong>Đại học Quốc gia TP. HCM</strong> tổ chức là <strong>1.200 điểm.</strong>
              {' '}
              Bạn vui lòng chọn lại nhé.
            </p>
            <button type="button" className="hl-score-modal-button" onClick={() => setScoreLimitOpen(false)}>Đã hiểu</button>
          </div>
        </div>
      )}
    </main>
  )
}

export default StudentOnboarding
