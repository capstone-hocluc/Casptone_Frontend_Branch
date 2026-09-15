import { clearTokens, confirmRegistration, login as loginRequest } from '../lib/api'

export function login({ email, password }) {
  return loginRequest(email.trim(), password)
}

export function confirmAccount({ email, otp }) {
  return confirmRegistration({ email, otp })
}

export function logout() {
  clearTokens()
}
