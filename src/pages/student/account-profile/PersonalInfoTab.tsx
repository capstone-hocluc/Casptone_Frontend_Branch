import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Camera, CheckCircle2, Loader2, Lock } from 'lucide-react'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { getErrorMessage } from '../../../lib/errors'
import { showErrorToast } from '../../../lib/toastBus'
import { updateProfile, uploadAvatar } from '../../../services/userService'
import type { UserProfile } from '../../../services/userService'

function buildDraft(profile: UserProfile | null) {
  return {
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    displayName: profile?.displayName || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    timezone: profile?.timezone || '',
    language: profile?.language || '',
  }
}

function PersonalInfoTab() {
  const { profile, loadCurrentUser } = useCurrentUser()
  const [draft, setDraft] = useState(() => buildDraft(profile))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const savedTimer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
      window.clearTimeout(savedTimer.current)
    },
    [avatarPreview]
  )

  const displayName =
    profile?.displayName ||
    [profile?.lastName, profile?.firstName].filter(Boolean).join(' ') ||
    profile?.email ||
    'Học sinh'

  const updateField = (key: keyof ReturnType<typeof buildDraft>, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSaved(false)
  }

  const resetDraft = () => {
    setDraft(buildDraft(profile))
    setErrors({})
    setSaved(false)
  }

  const handleAvatarSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const nextPreview = URL.createObjectURL(file)
    setAvatarPreview((current) => {
      if (current) URL.revokeObjectURL(current)
      return nextPreview
    })

    setAvatarUploading(true)
    try {
      await uploadAvatar(file)
      await loadCurrentUser()
    } catch (error) {
      showErrorToast(getErrorMessage(error) || 'Tải ảnh đại diện không thành công.')
    } finally {
      setAvatarUploading(false)
      setAvatarPreview((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
    }
  }

  const submit = async () => {
    if (saving) return
    setSaving(true)
    setSaved(false)
    setErrors({})
    try {
      await updateProfile({
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        displayName: draft.displayName.trim(),
        phone: draft.phone.trim(),
        bio: draft.bio,
        timezone: draft.timezone,
        language: draft.language,
      })
      const updated = await loadCurrentUser()
      setDraft(buildDraft(updated))
      setSaved(true)
      window.clearTimeout(savedTimer.current)
      savedTimer.current = window.setTimeout(() => setSaved(false), 2600)
    } catch (error) {
      const fieldErrors =
        error?.errors && typeof error.errors === 'object' ? error.errors : {}
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) {
        showErrorToast(getErrorMessage(error) || 'Cập nhật thông tin không thành công.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="hl-account-panel-card">
      <div className="hl-account-panel-heading">
        <h2>Hồ sơ</h2>
      </div>

      <div className="hl-account-avatar-row">
        <div className="hl-account-avatar">
          <img
            src={avatarPreview || profile?.avatarUrl || '/avatar-minhanh.jpg'}
            alt={displayName}
          />
          <button
            type="button"
            className="hl-account-avatar-edit"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            aria-label="Đổi ảnh đại diện"
          >
            {avatarUploading ? (
              <Loader2 size={14} className="hl-account-spin" />
            ) : (
              <Camera size={14} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hl-account-avatar-input"
            onChange={handleAvatarSelect}
          />
        </div>
        <div className="hl-account-avatar-text">
          <strong>{displayName}</strong>
          <span>JPG hoặc PNG, tối đa 2 MB</span>
        </div>
      </div>

      <div className="hl-account-form">
        <label>
          Họ
          <input
            value={draft.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
          />
          {errors.lastName && <small className="hl-form-error">{errors.lastName}</small>}
        </label>
        <label>
          Tên
          <input
            value={draft.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
          />
          {errors.firstName && <small className="hl-form-error">{errors.firstName}</small>}
        </label>
        <label>
          Tên hiển thị
          <input
            value={draft.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
          />
          {errors.displayName && <small className="hl-form-error">{errors.displayName}</small>}
        </label>
        <label>
          Số điện thoại
          <input
            value={draft.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
          {errors.phone && <small className="hl-form-error">{errors.phone}</small>}
        </label>
        <label className="is-full">
          Email
          <span className="hl-account-email-field">
            <input value={profile?.email || ''} readOnly disabled />
            <span className="hl-account-fixed-badge">
              <Lock size={11} />
              Cố định
            </span>
          </span>
          <small className="hl-account-helper">
            Email dùng để đăng nhập và không thể thay đổi.
          </small>
        </label>
        <label className="is-full">
          Giới thiệu
          <textarea
            value={draft.bio}
            onChange={(event) => updateField('bio', event.target.value)}
          />
        </label>
        <label>
          Múi giờ
          <input
            value={draft.timezone}
            placeholder="Asia/Ho_Chi_Minh"
            onChange={(event) => updateField('timezone', event.target.value)}
          />
        </label>
        <label>
          Ngôn ngữ
          <input
            value={draft.language}
            placeholder="vi"
            onChange={(event) => updateField('language', event.target.value)}
          />
        </label>

        <div className="hl-account-form-actions">
          <button
            type="button"
            className="hl-account-primary"
            onClick={submit}
            disabled={saving}
          >
            {saving && <Loader2 size={14} className="hl-account-spin" />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button
            type="button"
            className="hl-account-secondary"
            onClick={resetDraft}
            disabled={saving}
          >
            Hủy
          </button>
          {saved && (
            <span className="hl-account-saved-badge" role="status">
              <CheckCircle2 size={14} />
              Đã lưu thay đổi
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export default PersonalInfoTab
