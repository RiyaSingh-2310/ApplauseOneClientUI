import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '@/services/auth.service'
import { ApiRequestError, UNAUTHORIZED_EVENT } from '@/services/errors'
import { clearToken, readToken, writeToken } from '@/services/token'
import type { AuthUser, LoginPayload, RegisterOutcome, RegisterPayload } from '@/types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  ready: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<RegisterOutcome>
  completeSession: (token: string, user: AuthUser, rememberMe?: boolean) => void
  refresh: () => Promise<AuthUser | null>
  logout: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components -- context is consumed by useAuth
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(() => !readToken())

  const refresh = useCallback(async () => {
    if (!readToken()) {
      setUser(null)
      return null
    }
    try {
      const nextUser = await authService.me()
      setUser(nextUser)
      return nextUser
    } catch {
      clearToken()
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    const token = readToken()
    if (!token) return

    let cancelled = false
    authService
      .me()
      .then((nextUser) => {
        if (!cancelled) setUser(nextUser)
      })
      .catch(() => {
        clearToken()
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onUnauthorized() {
      setUser(null)
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const completeSession = useCallback((token: string, nextUser: AuthUser, rememberMe = true) => {
    writeToken(token, rememberMe)
    setUser(nextUser)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const session = await authService.login({ email: payload.email, password: payload.password })
    completeSession(session.token, session.user, payload.rememberMe)
  }, [completeSession])

  const register = useCallback(
    async (payload: RegisterPayload): Promise<RegisterOutcome> => {
      const data = await authService.register({
        name: `${payload.firstName} ${payload.lastName}`.trim(),
        email: payload.email,
        password: payload.password,
        phone: payload.phone.trim() || undefined,
      })
      if (data?.token && data.user) {
        completeSession(data.token, data.user, true)
        return { status: 'authenticated' }
      }
      return {
        status: 'verification_required',
        message:
          'Please verify your email before signing in. Check your inbox for the activation link.',
      }
    },
    [completeSession],
  )

  const logout = useCallback(async () => {
    try {
      if (readToken()) await authService.logout()
    } catch (error) {
      if (!(error instanceof ApiRequestError) || error.status !== 401) {
        // Still discard the local session.
      }
    } finally {
      clearToken()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, register, completeSession, refresh, logout }),
    [user, ready, login, register, completeSession, refresh, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
