import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Circle, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react'
import { getErrorMessage } from '../../../lib/errors'
import { getPasswordRequirements, validatePassword } from '../../../lib/passwordRules'
import { showErrorToast } from '../../../lib/toastBus'
import { changePassword } from '../../../services/userService'

const emptyForm = { oldPassword: '', newPassword: '', confirmPassword: '' }

function SecurityTab() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const savedTimer = useRef<number | undefined>(undefined)

  const updateField = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSaved(false)
  }

  const requirements = getPasswordRequirements(form.newPassword)
  const mismatch = form.confirmPassword.length > 0 && form.confirmPassword !== form.newPassword

  const submit = async () => {
    if (saving) return
    const nextErrors: Record<string, string> = {}
    if (!form.oldPassword) nextErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.'
    const passwordIssue = validatePassword(form.newPassword)
    if (passwordIssue) nextErrors.newPassword = passwordIssue
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.'
    else if (form.newPassword !== form.confirmPassword)
      nextErrors.confirmPassword = 'Hai mật khẩu chưa khớp.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    setSaved(false)
    try {
      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })
      setForm(emptyForm)
      setSaved(true)
      window.clearTimeout(savedTimer.current)
      savedTimer.current = window.setTimeout(() => setSaved(false), 2600)
    } catch (error) {
      const fieldErrors =
        error?.errors && typeof error.errors === 'object' ? error.errors : {}
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) {
        showErrorToast(getErrorMessage(error) || 'Đổi mật khẩu không thành công.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="hl-account-panel-card hl-account-panel-card--narrow">
      <div className="hl-account-panel-heading hl-account-panel-heading--stacked">
        <h2>Đổi mật khẩu</h2>
        <p>Bảo mật tài khoản của bạn</p>
      </div>

      <div className="hl-account-form hl-account-security-form">
        <label className="is-full">
          Mật khẩu hiện tại
          <span className={`hl-account-password-input ${errors.oldPassword ? 'has-error' : ''}`}>
            <LockKeyhole size={16} />
            <input
              type={showOld ? 'text' : 'password'}
              value={form.oldPassword}
              onChange={(event) => updateField('oldPassword', event.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowOld((value) => !value)}
              aria-label={showOld ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
          {errors.oldPassword && <small className="hl-form-error">{errors.oldPassword}</small>}
        </label>
        <label className="is-full">
          Mật khẩu mới
          <span className={`hl-account-password-input ${errors.newPassword ? 'has-error' : ''}`}>
            <LockKeyhole size={16} />
            <input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={(event) => updateField('newPassword', event.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew((value) => !value)}
              aria-label={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
          {errors.newPassword && <small className="hl-form-error">{errors.newPassword}</small>}
        </label>
        <label className="is-full">
          Xác nhận mật khẩu mới
          <span
            className={`hl-account-password-input ${errors.confirmPassword ? 'has-error' : ''}`}
          >
            <LockKeyhole size={16} />
            <input
              type={showNew ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              autoComplete="new-password"
            />
          </span>
          {errors.confirmPassword && (
            <small className="hl-form-error">{errors.confirmPassword}</small>
          )}
          {!errors.confirmPassword && mismatch && (
            <small className="hl-account-mismatch">
              <AlertCircle size={13} />
              Mật khẩu xác nhận chưa trùng khớp
            </small>
          )}
        </label>

        <div className="is-full hl-account-password-rules">
          <strong>Mật khẩu cần đáp ứng</strong>
          <ul>
            {requirements.map((rule) => (
              <li key={rule.key} className={rule.met ? 'is-met' : ''}>
                {rule.met ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                {rule.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hl-account-form-actions">
          <button type="button" className="hl-account-primary" onClick={submit} disabled={saving}>
            {saving && <Loader2 size={14} className="hl-account-spin" />}
            {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </button>
          {saved && (
            <span className="hl-account-saved-badge" role="status">
              <CheckCircle2 size={14} />
              Đã cập nhật mật khẩu
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export default SecurityTab
