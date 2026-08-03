import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api, getRefreshToken, hasSession, setTokens } from './api'
import type { Role, User } from './api'

interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: {
    email: string
    password: string
    name: string
    role: Role
    roll_number?: string
  }) => Promise<void>
  logout: () => void
  updateProfile: (data: {
    name?: string
    email?: string
    current_password?: string
    new_password?: string
  }) => Promise<User>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(hasSession())

  useEffect(() => {
    if (!hasSession()) return
    api
      .get<User>('/auth/me')
      .then(setUser)
      .catch(() => setTokens(null, null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await api.post<{ access_token: string; refresh_token: string }>('/auth/login', {
      email,
      password,
    })
    setTokens(tokens.access_token, tokens.refresh_token)
    const me = await api.get<User>('/auth/me')
    setUser(me)
    return me
  }, [])

  const register = useCallback(
    async (data: { email: string; password: string; name: string; role: Role; roll_number?: string }) => {
      await api.post('/auth/register', data)
      await login(data.email, data.password)
    },
    [login],
  )

  const logout = useCallback(() => {
    const refresh_token = getRefreshToken()
    if (refresh_token) {
      // Best-effort — the tokens are cleared client-side regardless.
      api.post('/auth/logout', { refresh_token }).catch(() => {})
    }
    setTokens(null, null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (data: { name?: string; email?: string; current_password?: string; new_password?: string }) => {
      const updated = await api.patch<User>('/auth/me', data)
      setUser(updated)
      return updated
    },
    [],
  )

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside AuthProvider')
  return ctx
}
