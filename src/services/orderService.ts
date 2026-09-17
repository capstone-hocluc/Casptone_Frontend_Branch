import { request } from '../lib/api'

export interface OrderItem {
  courseId: string
  courseTitle: string
  unitPrice: number
}

export interface Order {
  id: string
  orderCode: string
  paymentCode: string
  status: string
  totalAmount: number
  createdAt: string
  expiresAt: string | null
  paidAt: string | null
  paymentAttempts: number
  items: OrderItem[]
}

// Returned by checkout() and payOrder() - SePay bank-transfer/QR instructions.
// GET /orders/{orderId} does NOT include these fields (see getOrder below),
// so this data only ever comes fresh from one of those two calls.
export interface OrderPaymentData {
  order: Order
  paymentCode: string
  bankCode: string
  accountNumber: string
  accountName: string
  amount: number
  qrUrl: string
}

export async function checkout(): Promise<OrderPaymentData> {
  const response = await request<OrderPaymentData>('/api/v1/orders/checkout', {
    method: 'POST',
    auth: true,
  })
  if (!response.data) throw new Error('Phản hồi tạo đơn hàng không hợp lệ.')
  return response.data
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await request<Order>(`/api/v1/orders/${encodeURIComponent(orderId)}`, {
    auth: true,
  })
  if (!response.data) throw new Error('Không tìm thấy dữ liệu đơn hàng.')
  return response.data
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await request<Order[]>('/api/v1/orders/me', { auth: true })
  return response.data || []
}

export async function payOrder(orderId: string): Promise<OrderPaymentData> {
  const response = await request<OrderPaymentData>(
    `/api/v1/orders/${encodeURIComponent(orderId)}/pay`,
    { method: 'POST', auth: true }
  )
  if (!response.data) throw new Error('Phản hồi thanh toán không hợp lệ.')
  return response.data
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const response = await request<Order>(
    `/api/v1/orders/${encodeURIComponent(orderId)}/cancel`,
    { method: 'POST', auth: true }
  )
  if (!response.data) throw new Error('Phản hồi hủy đơn hàng không hợp lệ.')
  return response.data
}
