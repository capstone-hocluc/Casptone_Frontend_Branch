// Centralized order status presentation. Backend order.status is always
// authoritative - this only maps known values to Vietnamese labels/tones and
// falls back safely (renders the raw value) for anything not listed here,
// since the backend may introduce statuses we don't know about yet.

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  FAILED: 'Thanh toán thất bại',
  EXPIRED: 'Đã hết hạn',
}

export type OrderStatusTone = 'success' | 'warning' | 'danger' | 'neutral'

const STATUS_TONES: Record<string, OrderStatusTone> = {
  PENDING: 'warning',
  PAID: 'success',
  CANCELLED: 'neutral',
  FAILED: 'danger',
  EXPIRED: 'neutral',
}

export function getOrderStatusLabel(status: string) {
  return STATUS_LABELS[status] || status
}

export function getOrderStatusTone(status: string): OrderStatusTone {
  return STATUS_TONES[status] || 'neutral'
}

// An order can be paid/cancelled only while it's still PENDING. Backend
// remains authoritative - these just gate which actions the UI offers;
// the API itself still enforces the real rule.
export function canPayOrder(status: string) {
  return status === 'PENDING'
}

export function canCancelOrder(status: string) {
  return status === 'PENDING'
}
