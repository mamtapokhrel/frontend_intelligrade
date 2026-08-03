import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { LogoutIcon, QuillIcon, SettingsIcon, UsersIcon } from './Icons'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const home = user?.role === 'teacher' ? '/teacher' : '/student'

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <Link to={home} className="flex items-center gap-2">
            <QuillIcon size={22} className="text-indigo" />
            <span className="font-display text-lg font-semibold tracking-tight">Intelligrade</span>
          </Link>
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-faded wide:inline">
                {user.name}
                <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-xs capitalize">
                  {user.role}
                </span>
              </span>
              {user.role === 'teacher' && (
                <Link to="/teacher/subjects" className="p-2 text-faded transition hover:text-indigo" aria-label="Manage subjects" title="Subjects">
                  <UsersIcon size={18} />
                </Link>
              )}
              <Link to="/settings" className="p-2 text-faded transition hover:text-indigo" aria-label="Account settings" title="Settings">
                <SettingsIcon size={18} />
              </Link>
              <button
                className="btn-ghost !px-3 !py-1.5"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                <LogoutIcon size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  )
}
