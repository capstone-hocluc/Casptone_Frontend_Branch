import { request } from '../lib/api'

export interface CartItem {
  courseId: string
  title: string
  track?: string
  startDate?: string
  endDate?: string
  price?: number
  addedAt?: string
}

export interface Cart {
  items: CartItem[]
  itemCount: number
  totalAmount: number
}

export interface AddCartItemRequest {
  courseId: string
}

export async function getCart() {
  return request<Cart>('/api/v1/cart', { auth: true })
}

export async function addCartItem(courseId: string) {
  return request<Cart>('/api/v1/cart/items', {
    method: 'POST',
    body: { courseId } satisfies AddCartItemRequest,
    auth: true,
  })
}

export async function removeCartItem(courseId: string) {
  return request<Cart>(`/api/v1/cart/items/${encodeURIComponent(courseId)}`, {
    method: 'DELETE',
    auth: true,
  })
}
