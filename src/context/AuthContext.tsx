import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService } from '@/services/auth.service'
import { clearToken, readToken, writeToken } from '@/services/token'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  ready: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

// eslint-disable-next-line react-refresh/only-export-components -- context is consumed by useAuth
export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(() => !readToken())

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

  const login = useCallback(async (payload: LoginPayload) => {
    const session = await authService.login(payload)
    writeToken(session.token, payload.rememberMe)
    setUser(session.user)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const session = await authService.register(payload)
    writeToken(session.token, true)
    setUser(session.user)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
