import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, NotebookPen } from 'lucide-react'
import Logo from './Logo'

const roles = [
  { id: 'student', label: 'Học sinh' },
  { id: 'teacher', label: 'Giáo viên' },
]

function AuthPage({ mode: initialMode = 'login', onModeChange, onContinue, onBack }) {
  const [mode, setMode] = useState(initialMode)
  const [role, setRole] = useState('student')
  const [showPassword, setShowPassword] = useState(false)
  const isSignup = mode === 'signup'
  const switchMode = (nextMode) => {
    setMode(nextMode)
    onModeChange?.(nextMode)
  }

  return (
    <main className="hl-auth-page">
      <button className="hl-auth-back" type="button" onClick={onBack} aria-label="Quay lại landing page"><ArrowLeft size={18} /><span>Về trang chủ</span></button>
      <div className="hl-auth-shell">
        <section className="hl-auth-form-panel">
          <a className="hl-auth-logo" href="#top" onClick={onBack} aria-label="HocLuc.com"><Logo /></a>
          <div className="hl-auth-form-wrap">
            <div className="hl-auth-heading">
              <span className="hl-auth-kicker">Cùng nhau tiến bộ mỗi ngày</span>
              <h1>{isSignup ? 'Tạo tài khoản' : 'Chào mừng trở lại'}</h1>
              <p>{isSignup ? 'Bắt đầu hành trình chinh phục mục tiêu học tập.' : 'Đăng nhập để tiếp tục hành trình học tập của bạn.'}</p>
            </div>
            <div className="hl-auth-tabs" role="tablist" aria-label="Loại tài khoản">
              {roles.map((item) => <button key={item.id} type="button" className={role === item.id ? 'is-active' : ''} onClick={() => setRole(item.id)}>{item.label}</button>)}
            </div>
            <button type="button" className="hl-auth-google"><span className="hl-google-mark">G</span><span>{isSignup ? 'Đăng ký với Google' : 'Đăng nhập với Google'}</span></button>
            <div className="hl-auth-divider"><span />HOẶC<span /></div>
            {isSignup && <label className="hl-auth-label">Họ và tên<span className="hl-auth-input"><NotebookPen size={19} /><input type="text" placeholder="Nguyễn Văn An" /></span></label>}
            <label className="hl-auth-label">Email<span className="hl-auth-input"><Mail size={19} /><input type="email" placeholder="you@example.com" /></span></label>
            <label className="hl-auth-label">Mật khẩu<span className="hl-auth-input"><LockKeyhole size={19} /><input type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" /><button type="button" className="hl-auth-eye" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
            {!isSignup && <button type="button" className="hl-auth-forgot">Quên mật khẩu?</button>}
            <button type="button" className="hl-auth-submit" onClick={onContinue}>{isSignup ? 'Đăng ký ngay' : 'Đăng nhập'}</button>
            <p className="hl-auth-switch">{isSignup ? 'Bạn đã có tài khoản?' : 'Chưa có tài khoản?'} <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>{isSignup ? 'Đăng nhập' : 'Đăng ký'}</button></p>
          </div>
        </section>
        <aside className="hl-auth-art" aria-label="Minh hoạ học tập">
          <div className="hl-auth-art-copy"><span className="hl-auth-quote">“</span><h2>Kiến thức hôm nay,<br />nền tảng ngày mai.</h2><p>Học đúng cách, tiến bộ vững vàng cùng HocLuc.com</p></div>
          <img className="hl-auth-art-image" src="/LoginPage.png" alt="Minh hoạ sách vở và dụng cụ học tập" />
        </aside>
      </div>
    </main>
  )
}

export default AuthPage
