import { useState, type FormEvent } from 'react'
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react'
import Logo from '../components/common/Logo'
import Button from '../components/ui/Button'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { clearTokens } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import { login as loginAccount } from '../services/authService'

interface AdminLoginPageProps {
  onBack: () => void
  onSuccess: () => void
}

function AdminLoginPage({ onBack, onSuccess }: AdminLoginPageProps) {
  const { loadCurrentUser } = useCurrentUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loading) return

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Vui lòng nhập email và mật khẩu.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await loginAccount({ email: trimmedEmail, password })
      const profile = await loadCurrentUser()

      if (profile.role !== 'ADMINISTRATOR') {
        clearTokens()
        setError('Tài khoản này không có quyền quản trị viên.')
        return
      }

      onSuccess()
    } catch (requestError) {
      clearTokens()
      setError(getErrorMessage(requestError) || 'Email hoặc mật khẩu không đúng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface-soft px-4 py-8">
      <section
        className="w-full max-w-[420px] rounded-2xl border border-border-primary bg-surface p-8 shadow-[0_24px_60px_-36px_rgba(17,24,58,0.35)] sm:p-9"
        aria-labelledby="admin-login-title"
      >
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.12em] text-primary">
            <ShieldCheck size={14} aria-hidden="true" />
            KHU VỰC QUẢN TRỊ
          </span>
          <h1 id="admin-login-title" className="mt-2 text-[28px] font-bold leading-tight text-text-heading">
            Đăng nhập quản trị
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-body">
            Đăng nhập bằng tài khoản administrator để tiếp tục.
          </p>
        </div>

        <form className="grid gap-2" onSubmit={handleSubmit}>
          <label htmlFor="admin-email" className="mt-2 text-[13px] font-bold text-text-strong">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            className="h-11 w-full rounded-lg border border-border-primary bg-surface-soft px-3.5 text-[15px] text-text-heading outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <label htmlFor="admin-password" className="mt-2 text-[13px] font-bold text-text-strong">
            Mật khẩu
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            className="h-11 w-full rounded-lg border border-border-primary bg-surface-soft px-3.5 text-[15px] text-text-heading outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {error && (
            <p className="mt-2 text-[13px] leading-5 text-danger" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="md" className="mt-4 h-11 w-full" disabled={loading}>
            <LockKeyhole size={17} aria-hidden="true" />
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <button
          type="button"
          className="mx-auto mt-[18px] flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] text-text-body transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onBack}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Quay lại trang chủ
        </button>
      </section>
    </main>
  )
}

export default AdminLoginPage
