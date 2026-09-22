export const DEFAULT_ERROR_MESSAGES = {
  400: 'Dữ liệu gửi lên không hợp lệ.',
  401: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu yêu cầu.',
  409: 'Dữ liệu bị xung đột, vui lòng thử lại.',
  422: 'Dữ liệu gửi lên không hợp lệ.',
  429: 'Bạn thao tác quá nhanh, vui lòng thử lại sau.',
  500: 'Có lỗi từ hệ thống, vui lòng thử lại sau.',
  NETWORK: 'Không thể kết nối máy chủ. Kiểm tra mạng và thử lại.',
}

/** True for errors worth retrying (transient network/server failures), false for 4xx client errors. */
export function isRetryable(error) {
  return error?.status === undefined || error.status >= 500
}

/**
 * Prefers the backend's own message (already user-facing, e.g. "Invalid email
 * or password") and only falls back to a generic message for statuses where
 * the backend gives nothing usable (network failure, 500 with no body, etc.).
 */
export function getErrorMessage(error) {
  if (error?.message && error.status !== 500) return error.message
  if (error?.status && DEFAULT_ERROR_MESSAGES[error.status])
    return DEFAULT_ERROR_MESSAGES[error.status]
  return DEFAULT_ERROR_MESSAGES.NETWORK
}

/**
 * Per-field validation messages the backend returns in `errors`
 * ({ fieldName: message }); empty when the error has none.
 */
export function getFieldErrors(error): Record<string, string> {
  return error?.errors && typeof error.errors === 'object' ? error.errors : {}
}
