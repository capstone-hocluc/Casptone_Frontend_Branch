const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'https://developments.hocluc.com'

const ACCESS_TOKEN_KEY = 'hocluc.accessToken'
const REFRESH_TOKEN_KEY = 'hocluc.refreshToken'
const REFRESH_PATH = '/api/v1/auth/refresh'
let refreshPromise: Promise<unknown> | null = null

export interface ApiResponse<T = unknown> {
  success: boolean
  status: number
  message?: string
  data?: T
  errors?: Record<string, string>
  path?: string
  timestamp?: string
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  retryOnUnauthorized?: boolean
}

function createHeaders(auth: boolean, isFormData: boolean) {
  const headers: Record<string, string> = {}
  // Leave Content-Type unset for FormData bodies so the browser can add the
  // multipart boundary itself - setting it manually breaks the upload.
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export async function request<T = unknown>(
  path: string,
  { method = 'GET', body, auth = false, retryOnUnauthorized = true }: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: createHeaders(auth, isFormData),
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch itself threw: no network / server unreachable, there is no response to read.
    throw new Error('Không thể kết nối máy chủ. Kiểm tra mạng và thử lại.')
  }

  const data = await response.json().catch(() => null)
  if (auth && response.status === 401 && retryOnUnauthorized && path !== REFRESH_PATH) {
    const refreshed = await refreshStoredTokens()
    if (refreshed) return request<T>(path, { method, body, auth, retryOnUnauthorized: false })
    handleSessionExpired()
  }

  if (!response.ok || data?.success === false) {
    if (auth && response.status === 401) {
      handleSessionExpired()
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

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens({ accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function handleSessionExpired() {
  clearTokens()
  if (window.location.pathname !== '/login') {
    sessionStorage.setItem(
      'hocluc.pendingToast',
      'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.'
    )
    window.location.href = '/login'
  }
}

async function refreshStoredTokens() {
  const storedRefreshToken = getRefreshToken()
  if (!storedRefreshToken) return false

  if (!refreshPromise) {
    refreshPromise = refreshToken(storedRefreshToken).finally(() => {
      refreshPromise = null
    })
  }

  try {
    await refreshPromise
    return true
  } catch {
    clearTokens()
    return false
  }
}

export interface TokenData {
  accessToken: string
  refreshToken: string
}

export async function refreshToken(storedRefreshToken = getRefreshToken()) {
  if (!storedRefreshToken) {
    throw new ApiError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', 401)
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${REFRESH_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    })
  } catch {
    throw new Error('Không thể kết nối máy chủ. Kiểm tra mạng và thử lại.')
  }

  const data = await response.json().catch(() => null)
  const { accessToken, refreshToken: nextRefreshToken } = data?.data || {}

  if (!response.ok || data?.success !== true || !accessToken || !nextRefreshToken) {
    throw new ApiError(
      data?.message || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
      response.status,
      data?.errors
    )
  }

  setTokens({ accessToken, refreshToken: nextRefreshToken })
  return data
}
