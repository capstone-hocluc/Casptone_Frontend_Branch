// Confirmed readable labels for known enum values. Anything not listed here
// falls back to a generic prettified version of the raw value instead of
// guessing a Vietnamese translation we can't confirm.
const EXAM_LABELS: Record<string, string> = {
  VNUHCM_DGNL: 'ĐGNL ĐHQG-HCM',
}

export function prettifyEnum(value?: string) {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatExamLabel(value?: string) {
  if (!value) return ''
  return EXAM_LABELS[value] || prettifyEnum(value)
}

export function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('vi-VN')
}

export function formatCoursePrice(price?: number, paid?: boolean) {
  if (paid === false || !price) return 'Miễn phí'
  return `${price.toLocaleString('vi-VN')} ₫`
}

export function formatDuration(totalSeconds?: number) {
  if (!totalSeconds || totalSeconds <= 0) return '0 phút'
  const totalMinutes = Math.round(totalSeconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} phút`
  if (minutes === 0) return `${hours} giờ`
  return `${hours} giờ ${minutes} phút`
}
