import { request } from '../lib/api'

export interface OrderItem {
  courseId: string
  courseTitle: string
  unitPrice: number
}

export interface Order {
  id: string
  orderCode: string
  status: string
  totalAmount: number
  createdAt: string
  expiresAt: string | null
  paidAt: string | null
  paymentAttempts: number
  items: OrderItem[]
}

export interface OrderPaymentResult {
  order: Order
  paymentUrl: string
}

export async function checkout(): Promise<OrderPaymentResult> {
  const response = await request<OrderPaymentResult>('/api/v1/orders/checkout', {
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

export async function payOrder(orderId: string): Promise<OrderPaymentResult> {
  const response = await request<OrderPaymentResult>(
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
