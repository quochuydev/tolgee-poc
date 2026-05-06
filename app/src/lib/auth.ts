const KEY = 'tolgee-poc:auth'

export type Session = { username: string }

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getSession(): Session | null {
  if (!isBrowser()) return null
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function login(username: string) {
  if (!isBrowser()) return
  window.localStorage.setItem(KEY, JSON.stringify({ username }))
}

export function logout() {
  if (!isBrowser()) return
  window.localStorage.removeItem(KEY)
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}
