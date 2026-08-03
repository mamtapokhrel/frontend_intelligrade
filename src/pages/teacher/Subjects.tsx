import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '../../lib/api'
import type { Subject } from '../../lib/api'
import { AppShell } from '../../components/AppShell'
import { EmptyState } from '../../components/EmptyState'
import { BackArrowIcon, BookIcon, EditIcon, PlusIcon, TrashIcon, UsersIcon } from '../../components/Icons'
import { subjectAccent } from '../../components/Icons'

export function SubjectsPage() {
  const queryClient = useQueryClient()
  const [newSubject, setNewSubject] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.get<Subject[]>('/subjects'),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['subjects'] })

  const createSubject = useMutation({
    mutationFn: (name: string) => api.post<Subject>('/subjects', { name }),
    onSuccess: () => {
      invalidate()
      setNewSubject('')
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Could not add subject.'),
  })

  const renameSubject = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      api.patch<Subject>(`/subjects/${id}`, { name }),
    onSuccess: () => {
      invalidate()
      setEditingId(null)
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Could not rename subject.'),
  })

  const deleteSubject = useMutation({
    mutationFn: (id: number) => api.delete(`/subjects/${id}`),
    onSuccess: invalidate,
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Could not delete subject.'),
  })

  return (
    <AppShell>
      <Link to="/teacher" className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink">
        <BackArrowIcon size={15} /> Back to the desk
      </Link>

      <h1 className="mb-8 font-display text-3xl">Subjects</h1>

      <div className="card mb-6 flex items-center gap-3 p-5">
        <input
          className="input"
          placeholder="New subject name"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newSubject.trim()) createSubject.mutate(newSubject.trim())
          }}
        />
        <button
          type="button"
          className="btn-primary shrink-0"
          disabled={!newSubject.trim() || createSubject.isPending}
          onClick={() => createSubject.mutate(newSubject.trim())}
        >
          <PlusIcon size={16} /> Add
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-redpen/30 bg-redpen/5 px-4 py-2.5 text-sm text-redpen">
          {error}
        </p>
      )}

      {isLoading && <p className="text-faded">Opening the register…</p>}
      {subjects && subjects.length === 0 && (
        <EmptyState
          icon={<BookIcon size={26} />}
          title="No subjects yet"
          body="Add a subject above — you'll pick it when setting up an exam."
        />
      )}

      <div className="space-y-3">
        {subjects?.map((s) => (
          <div key={s.id} className="exam-row" style={{ borderLeftColor: subjectAccent(s.id) }}>
            {editingId === s.id ? (
              <input
                className="input flex-1"
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editingName.trim())
                    renameSubject.mutate({ id: s.id, name: editingName.trim() })
                  if (e.key === 'Escape') setEditingId(null)
                }}
              />
            ) : (
              <span className="min-w-0 flex-1 truncate font-display text-lg">{s.name}</span>
            )}

            <div className="flex shrink-0 items-center gap-1">
              {editingId === s.id ? (
                <button
                  type="button"
                  className="btn-ghost !px-3 !py-1.5 text-xs"
                  disabled={!editingName.trim() || renameSubject.isPending}
                  onClick={() => renameSubject.mutate({ id: s.id, name: editingName.trim() })}
                >
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  className="p-2 text-faded transition hover:text-indigo"
                  aria-label={`Rename ${s.name}`}
                  onClick={() => {
                    setEditingId(s.id)
                    setEditingName(s.name)
                  }}
                >
                  <EditIcon size={16} />
                </button>
              )}
              <Link
                to={`/teacher/subjects/${s.id}/roster`}
                className="p-2 text-faded transition hover:text-indigo"
                aria-label={`View ${s.name}'s roster`}
                title="View roster"
              >
                <UsersIcon size={16} />
              </Link>
              <button
                type="button"
                className="p-2 text-faded transition hover:text-redpen"
                aria-label={`Delete ${s.name}`}
                title="Delete subject"
                onClick={() => {
                  if (confirm(`Delete "${s.name}"? This only works if it has no exams.`)) {
                    deleteSubject.mutate(s.id)
                  }
                }}
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
