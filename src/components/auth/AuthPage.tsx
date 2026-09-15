import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, NotebookPen } from 'lucide-react'
import Logo from '../common/Logo'
import { getErrorMessage } from '../../lib/errors'
import {
  confirmAccount,
  login as loginAccount,
  registerStudent,
} from '../../services/authService'

const roles = [
  { id: 'student', label: 'Học sinh' },
  { id: 'teacher', label: 'Giáo viên' },
]

const passwordRequirementRules = [
  {
    key: 'length',
    label: 'Ít nhất 8 ký tự',
    missingLabel: '8 ký tự',
    message: 'Mật khẩu phải có ít nhất 8 ký tự.',
    test: (value: string) => value.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'Có chữ hoa',
    missingLabel: 'chữ hoa',
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa.',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    key: 'lowercase',
    label: 'Có chữ thường',
    missingLabel: 'chữ thường',
    message: 'Mật khẩu phải có ít nhất 1 chữ thường.',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    key: 'number',
    label: 'Có chữ số',
    missingLabel: 'chữ số',
    message: 'Mật khẩu phải có ít nhất 1 chữ số.',
    test: (value: string) => /\d/.test(value),
  },
  {
    key: 'special',
    label: 'Có ký tự đặc biệt',
    missingLabel: 'ký tự đặc biệt',
    message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt.',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
]

function getPasswordRequirements(value: string) {
  return passwordRequirementRules.map((rule) => ({
    ...rule,
    met: rule.test(value),
  }))
}

function validatePassword(value: string) {
  if (!value) return 'Vui lòng nhập mật khẩu.'
  return getPasswordRequirements(value).find((rule) => !rule.met)?.message || ''
}

function joinRequirementLabels(labels: string[]) {
  if (labels.length <= 1) return labels[0] || ''
  if (labels.length === 2) return `${labels[0]} và ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} và ${labels[labels.length - 1]}`
}

function getPasswordHelper(value: string) {
  if (!value) {
    return {
      text: 'Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
      isError: false,
    }
  }

  const missingRules = getPasswordRequirements(value).filter((rule) => !rule.met)
  if (!missingRules.length) return { text: '', isError: false }

  const needsLength = missingRules.some((rule) => rule.key === 'length')
  const missingLabels = missingRules
    .filter((rule) => rule.key !== 'length')
    .map((rule) => rule.missingLabel)

  if (needsLength) {
    return {
      text: missingLabels.length
        ? `Mật khẩu cần ít nhất 8 ký tự và thêm ${joinRequirementLabels(missingLabels)}.`
        : 'Mật khẩu cần ít nhất 8 ký tự.',
      isError: true,
    }
  }

  return {
    text:
      missingLabels.length === 1
        ? `Mật khẩu cần có ít nhất 1 ${missingLabels[0]}.`
        : `Mật khẩu cần thêm ${joinRequirementLabels(missingLabels)}.`,
    isError: true,
  }
}

function AuthPage({
  mode: initialMode = 'login',
  verificationEmail = '',
  onModeChange,
  onContinue,
  onBack,
}) {
  const [mode, setMode] = useState(initialMode)
  const [role, setRole] = useState('student')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: '',
  })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({})
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState('')
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [recoveryStep, setRecoveryStep] = useState(1)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [recoverySuccess, setRecoverySuccess] = useState('')
  const [recoveryForm, setRecoveryForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [recoveryErrors, setRecoveryErrors] = useState<Record<string, string>>({})
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

  useEffect(
    () => () => {
      clearRecoveryTimers()
      clearVerificationTimers()
    },
    []
  )

  const switchMode = (nextMode) => {
    setLoginError('')
    setLoginErrors({})
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
  const updateSignup = (key, value) => {
    setSignupForm((current) => ({ ...current, [key]: value }))
    setRegisterErrors((current) => ({ ...current, [key]: '', general: '' }))
    setRegisterSuccess('')
  }
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  const passwordIssues = (value) =>
    getPasswordRequirements(value)
      .filter((rule) => !rule.met)
      .map((rule) => rule.label)
  const passwordHelper = getPasswordHelper(authPassword)
  const currentVerificationEmail = verificationEmail || authEmail
  const verificationCountdownLabel = `00:${String(verificationCountdown).padStart(2, '0')}`

  const submitRecoveryEmail = () => {
    const nextErrors: Record<string, string> = {}
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
    const nextErrors: Record<string, string> = {}
    const issues = passwordIssues(recoveryForm.password)

    if (!recoveryForm.password) nextErrors.password = 'Vui lòng nhập mật khẩu mới.'
    else if (issues.length) nextErrors.password = issues.join(' · ')
    if (!recoveryForm.confirmPassword)
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.'
    else if (recoveryForm.password !== recoveryForm.confirmPassword)
      nextErrors.confirmPassword = 'Hai mật khẩu chưa khớp.'

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

  const submitVerification = async () => {
    if (verificationLoading) return
    const code = verificationCode.trim()
    if (!code) {
      setVerificationError('Vui lòng nhập mã xác nhận.')
      return
    }
    if (!currentVerificationEmail) {
      setVerificationError('Không tìm thấy email đăng ký. Vui lòng đăng ký lại.')
      return
    }

    setVerificationLoading(true)
    setVerificationError('')
    setVerificationSuccess('')
    clearVerificationTimers()
    try {
      await confirmAccount({
        email: currentVerificationEmail,
        otp: code,
      })
      setVerificationCode('')
      clearVerificationTimers()
      resetRecovery()
      switchMode('login')
    } catch (error) {
      const fieldErrors = error?.errors && typeof error.errors === 'object' ? error.errors : {}
      setVerificationError(
        fieldErrors.otp ||
          fieldErrors.code ||
          fieldErrors.OTP ||
          getErrorMessage(error) ||
          'Xác nhận tài khoản không thành công. Vui lòng kiểm tra mã và thử lại.'
      )
    } finally {
      setVerificationLoading(false)
    }
  }

  const handleVerificationResend = () => {
    if (verificationLoading || verificationCountdown > 0 || verificationSuccess) return
    setVerificationError('Chức năng gửi lại mã sẽ được cập nhật khi có API hỗ trợ.')
  }

  const submitLogin = async () => {
    if (loginLoading) return
    const email = authEmail.trim()
    const nextErrors: Record<string, string> = {}

    if (!email) nextErrors.email = 'Vui lòng nhập email.'
    else if (!isValidEmail(email)) nextErrors.email = 'Email không hợp lệ.'
    if (!authPassword) nextErrors.password = 'Vui lòng nhập mật khẩu.'

    setLoginErrors(nextErrors)
    setLoginError('')
    if (Object.keys(nextErrors).length) return

    setLoginLoading(true)
    try {
      await loginAccount({ email, password: authPassword })
      onContinue?.(email)
    } catch (error) {
      const fieldErrors = error?.errors && typeof error.errors === 'object' ? error.errors : {}
      setLoginErrors(fieldErrors)
      setLoginError(
        getErrorMessage(error) ||
          'Đăng nhập không thành công. Vui lòng kiểm tra email và mật khẩu.'
      )
    } finally {
      setLoginLoading(false)
    }
  }

  const submitRegister = async () => {
    if (registerLoading) return

    const email = authEmail.trim()
    const firstName = signupForm.firstName.trim()
    const lastName = signupForm.lastName.trim()
    const phone = signupForm.phone.trim()
    const nextErrors: Record<string, string> = {}

    if (!lastName) nextErrors.lastName = 'Vui lòng nhập họ.'
    if (!firstName) nextErrors.firstName = 'Vui lòng nhập tên.'
    if (!email) nextErrors.email = 'Vui lòng nhập email.'
    else if (!isValidEmail(email)) nextErrors.email = 'Email chưa đúng định dạng.'
    if (!phone) nextErrors.phone = 'Vui lòng nhập số điện thoại.'
    nextErrors.password = validatePassword(authPassword)
    if (!signupForm.confirmPassword) nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
    else if (authPassword !== signupForm.confirmPassword)
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.'

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) delete nextErrors[key]
    })
    setRegisterErrors(nextErrors)
    setRegisterSuccess('')
    if (Object.keys(nextErrors).length) return

    setRegisterLoading(true)
    try {
      const response = await registerStudent({
        email,
        password: authPassword,
        firstName,
        lastName,
        phone,
        role: 'STUDENT',
      })

      setRegisterSuccess(
        response?.message || 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.'
      )
      onContinue?.(email)
    } catch (error) {
      const fieldErrors = error?.errors && typeof error.errors === 'object' ? error.errors : {}
      setRegisterErrors({
        ...fieldErrors,
        general: getErrorMessage(error) || 'Đăng ký không thành công. Vui lòng thử lại.',
      })
    } finally {
      setRegisterLoading(false)
    }
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
    const buttonLabel = recoveryLoading
      ? isStepOne
        ? 'Đang gửi email...'
        : 'Đang đặt lại...'
      : isStepOne
        ? 'Gửi link đặt lại'
        : 'Xác nhận và đặt lại'

    return (
      <div className={`hl-auth-recovery ${recoveryLoading ? 'is-loading' : ''}`}>
        <div className="hl-auth-heading hl-auth-heading--compact">
          <span className="hl-auth-kicker">Khôi phục mật khẩu</span>
          <h1>
            {isStepOne
              ? 'Nhận link đặt lại mật khẩu'
              : isEmailSentStep
                ? 'Kiểm tra email của bạn'
                : 'Đặt lại mật khẩu mới'}
          </h1>
          <p>
            {isStepOne
              ? 'Nhập email đã đăng ký. Chúng tôi sẽ gửi link để bạn đặt lại mật khẩu.'
              : isEmailSentStep
                ? 'Hãy kiểm tra hộp thư và bấm vào link trong email để mở trang đặt lại mật khẩu.'
                : 'Tạo mật khẩu mới đủ mạnh và xác nhận lại để hoàn tất.'}
          </p>
        </div>

        {recoverySuccess && (
          <div className="hl-auth-success" role="status">
            {recoverySuccess}
          </div>
        )}

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
              {recoveryErrors.email && (
                <small className="hl-auth-error">{recoveryErrors.email}</small>
              )}
            </label>
          ) : isEmailSentStep ? (
            <>
              <div className="hl-auth-email-notice">
                <Mail size={28} />
                <strong>Link đặt lại đã được gửi</strong>
                <span>Kiểm tra email {recoveryForm.email} và bấm vào link để tiếp tục.</span>
              </div>
              <button
                type="button"
                className="hl-auth-resend"
                onClick={resendRecoveryEmail}
                disabled={recoveryLoading || resendCountdown > 0}
              >
                {recoveryLoading
                  ? 'Đang gửi lại email...'
                  : resendCountdown > 0
                    ? `Gửi lại email sau ${resendCountdown}s`
                    : 'Gửi lại email'}
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
                <small className="hl-auth-helper">
                  Mật khẩu mạnh cần tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.
                </small>
                {recoveryErrors.password && (
                  <small className="hl-auth-error">{recoveryErrors.password}</small>
                )}
              </label>
              <label className="hl-auth-label">
                Xác nhận mật khẩu mới
                <span
                  className={`hl-auth-input ${recoveryErrors.confirmPassword ? 'has-error' : ''}`}
                >
                  <LockKeyhole size={19} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    value={recoveryForm.confirmPassword}
                    onChange={(event) => updateRecovery('confirmPassword', event.target.value)}
                    autoComplete="new-password"
                  />
                </span>
                {recoveryErrors.confirmPassword && (
                  <small className="hl-auth-error">{recoveryErrors.confirmPassword}</small>
                )}
              </label>
            </>
          )}
        </div>

        {recoveryStep !== 2 && (
          <div className="hl-auth-recovery-actions">
            <button
              type="button"
              className="hl-auth-submit"
              onClick={handleRecoverySubmit}
              disabled={recoveryLoading}
            >
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
          </div>
        )}
        {recoveryStep === 2 && (
          <button type="button" className="hl-auth-recovery-back" onClick={backToLogin}>
            Quay lại đăng nhập
          </button>
        )}
      </div>
    )
  }

  const renderEmailVerification = () => (
    <div className={`hl-auth-recovery ${verificationLoading ? 'is-loading' : ''}`}>
      <div className="hl-auth-heading hl-auth-heading--compact">
        <h1>Xác thực email của bạn</h1>
        <p>
          Mã xác nhận đã được gửi tới <strong>{currentVerificationEmail || 'email của bạn'}</strong>. Nhập mã để
          hoàn tất đăng ký.
        </p>
      </div>

      <div className="hl-auth-step">
        <label className="hl-auth-label hl-auth-verification-label">
          Mã xác thực
          <span
            className={`hl-auth-input hl-auth-verification-code ${verificationError ? 'has-error' : ''}`}
          >
            <LockKeyhole size={19} />
            <input
              placeholder="Nhập mã xác nhận"
              value={verificationCode}
              onChange={(event) => {
                setVerificationCode(event.target.value)
                setVerificationError('')
                setVerificationSuccess('')
              }}
              autoComplete="one-time-code"
              aria-label="Mã xác nhận tài khoản"
            />
          </span>
          {verificationError && <small className="hl-auth-error">{verificationError}</small>}
        </label>
      </div>

      <div className="hl-auth-verification-resend">
        <span>Chưa nhận được mã?</span>
        <button
          type="button"
          onClick={handleVerificationResend}
          disabled={verificationLoading || verificationCountdown > 0 || Boolean(verificationSuccess)}
          title={
            verificationCountdown > 0
              ? `Có thể gửi lại sau ${verificationCountdownLabel}`
              : 'Chưa có API gửi lại mã'
          }
        >
          {verificationCountdown > 0 ? `Gửi lại sau ${verificationCountdownLabel}` : 'Gửi lại mã'}
        </button>
      </div>

      <div className="hl-auth-recovery-actions">
        <button
          type="button"
          className="hl-auth-submit"
          onClick={submitVerification}
          disabled={verificationLoading || Boolean(verificationSuccess)}
        >
          {verificationLoading ? 'Đang xác nhận...' : 'Xác nhận tài khoản'}
        </button>
        <button
          type="button"
          className="hl-auth-recovery-back"
          onClick={backToLogin}
          disabled={verificationLoading}
        >
          <ArrowLeft size={15} />
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  )

  return (
    <main className={`hl-auth-page ${isEmailVerification ? 'is-verification' : ''}`}>
      <button
        className="hl-auth-back"
        type="button"
        onClick={onBack}
        aria-label="Quay lại landing page"
      >
        <ArrowLeft size={18} />
        <span>Về trang chủ</span>
      </button>
      <div className="hl-auth-shell">
        <section className="hl-auth-form-panel">
          <a className="hl-auth-logo" href="#top" onClick={onBack} aria-label="HocLuc.com">
            <Logo />
          </a>
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
                  <p>
                    {isSignup
                      ? 'Bắt đầu hành trình chinh phục mục tiêu học tập.'
                      : 'Đăng nhập để tiếp tục hành trình học tập của bạn.'}
                  </p>
                </div>
                {!isSignup && (
                  <div className="hl-auth-tabs" role="tablist" aria-label="Loại tài khoản">
                    {roles.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={role === item.id ? 'is-active' : ''}
                        onClick={() => setRole(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
                <button type="button" className="hl-auth-google">
                  <span className="hl-google-mark">G</span>
                  <span>{isSignup ? 'Đăng ký với Google' : 'Đăng nhập với Google'}</span>
                </button>
                <div className="hl-auth-divider">
                  <span />
                  HOẶC
                  <span />
                </div>
                {isSignup && (
                  <div className="hl-auth-name-row">
                    <label className="hl-auth-label">
                      Họ
                      <span className={`hl-auth-input ${registerErrors.lastName ? 'has-error' : ''}`}>
                        <NotebookPen size={19} />
                        <input
                          type="text"
                          placeholder="Nguyễn"
                          value={signupForm.lastName}
                          onChange={(event) => updateSignup('lastName', event.target.value)}
                          autoComplete="family-name"
                        />
                      </span>
                      {registerErrors.lastName && (
                        <small className="hl-auth-error">{registerErrors.lastName}</small>
                      )}
                    </label>
                    <label className="hl-auth-label">
                      Tên
                      <span className={`hl-auth-input ${registerErrors.firstName ? 'has-error' : ''}`}>
                        <NotebookPen size={19} />
                        <input
                          type="text"
                          placeholder="An"
                          value={signupForm.firstName}
                          onChange={(event) => updateSignup('firstName', event.target.value)}
                          autoComplete="given-name"
                        />
                      </span>
                      {registerErrors.firstName && (
                        <small className="hl-auth-error">{registerErrors.firstName}</small>
                      )}
                    </label>
                  </div>
                )}
                <label className="hl-auth-label">
                  Email
                  <span
                    className={`hl-auth-input ${
                      isSignup
                        ? registerErrors.email
                          ? 'has-error'
                          : ''
                        : loginErrors.email
                          ? 'has-error'
                          : ''
                    }`}
                  >
                    <Mail size={19} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={authEmail}
                      onChange={(event) => {
                        setAuthEmail(event.target.value)
                        setLoginError('')
                        setLoginErrors((current) => ({ ...current, email: '' }))
                        setRegisterErrors((current) => ({ ...current, email: '', general: '' }))
                        setRegisterSuccess('')
                      }}
                      autoComplete="email"
                    />
                  </span>
                  {isSignup && registerErrors.email && (
                    <small className="hl-auth-error">{registerErrors.email}</small>
                  )}
                  {!isSignup && loginErrors.email && (
                    <small className="hl-auth-error">{loginErrors.email}</small>
                  )}
                </label>
                {isSignup && (
                  <label className="hl-auth-label">
                    Số điện thoại
                    <span className={`hl-auth-input ${registerErrors.phone ? 'has-error' : ''}`}>
                      <NotebookPen size={19} />
                      <input
                        type="tel"
                        placeholder="0901234567"
                        value={signupForm.phone}
                        onChange={(event) => updateSignup('phone', event.target.value)}
                        autoComplete="tel"
                      />
                    </span>
                    {registerErrors.phone && (
                      <small className="hl-auth-error">{registerErrors.phone}</small>
                    )}
                  </label>
                )}
                <label className="hl-auth-label">
                  Mật khẩu
                  <span
                    className={`hl-auth-input ${
                      isSignup
                        ? registerErrors.password
                          ? 'has-error'
                          : ''
                        : loginErrors.password
                          ? 'has-error'
                          : ''
                    }`}
                  >
                    <LockKeyhole size={19} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      value={authPassword}
                      onChange={(event) => {
                        setAuthPassword(event.target.value)
                        setLoginError('')
                        setLoginErrors((current) => ({ ...current, password: '' }))
                        setRegisterErrors((current) => ({
                          ...current,
                          password: '',
                          confirmPassword: '',
                          general: '',
                        }))
                        setRegisterSuccess('')
                      }}
                      autoComplete={isSignup ? 'new-password' : 'current-password'}
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
                  {isSignup && registerErrors.password && (
                    <small className="hl-auth-error">{registerErrors.password}</small>
                  )}
                  {!isSignup && loginErrors.password && (
                    <small className="hl-auth-error">{loginErrors.password}</small>
                  )}
                  {isSignup && !registerErrors.password && passwordHelper.text && (
                    <small
                      className={`hl-auth-password-note ${
                        passwordHelper.isError ? 'is-error' : ''
                      }`}
                    >
                      {passwordHelper.text}
                    </small>
                  )}
                </label>
                {isSignup && (
                  <label className="hl-auth-label">
                    Xác nhận mật khẩu
                    <span
                      className={`hl-auth-input ${registerErrors.confirmPassword ? 'has-error' : ''}`}
                    >
                      <LockKeyhole size={19} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        value={signupForm.confirmPassword}
                        onChange={(event) => updateSignup('confirmPassword', event.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="hl-auth-eye"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </span>
                    {registerErrors.confirmPassword && (
                      <small className="hl-auth-error">{registerErrors.confirmPassword}</small>
                    )}
                  </label>
                )}
                {!isSignup && loginError && <small className="hl-auth-error">{loginError}</small>}
                {isSignup && registerSuccess && (
                  <div className="hl-auth-success" role="status">
                    {registerSuccess}
                  </div>
                )}
                {isSignup && registerErrors.general && (
                  <small className="hl-auth-error">{registerErrors.general}</small>
                )}
                {!isSignup && (
                  <button type="button" className="hl-auth-forgot" onClick={openRecovery}>
                    Quên mật khẩu?
                  </button>
                )}
                <button
                  type="button"
                  className="hl-auth-submit"
                  disabled={isSignup ? registerLoading : loginLoading}
                  onClick={isSignup ? submitRegister : submitLogin}
                >
                  {isSignup
                    ? registerLoading
                      ? 'Đang đăng ký...'
                      : 'Đăng ký ngay'
                    : loginLoading
                      ? 'Đang đăng nhập...'
                      : 'Đăng nhập'}
                </button>
                <p className="hl-auth-switch">
                  {isSignup ? 'Bạn đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                  <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
                    {isSignup ? 'Đăng nhập' : 'Đăng ký'}
                  </button>
                </p>
              </>
            )}
          </div>
        </section>
        <aside className="hl-auth-art" aria-label="Minh hoạ học tập">
          <div className="hl-auth-art-copy">
            <span className="hl-auth-quote">“</span>
            <h2>
              Kiến thức hôm nay,
              <br />
              nền tảng ngày mai.
            </h2>
            <p>Học đúng cách, tiến bộ vững vàng cùng HocLuc.com</p>
          </div>
          <img
            className="hl-auth-art-image"
            src="/LoginPage.png"
            alt="Minh hoạ sách vở và dụng cụ học tập"
          />
        </aside>
      </div>
    </main>
  )
}

export default AuthPage
