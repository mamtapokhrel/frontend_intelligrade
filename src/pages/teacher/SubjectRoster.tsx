import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '../../lib/api'
import type { RosterStudent } from '../../lib/api'
import { AppShell } from '../../components/AppShell'
import { EmptyState } from '../../components/EmptyState'
import { BackArrowIcon, UsersIcon, TrashIcon } from '../../components/Icons'

export function SubjectRosterPage() {
  const { subjectId } = useParams()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const { data: students, isLoading } = useQuery({
    queryKey: ['roster', subjectId],
    queryFn: () => api.get<RosterStudent[]>(`/subjects/${subjectId}/students`),
  })

  const unenroll = useMutation({
    mutationFn: (studentId: number) => api.delete(`/subjects/${subjectId}/students/${studentId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roster', subjectId] }),
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Could not remove student.'),
  })

  return (
    <AppShell>
      <Link to="/teacher/subjects" className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink">
        <BackArrowIcon size={15} /> All subjects
      </Link>

      <h1 className="mb-8 font-display text-3xl">Roster</h1>

      {error && (
        <p className="mb-4 rounded-lg border border-redpen/30 bg-redpen/5 px-4 py-2.5 text-sm text-redpen">
          {error}
        </p>
      )}

      {isLoading && <p className="text-faded">Opening the roster…</p>}
      {students && students.length === 0 && (
        <EmptyState
          icon={<UsersIcon size={26} />}
          title="No students enrolled yet"
          body="Students are enrolled automatically the first time their scanned answer sheet is matched in a batch upload."
        />
      )}

      {students && students.length > 0 && (
        <div className="card divide-y divide-line">
          <div className="flex items-center gap-4 px-5 py-2.5 text-xs uppercase tracking-wider text-faded">
            <span className="w-14">Roll</span>
            <span className="flex-1">Student</span>
            <span className="w-24 text-right">Scripts</span>
            <span className="w-20 text-right">Average</span>
            <span className="w-9" />
          </div>
          {students.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
              <span className="mono-stat w-14 shrink-0 text-sm text-faded">{s.roll_number ?? '—'}</span>
              <span className="min-w-0 flex-1 truncate">
                {s.name}
                <span className="ml-2 text-xs text-faded">{s.email}</span>
              </span>
              <span className="mono-stat w-24 text-right text-sm">{s.submission_count}</span>
              <span className="mono-stat w-20 text-right text-sm">
                {s.average_percent !== null ? `${s.average_percent}%` : '—'}
              </span>
              <span className="flex w-9 justify-end">
                <button
                  type="button"
                  className="text-faded transition hover:text-redpen"
                  aria-label={`Remove ${s.name} from roster`}
                  title="Remove from roster"
                  onClick={() => {
                    if (confirm(`Remove ${s.name} from this subject's roster?`)) unenroll.mutate(s.id)
                  }}
                >
                  <TrashIcon size={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
