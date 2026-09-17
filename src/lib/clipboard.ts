import { showErrorToast, showSuccessToast } from './toastBus'

// Copies the exact value given - never transform it (no trimming/casing),
// since callers use this for values like paymentCode that must match
// backend-provided text byte-for-byte.
export async function copyToClipboard(value: string, successMessage = 'Đã sao chép.') {
  try {
    await navigator.clipboard.writeText(value)
    showSuccessToast(successMessage)
  } catch {
    showErrorToast('Không thể sao chép, vui lòng thử lại.')
  }
}
