import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, NotebookPen } from 'lucide-react'
import Logo from '../common/Logo'

const roles = [
  { id: 'student', label: 'Học sinh' },
  { id: 'teacher', label: 'Giáo viên' },
]

function AuthPage({ mode: initialMode = 'login', onModeChange, onContinue, onBack }) {
  const [mode, setMode] = useState(initialMode)
  const [role, setRole] = useState('student')
  const [authEmail, setAuthEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recoveryStep, setRecoveryStep] = useState(1)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [recoverySuccess, setRecoverySuccess] = useState('')
  const [recoveryForm, setRecoveryForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [recoveryErrors, setRecoveryErrors] = useState({})
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [verificationSuccess, setVerificationSuccess] = useState('')
  const [verificationCountdown, setVerificationCountdown] = useState(60)
  const recoveryTimers = useRef([])
  const recoveryIntervals = useRef([])
  const verificationTimers = useRef([])
  const verificationIntervals = useRef([])
  const isSignup = mode === 'signup'
  const isEmailVerification = mode === 'verify-email'
  const isRecovery = mode === 'forgot-password' || mode === 'reset-password'

  const clearRecoveryTimers = () => {
    recoveryTimers.current.forEach((timer) => window.clearTimeout(timer))
    recoveryTimers.current = []
    recoveryIntervals.current.forEach((interval) => window.clearInterval(interval))
    recoveryIntervals.current = []
  }

  const resetRecovery = () => {
    clearRecoveryTimers()
    setRecoveryStep(1)
    setResendCountdown(0)
    setRecoveryLoading(false)
    setRecoverySuccess('')
    setRecoveryErrors({})
    setRecoveryForm({
      email: '',
      password: '',
      confirmPassword: '',
    })
    setShowPassword(false)
  }

  const clearVerificationTimers = () => {
    verificationTimers.current.forEach((timer) => window.clearTimeout(timer))
    verificationTimers.current = []
    verificationIntervals.current.forEach((interval) => window.clearInterval(interval))
    verificationIntervals.current = []
  }

  const startVerificationCountdown = () => {
    verificationIntervals.current.forEach((interval) => window.clearInterval(interval))
    verificationIntervals.current = []
    setVerificationCountdown(60)
    const interval = window.setInterval(() => {
      setVerificationCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval)
          return 0
        }
        return current - 1
      })
    }, 1000)
    verificationIntervals.current.push(interval)
  }

  const resetVerification = () => {
    clearVerificationTimers()
    setVerificationCode('')
    setVerificationLoading(false)
    setVerificationError('')
    setVerificationSuccess('')
    setVerificationCountdown(60)
  }

  useEffect(() => {
    setMode(initialMode)
    if (initialMode === 'verify-email') {
      resetRecovery()
      resetVerification()
      startVerificationCountdown()
    } else if (initialMode === 'forgot-password') {
      resetRecovery()
    } else if (initialMode === 'reset-password') {
      clearRecoveryTimers()
      setRecoveryStep(3)
      setRecoveryLoading(false)
      setRecoverySuccess('')
      setRecoveryErrors({})
    } else {
      resetRecovery()
    }
  }, [initialMode])

  useEffect(() => () => {
    clearRecoveryTimers()
    clearVerificationTimers()
  }, [])

  const switchMode = (nextMode) => {
    setMode(nextMode)
    onModeChange?.(nextMode)
  }
  const openRecovery = () => {
    resetRecovery()
    switchMode('forgot-password')
  }
  const backToLogin = () => {
    clearVerificationTimers()
    resetRecovery()
    switchMode('login')
  }
  const updateRecovery = (key, value) => {
    setRecoveryForm((current) => ({ ...current, [key]: value }))
    setRecoveryErrors((current) => ({ ...current, [key]: '' }))
    setRecoverySuccess('')
  }
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  const passwordIssues = (value) => [
    value.length >= 8 ? '' : 'Ít nhất 8 ký tự',
    /[A-Z]/.test(value) ? '' : 'Có ít nhất 1 chữ hoa',
    /[a-z]/.test(value) ? '' : 'Có ít nhất 1 chữ thường',
    /\d/.test(value) ? '' : 'Có ít nhất 1 chữ số',
    /[^A-Za-z0-9]/.test(value) ? '' : 'Có ít nhất 1 ký tự đặc biệt',
  ].filter(Boolean)

  const submitRecoveryEmail = () => {
    const nextErrors = {}
    if (!recoveryForm.email.trim()) nextErrors.email = 'Vui lòng nhập email đã đăng ký.'
    else if (!isValidEmail(recoveryForm.email)) nextErrors.email = 'Email chưa đúng định dạng.'
    setRecoveryErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setRecoveryLoading(true)
    setRecoverySuccess('')
    clearRecoveryTimers()
    const timer = window.setTimeout(() => {
      setRecoveryLoading(false)
      setRecoveryStep(2)
      setResendCountdown(60)
      const interval = window.setInterval(() => {
        setResendCountdown((current) => {
          if (current <= 1) {
            window.clearInterval(interval)
            return 0
          }
          return current - 1
        })
      }, 1000)
      recoveryIntervals.current.push(interval)
    }, 1100)
    recoveryTimers.current.push(timer)
  }

  const resendRecoveryEmail = () => {
    if (recoveryLoading || resendCountdown > 0) return
    setRecoveryLoading(true)
    clearRecoveryTimers()
    const timer = window.setTimeout(() => {
      setRecoveryLoading(false)
      setRecoverySuccess('Email đặt lại mật khẩu đã được gửi lại. Hãy kiểm tra hộp thư của bạn.')
      setResendCountdown(60)
      const interval = window.setInterval(() => {
        setResendCountdown((current) => {
          if (current <= 1) {
            window.clearInterval(interval)
            return 0
          }
          return current - 1
        })
      }, 1000)
      recoveryIntervals.current.push(interval)
    }, 800)
    recoveryTimers.current.push(timer)
  }

  const submitRecoveryPassword = () => {
    const nextErrors = {}
    const issues = passwordIssues(recoveryForm.password)

    if (!recoveryForm.password) nextErrors.password = 'Vui lòng nhập mật khẩu mới.'
    else if (issues.length) nextErrors.password = issues.join(' · ')
    if (!recoveryForm.confirmPassword) nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.'
    else if (recoveryForm.password !== recoveryForm.confirmPassword) nextErrors.confirmPassword = 'Hai mật khẩu chưa khớp.'

    setRecoveryErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setRecoveryLoading(true)
    setRecoverySuccess('')
    clearRecoveryTimers()
    const timer = window.setTimeout(() => {
      setRecoveryLoading(false)
      setRecoverySuccess('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.')
      const redirectTimer = window.setTimeout(() => {
        backToLogin()
      }, 1400)
      recoveryTimers.current.push(redirectTimer)
    }, 1000)
    recoveryTimers.current.push(timer)
  }

  const resendVerificationCode = () => {
    if (verificationLoading || verificationCountdown > 0) return
    setVerificationLoading(true)
    setVerificationError('')
    setVerificationSuccess('')
    clearVerificationTimers()
    const timer = window.setTimeout(() => {
      setVerificationLoading(false)
      setVerificationSuccess('Mã xác thực mới đã được gửi. Hãy kiểm tra email của bạn.')
      startVerificationCountdown()
    }, 800)
    verificationTimers.current.push(timer)
  }

  const submitVerification = () => {
    if (verificationLoading) return
    const code = verificationCode.trim()
    if (!code) {
      setVerificationError('Vui lòng nhập mã xác thực.')
      return
    }
    if (code.length !== 6) {
      setVerificationError('Mã xác thực cần đủ 6 chữ số.')
      return
    }
    if (code !== '123456') {
      setVerificationError('Mã xác thực chưa đúng. Mã demo local là 123456.')
      return
    }

    setVerificationLoading(true)
    setVerificationError('')
    setVerificationSuccess('')
    clearVerificationTimers()
    const timer = window.setTimeout(() => {
      setVerificationLoading(false)
      setVerificationSuccess('Xác thực email thành công. Đang chuyển tới màn hình đăng nhập...')
      const redirectTimer = window.setTimeout(() => {
        clearVerificationTimers()
        resetRecovery()
        switchMode('login')
      }, 1400)
      verificationTimers.current.push(redirectTimer)
    }, 1000)
    verificationTimers.current.push(timer)
  }

  const handleRecoverySubmit = () => {
    if (recoveryLoading) return
    if (recoveryStep === 1) {
      submitRecoveryEmail()
      return
    }
    submitRecoveryPassword()
  }

  const renderRecoveryStep = () => {
    const isStepOne = recoveryStep === 1
    const isEmailSentStep = recoveryStep === 2
    const buttonLabel = recoveryLoading ? (isStepOne ? 'Đang gửi email...' : 'Đang đặt lại...') : isStepOne ? 'Gửi link đặt lại' : 'Xác nhận và đặt lại'

    return (
      <div className={`hl-auth-recovery ${recoveryLoading ? 'is-loading' : ''}`}>
        <div className="hl-auth-heading hl-auth-heading--compact">
          <span className="hl-auth-kicker">Khôi phục mật khẩu</span>
          <h1>{isStepOne ? 'Nhận link đặt lại mật khẩu' : isEmailSentStep ? 'Kiểm tra email của bạn' : 'Đặt lại mật khẩu mới'}</h1>
          <p>
            {isStepOne
              ? 'Nhập email đã đăng ký. Chúng tôi sẽ gửi link để bạn đặt lại mật khẩu.'
              : isEmailSentStep
                ? 'Hãy kiểm tra hộp thư và bấm vào link trong email để mở trang đặt lại mật khẩu.'
                : 'Tạo mật khẩu mới đủ mạnh và xác nhận lại để hoàn tất.'}
          </p>
        </div>

        {recoverySuccess && <div className="hl-auth-success" role="status">{recoverySuccess}</div>}

        <div className="hl-auth-step" key={recoveryStep}>
          {isStepOne ? (
            <label className="hl-auth-label">
              Email
              <span className={`hl-auth-input ${recoveryErrors.email ? 'has-error' : ''}`}>
                <Mail size={19} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={recoveryForm.email}
                  onChange={(event) => updateRecovery('email', event.target.value)}
                  autoComplete="email"
                />
              </span>
              {recoveryErrors.email && <small className="hl-auth-error">{recoveryErrors.email}</small>}
            </label>
          ) : isEmailSentStep ? (
            <>
              <div className="hl-auth-email-notice">
                <Mail size={28} />
                <strong>Link đặt lại đã được gửi</strong>
                <span>Kiểm tra email {recoveryForm.email} và bấm vào link để tiếp tục.</span>
              </div>
              <button type="button" className="hl-auth-resend" onClick={resendRecoveryEmail} disabled={recoveryLoading || resendCountdown > 0}>
                {recoveryLoading ? 'Đang gửi lại email...' : resendCountdown > 0 ? `Gửi lại email sau ${resendCountdown}s` : 'Gửi lại email'}
              </button>
            </>
          ) : (
            <>
              <label className="hl-auth-label">
                    Mật khẩu mới
                    <span className={`hl-auth-input ${recoveryErrors.password ? 'has-error' : ''}`}>
                      <LockKeyhole size={19} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới"
                        value={recoveryForm.password}
                        onChange={(event) => updateRecovery('password', event.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="hl-auth-eye"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </span>
                    <small className="hl-auth-helper">Mật khẩu mạnh cần tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.</small>
                    {recoveryErrors.password && <small className="hl-auth-error">{recoveryErrors.password}</small>}
              </label>
              <label className="hl-auth-label">
                    Xác nhận mật khẩu mới
                    <span className={`hl-auth-input ${recoveryErrors.confirmPassword ? 'has-error' : ''}`}>
                      <LockKeyhole size={19} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        value={recoveryForm.confirmPassword}
                        onChange={(event) => updateRecovery('confirmPassword', event.target.value)}
                        autoComplete="new-password"
                      />
                    </span>
                    {recoveryErrors.confirmPassword && <small className="hl-auth-error">{recoveryErrors.confirmPassword}</small>}
              </label>
            </>
          )}
        </div>

        {recoveryStep !== 2 && <div className="hl-auth-recovery-actions">
          <button type="button" className="hl-auth-submit" onClick={handleRecoverySubmit} disabled={recoveryLoading}>
            {buttonLabel}
          </button>
          <button
            type="button"
            className="hl-auth-recovery-back"
            onClick={backToLogin}
            disabled={recoveryLoading}
          >
            Quay lại đăng nhập
          </button>
        </div>}
        {recoveryStep === 2 && <button type="button" className="hl-auth-recovery-back" onClick={backToLogin}>Quay lại đăng nhập</button>}
      </div>
    )
  }

  const renderEmailVerification = () => (
    <div className={`hl-auth-recovery ${verificationLoading ? 'is-loading' : ''}`}>
      <div className="hl-auth-heading hl-auth-heading--compact">
        <span className="hl-auth-kicker">Xác thực tài khoản</span>
        <h1>Xác thực email của bạn</h1>
        <p>
          Mã xác thực đã được gửi tới <strong>{authEmail || 'email của bạn'}</strong>. Nhập mã để hoàn tất đăng ký.
        </p>
      </div>

      {verificationSuccess && <div className="hl-auth-success" role="status">{verificationSuccess}</div>}

      <div className="hl-auth-step">
        <label className="hl-auth-label">
          Mã xác thực
          <span className={`hl-auth-input hl-auth-verification-code ${verificationError ? 'has-error' : ''}`}>
            <LockKeyhole size={19} />
            <input
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={verificationCode}
              onChange={(event) => {
                setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                setVerificationError('')
                setVerificationSuccess('')
              }}
              autoComplete="one-time-code"
              aria-label="Mã xác thực email"
            />
          </span>
          <small className="hl-auth-helper">Mã demo local: 123456</small>
          {verificationError && <small className="hl-auth-error">{verificationError}</small>}
        </label>
      </div>

      <div className="hl-auth-recovery-actions">
        <button type="button" className="hl-auth-submit" onClick={submitVerification} disabled={verificationLoading}>
          {verificationLoading ? 'Đang xác thực...' : 'Xác nhận email'}
        </button>
        <button type="button" className="hl-auth-resend" onClick={resendVerificationCode} disabled={verificationLoading || verificationCountdown > 0}>
          {verificationLoading ? 'Đang xử lý...' : verificationCountdown > 0 ? `Gửi lại mã sau ${verificationCountdown}s` : 'Gửi lại mã'}
        </button>
        <button type="button" className="hl-auth-recovery-back" onClick={backToLogin} disabled={verificationLoading}>
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  )

  return (
    <main className="hl-auth-page">
      <button className="hl-auth-back" type="button" onClick={onBack} aria-label="Quay lại landing page"><ArrowLeft size={18} /><span>Về trang chủ</span></button>
      <div className="hl-auth-shell">
        <section className="hl-auth-form-panel">
          <a className="hl-auth-logo" href="#top" onClick={onBack} aria-label="HocLuc.com"><Logo /></a>
          <div className="hl-auth-form-wrap">
            {isEmailVerification ? (
              renderEmailVerification()
            ) : isRecovery ? (
              renderRecoveryStep()
            ) : (
              <>
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
                <label className="hl-auth-label">Email<span className="hl-auth-input"><Mail size={19} /><input type="email" placeholder="you@example.com" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} autoComplete="email" /></span></label>
                <label className="hl-auth-label">Mật khẩu<span className="hl-auth-input"><LockKeyhole size={19} /><input type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" /><button type="button" className="hl-auth-eye" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
                {!isSignup && <button type="button" className="hl-auth-forgot" onClick={openRecovery}>Quên mật khẩu?</button>}
                <button type="button" className="hl-auth-submit" onClick={() => onContinue?.(authEmail)}>{isSignup ? 'Đăng ký ngay' : 'Đăng nhập'}</button>
                <p className="hl-auth-switch">{isSignup ? 'Bạn đã có tài khoản?' : 'Chưa có tài khoản?'} <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>{isSignup ? 'Đăng nhập' : 'Đăng ký'}</button></p>
              </>
            )}
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
