const TOKEN_KEY = 'ao.auth.token'

export function readToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function writeToken(token: string, rememberMe: boolean) {
  clearToken()
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export function decodeMockToken(token: string) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload)) as { sub: string; email: string }
  } catch {
    return null
  }
}

export function createMockToken(userId: string, email: string) {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ sub: userId, email, iat: Date.now() }))
  return `${header}.${payload}.mock`
}
