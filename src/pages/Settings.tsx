import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { ApiError } from '../lib/api'
import { AppShell } from '../components/AppShell'
import { BackArrowIcon } from '../components/Icons'

export function SettingsPage() {
  const { user, loading, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-faded">Loading…</div>
  }
  if (!user) return <Navigate to="/" replace />

  const home = user.role === 'teacher' ? '/teacher' : '/student'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setSaving(true)
    try {
      await updateProfile({
        name: name.trim() !== user!.name ? name.trim() : undefined,
        email: email.trim() !== user!.email ? email.trim() : undefined,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
      })
      setCurrentPassword('')
      setNewPassword('')
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell>
      <Link to={home} className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink">
        <BackArrowIcon size={15} /> Back
      </Link>

      <h1 className="mb-8 font-display text-3xl">Account settings</h1>

      <form onSubmit={onSubmit} className="max-w-lg space-y-6">
        <div className="card grid gap-5 p-6">
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {user.roll_number && (
            <div>
              <span className="label">Roll number</span>
              <p className="mono-stat text-sm">{user.roll_number}</p>
            </div>
          )}
        </div>

        <div className="card grid gap-5 p-6">
          <p className="label !mb-0">Change password</p>
          <div>
            <label className="label" htmlFor="current-password">Current password</label>
            <input
              id="current-password"
              type="password"
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required to set a new password"
            />
          </div>
          <div>
            <label className="label" htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-redpen/30 bg-redpen/5 px-3 py-2 text-sm text-redpen">
            {error}
          </p>
        )}
        {saved && (
          <p className="rounded-lg border border-teal/30 bg-teal/5 px-3 py-2 text-sm text-teal">
            Saved.
          </p>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </AppShell>
  )
}
