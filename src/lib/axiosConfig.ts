import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

let accessToken: string | null = localStorage.getItem('ig_access')
let refreshToken: string | null = localStorage.getItem('ig_refresh')

export function setTokens(access: string | null, refresh: string | null) {
  accessToken = access
  refreshToken = refresh
  if (access) localStorage.setItem('ig_access', access)
  else localStorage.removeItem('ig_access')
  if (refresh) localStorage.setItem('ig_refresh', refresh)
  else localStorage.removeItem('ig_refresh')
}

export function getRefreshToken() {
  return refreshToken
}

export function hasSession() {
  return accessToken !== null
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const axiosClient = axios.create({ baseURL: API_URL })

axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.set('authorization', `Bearer ${accessToken}`)
  }
  return config
})

// Refresh rotation issues a new refresh token on every call, so concurrent
// 401s must share one in-flight refresh rather than each spending the token.
let refreshInFlight: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken })
      .then((res) => {
        setTokens(res.data.access_token, res.data.refresh_token)
        return true
      })
      .catch(() => {
        setTokens(null, null)
        return false
      })
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

axiosClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ detail?: string }>) => {
    const original = error.config as RetriableConfig | undefined
    if (!error.response) {
      throw new ApiError(0, 'Cannot reach the Intelligrade server. Is the API running?')
    }
    if (error.response.status === 401 && original && !original._retried) {
      original._retried = true
      if (await tryRefresh()) return axiosClient(original)
    }
    const body = error.response.data
    const detail = body && typeof body.detail === 'string' ? body.detail : error.response.statusText
    throw new ApiError(error.response.status, detail)
  },
)
