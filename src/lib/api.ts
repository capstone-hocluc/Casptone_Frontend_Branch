const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://api.hocluc.com'

const ACCESS_TOKEN_KEY = 'hocluc.accessToken'
const REFRESH_TOKEN_KEY = 'hocluc.refreshToken'

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
}

async function request(path: string, { method = 'GET', body, auth = false }: RequestOptions = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch itself threw: no network / server unreachable, there is no response to read.
    throw new Error('Không thể kết nối máy chủ. Kiểm tra mạng và thử lại.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok || data?.success === false) {
    // A 401 on a call that carried a token means the session itself is invalid/expired -
    // every caller would otherwise have to remember to handle this the same way, so it's
    // handled once, here, instead of per-component.
    if (auth && response.status === 401) {
      clearTokens()
      // window.location.href below is a full page navigation, which unmounts
      // React (and any in-memory toast) before it can render - so the message
      // is handed off through sessionStorage and shown after the reload instead.
      sessionStorage.setItem(
        'hocluc.pendingToast',
        'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.'
      )
      window.location.href = '/login'
    }
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data?.errors
    )
  }
  return data
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setTokens({ accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export async function login(email: string, password: string) {
  const data = await request('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  const { accessToken, refreshToken } = data?.data || {}
  if (!accessToken || !refreshToken) {
    throw new ApiError('Đăng nhập không thành công. Máy chủ chưa trả về đầy đủ token.', 0)
  }
  setTokens({ accessToken, refreshToken })
  return data
}

export async function studentRegister(payload: unknown) {
  return request('/api/v1/auth/student-register', { method: 'POST', body: payload })
}

export async function confirmRegistration(payload: unknown) {
  return request('/api/v1/auth/confirm', { method: 'POST', body: payload })
}

export async function forgotPassword(email: string) {
  return request('/api/v1/auth/forgot-password', { method: 'POST', body: { email } })
}

export async function resetPassword(payload: unknown) {
  return request('/api/v1/auth/reset-password', { method: 'POST', body: payload })
}

export async function getMyProfile() {
  return request('/api/v1/users/me', { auth: true })
}
