import { useState } from 'react'
import {
  AccountForm,
  AccountPanel,
  FormGroupTitle,
  SaveBar,
} from '../../../components/student/profile/AccountPanel'
import { Field, Input } from '../../../components/ui/Field'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { useSavedIndicator } from '../../../hooks/useSavedIndicator'
import { getErrorMessage, getFieldErrors } from '../../../lib/errors'
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

type Draft = ReturnType<typeof buildDraft>

interface FieldConfig {
  key: keyof Draft
  label: string
  type?: 'text' | 'date' | 'number'
  placeholder?: string
}

const personalFields: FieldConfig[] = [
  { key: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
  { key: 'gender', label: 'Giới tính', placeholder: 'MALE / FEMALE / ...' },
  { key: 'province', label: 'Tỉnh/Thành' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'schoolName', label: 'Trường học' },
  { key: 'grade', label: 'Khối lớp', type: 'number' },
  { key: 'graduationYear', label: 'Năm tốt nghiệp', type: 'number' },
  { key: 'academicTrack', label: 'Khối học', placeholder: 'NATURAL_SCIENCES / ...' },
]

const goalFields: FieldConfig[] = [
  { key: 'targetExam', label: 'Kỳ thi mục tiêu', placeholder: 'VNUHCM_DGNL / ...' },
  { key: 'targetExamYear', label: 'Năm thi', type: 'number' },
  { key: 'targetUniversity', label: 'Trường đại học mục tiêu' },
  { key: 'targetMajor', label: 'Ngành học mục tiêu' },
  { key: 'targetScore', label: 'Điểm mục tiêu', type: 'number' },
]

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
  const { saved, flash, clear } = useSavedIndicator()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (key: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    clear()
  }

  const submit = async () => {
    if (saving) return
    setSaving(true)
    clear()
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
      flash()
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) {
        showErrorToast(getErrorMessage(error) || 'Cập nhật hồ sơ học tập không thành công.')
      }
    } finally {
      setSaving(false)
    }
  }

  const renderFields = (fields: FieldConfig[]) =>
    fields.map(({ key, label, type, placeholder }) => (
      <Field key={key} label={label} error={errors[key]}>
        <Input
          type={type}
          value={draft[key]}
          placeholder={placeholder}
          onChange={(event) => updateField(key, event.target.value)}
        />
      </Field>
    ))

  return (
    <AccountPanel title="Hồ sơ học tập">
      <AccountForm>
        <FormGroupTitle>Thông tin học tập cá nhân</FormGroupTitle>
        {renderFields(personalFields)}

        <FormGroupTitle>Mục tiêu học tập</FormGroupTitle>
        {renderFields(goalFields)}

        {(studentProfile?.selfReportedWeakCategoryName ||
          studentProfile?.selfReportedStrongCategoryName) && (
          <>
            <FormGroupTitle>Điểm mạnh và điểm cần cải thiện</FormGroupTitle>
            <Field label="Điểm mạnh">
              <Input
                value={studentProfile?.selfReportedStrongCategoryName || ''}
                readOnly
                disabled
              />
            </Field>
            <Field label="Điểm cần cải thiện">
              <Input value={studentProfile?.selfReportedWeakCategoryName || ''} readOnly disabled />
            </Field>
            <p className="col-span-full text-xs text-text-muted">
              Điểm mạnh/điểm cần cải thiện hiện chưa thể chỉnh sửa tại đây - dữ liệu được giữ nguyên
              khi lưu.
            </p>
          </>
        )}

        <SaveBar
          saving={saving}
          saved={saved}
          submitLabel="Lưu thay đổi"
          savedLabel="Đã lưu thay đổi"
          onSubmit={submit}
        />
      </AccountForm>
    </AccountPanel>
  )
}

export default StudentInfoTab
