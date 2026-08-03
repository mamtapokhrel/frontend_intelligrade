import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { StudentSubject } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import { AppShell } from '../../components/AppShell'
import { EmptyState } from '../../components/EmptyState'
import { ArrowIcon, BookIcon, SubjectGlyph, subjectAccent } from '../../components/Icons'

export function StudentDashboard() {
  const { user } = useAuth()
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['my-subjects'],
    queryFn: () => api.get<StudentSubject[]>('/subjects/me'),
  })

  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <AppShell>
      <div className="mb-8">
        <p className="mb-1 text-xs uppercase tracking-[0.18em] text-indigo">Student notebook</p>
        <h1 className="font-display text-3xl">Hello, {firstName}.</h1>
        {user?.roll_number && (
          <p className="mt-1 text-sm text-faded">
            Roll <span className="mono-stat">{user.roll_number}</span> — your scripts are filed
            under this number.
          </p>
        )}
      </div>

      {isLoading && <p className="text-faded">Opening your notebook…</p>}

      {subjects && subjects.length === 0 && (
        <EmptyState
          icon={<BookIcon size={26} />}
          title="No subjects yet"
          body="You'll see a subject here the first time a teacher files one of your answer sheets. Nothing for you to do but wait for marking day."
        />
      )}

      {/* Subject card grid — colored top bar keyed to subject */}
      <div className="grid gap-4 wide:grid-cols-3">
        {subjects?.map((s) => (
          <Link key={s.id} to={`/student/subjects/${s.id}`} className="card group overflow-hidden transition hover:shadow-md">
            <div className="h-1.5 w-full" style={{ background: subjectAccent(s.id) }} />
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span style={{ color: subjectAccent(s.id) }}>
                  <SubjectGlyph id={s.id} size={22} />
                </span>
                <ArrowIcon size={17} className="text-faded transition group-hover:text-ink" />
              </div>
              <h2 className="mb-1 font-display text-xl leading-tight">{s.name}</h2>
              <p className="text-xs text-faded">with {s.teacher_name}</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="mono-stat text-lg font-semibold">{s.exam_count}</p>
                  <p className="text-[10px] uppercase tracking-wider text-faded">exams</p>
                </div>
                <div className="text-right">
                  <p className="mono-stat text-lg font-semibold">
                    {s.average_percent !== null ? `${s.average_percent}%` : '—'}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-faded">running avg</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
