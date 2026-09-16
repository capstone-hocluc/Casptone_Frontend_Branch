import { useRef, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { getErrorMessage } from '../../../lib/errors'
import { showErrorToast } from '../../../lib/toastBus'
import { updateStudentProfile } from '../../../services/userService'
import type { StudentProfile } from '../../../services/userService'

function buildDraft(studentProfile: StudentProfile | undefined) {
  return {
    dateOfBirth: studentProfile?.dateOfBirth || '',
    gender: studentProfile?.gender || '',
    province: studentProfile?.province || '',
    address: studentProfile?.address || '',
    schoolName: studentProfile?.schoolName || '',
    grade: studentProfile?.grade != null ? String(studentProfile.grade) : '',
    graduationYear:
      studentProfile?.graduationYear != null ? String(studentProfile.graduationYear) : '',
    academicTrack: studentProfile?.academicTrack || '',
    targetUniversity: studentProfile?.targetUniversity || '',
    targetMajor: studentProfile?.targetMajor || '',
    targetExam: studentProfile?.targetExam || '',
    targetExamYear:
      studentProfile?.targetExamYear != null ? String(studentProfile.targetExamYear) : '',
    targetScore: studentProfile?.targetScore != null ? String(studentProfile.targetScore) : '',
  }
}

function toNumberOrUndefined(value: string) {
  if (value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

function StudentInfoTab() {
  const { profile, loadCurrentUser } = useCurrentUser()
  const studentProfile = profile?.studentProfile
  const [draft, setDraft] = useState(() => buildDraft(studentProfile))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const savedTimer = useRef<number | undefined>(undefined)

  const updateField = (key: keyof ReturnType<typeof buildDraft>, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setSaved(false)
  }

  const submit = async () => {
    if (saving) return
    setSaving(true)
    setSaved(false)
    setErrors({})
    try {
      await updateStudentProfile({
        // Overlapping general-profile fields: resend the current values so
        // this endpoint doesn't wipe them out - it is not fed from this form.
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        displayName: profile?.displayName,
        phone: profile?.phone,
        avatarUrl: profile?.avatarUrl,
        bio: profile?.bio,
        // Student-specific fields from this form.
        dateOfBirth: draft.dateOfBirth || undefined,
        gender: draft.gender || undefined,
        province: draft.province || undefined,
        address: draft.address || undefined,
        schoolName: draft.schoolName || undefined,
        grade: toNumberOrUndefined(draft.grade),
        graduationYear: toNumberOrUndefined(draft.graduationYear),
        academicTrack: draft.academicTrack || undefined,
        targetUniversity: draft.targetUniversity || undefined,
        targetMajor: draft.targetMajor || undefined,
        targetExam: draft.targetExam || undefined,
        targetExamYear: toNumberOrUndefined(draft.targetExamYear),
        targetScore: toNumberOrUndefined(draft.targetScore),
        // No category-picker source exists yet - never fabricate an id, only
        // resend whatever the backend already has on file.
        selfReportedWeakCategoryId: studentProfile?.selfReportedWeakCategoryId,
        selfReportedStrongCategoryId: studentProfile?.selfReportedStrongCategoryId,
      })
      // Refetch the canonical profile rather than trusting the PUT response
      // shape, matching the existing CurrentUserContext refresh strategy.
      const refreshed = await loadCurrentUser()
      setDraft(buildDraft(refreshed.studentProfile))
      setSaved(true)
      window.clearTimeout(savedTimer.current)
      savedTimer.current = window.setTimeout(() => setSaved(false), 2600)
    } catch (error) {
      const fieldErrors =
        error?.errors && typeof error.errors === 'object' ? error.errors : {}
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) {
        showErrorToast(getErrorMessage(error) || 'Cập nhật hồ sơ học tập không thành công.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="hl-account-panel-card">
      <div className="hl-account-panel-heading">
        <h2>Hồ sơ học tập</h2>
      </div>

      <div className="hl-account-form">
        <div className="is-full hl-account-form-group-title">Thông tin học tập cá nhân</div>
        <label>
          Ngày sinh
          <input
            type="date"
            value={draft.dateOfBirth}
            onChange={(event) => updateField('dateOfBirth', event.target.value)}
          />
          {errors.dateOfBirth && <small className="hl-form-error">{errors.dateOfBirth}</small>}
        </label>
        <label>
          Giới tính
          <input
            value={draft.gender}
            placeholder="MALE / FEMALE / ..."
            onChange={(event) => updateField('gender', event.target.value)}
          />
          {errors.gender && <small className="hl-form-error">{errors.gender}</small>}
        </label>
        <label>
          Tỉnh/Thành
          <input
            value={draft.province}
            onChange={(event) => updateField('province', event.target.value)}
          />
          {errors.province && <small className="hl-form-error">{errors.province}</small>}
        </label>
        <label>
          Địa chỉ
          <input
            value={draft.address}
            onChange={(event) => updateField('address', event.target.value)}
          />
          {errors.address && <small className="hl-form-error">{errors.address}</small>}
        </label>
        <label>
          Trường học
          <input
            value={draft.schoolName}
            onChange={(event) => updateField('schoolName', event.target.value)}
          />
          {errors.schoolName && <small className="hl-form-error">{errors.schoolName}</small>}
        </label>
        <label>
          Khối lớp
          <input
            type="number"
            value={draft.grade}
            onChange={(event) => updateField('grade', event.target.value)}
          />
          {errors.grade && <small className="hl-form-error">{errors.grade}</small>}
        </label>
        <label>
          Năm tốt nghiệp
          <input
            type="number"
            value={draft.graduationYear}
            onChange={(event) => updateField('graduationYear', event.target.value)}
          />
          {errors.graduationYear && (
            <small className="hl-form-error">{errors.graduationYear}</small>
          )}
        </label>
        <label>
          Khối học
          <input
            value={draft.academicTrack}
            placeholder="NATURAL_SCIENCES / ..."
            onChange={(event) => updateField('academicTrack', event.target.value)}
          />
          {errors.academicTrack && (
            <small className="hl-form-error">{errors.academicTrack}</small>
          )}
        </label>

        <div className="is-full hl-account-form-group-title">Mục tiêu học tập</div>
        <label>
          Kỳ thi mục tiêu
          <input
            value={draft.targetExam}
            placeholder="VNUHCM_DGNL / ..."
            onChange={(event) => updateField('targetExam', event.target.value)}
          />
          {errors.targetExam && <small className="hl-form-error">{errors.targetExam}</small>}
        </label>
        <label>
          Năm thi
          <input
            type="number"
            value={draft.targetExamYear}
            onChange={(event) => updateField('targetExamYear', event.target.value)}
          />
          {errors.targetExamYear && (
            <small className="hl-form-error">{errors.targetExamYear}</small>
          )}
        </label>
        <label>
          Trường đại học mục tiêu
          <input
            value={draft.targetUniversity}
            onChange={(event) => updateField('targetUniversity', event.target.value)}
          />
          {errors.targetUniversity && (
            <small className="hl-form-error">{errors.targetUniversity}</small>
          )}
        </label>
        <label>
          Ngành học mục tiêu
          <input
            value={draft.targetMajor}
            onChange={(event) => updateField('targetMajor', event.target.value)}
          />
          {errors.targetMajor && <small className="hl-form-error">{errors.targetMajor}</small>}
        </label>
        <label>
          Điểm mục tiêu
          <input
            type="number"
            value={draft.targetScore}
            onChange={(event) => updateField('targetScore', event.target.value)}
          />
          {errors.targetScore && <small className="hl-form-error">{errors.targetScore}</small>}
        </label>

        {(studentProfile?.selfReportedWeakCategoryName ||
          studentProfile?.selfReportedStrongCategoryName) && (
          <>
            <div className="is-full hl-account-form-group-title">
              Điểm mạnh và điểm cần cải thiện
            </div>
            <label>
              Điểm mạnh
              <input value={studentProfile?.selfReportedStrongCategoryName || ''} readOnly disabled />
            </label>
            <label>
              Điểm cần cải thiện
              <input value={studentProfile?.selfReportedWeakCategoryName || ''} readOnly disabled />
            </label>
            <div className="is-full hl-account-readonly-note">
              <small>
                Điểm mạnh/điểm cần cải thiện hiện chưa thể chỉnh sửa tại đây - dữ liệu được giữ
                nguyên khi lưu.
              </small>
            </div>
          </>
        )}

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

export default StudentInfoTab
