import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { StudentExamRow, StudentSubject } from '../../lib/api'
import { AppShell } from '../../components/AppShell'
import { StatusPill } from '../../components/StatusPill'
import { EmptyState } from '../../components/EmptyState'
import { ArrowIcon, BackArrowIcon, PageIcon, subjectAccent } from '../../components/Icons'

export function SubjectExams() {
  const { subjectId } = useParams()
  const id = Number(subjectId)

  const { data: subjects } = useQuery({
    queryKey: ['my-subjects'],
    queryFn: () => api.get<StudentSubject[]>('/subjects/me'),
  })
  const subject = subjects?.find((s) => s.id === id)

  const { data: exams, isLoading } = useQuery({
    queryKey: ['subject-exams', subjectId],
    queryFn: () => api.get<StudentExamRow[]>(`/subjects/${subjectId}/exams`),
    // Keep the list fresh while any exam in it is still being marked.
    refetchInterval: (query) =>
      query.state.data?.some((e) => e.status === 'evaluating') ? 4000 : false,
  })

  return (
    <AppShell>
      <Link to="/student" className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink">
        <BackArrowIcon size={15} /> All subjects
      </Link>

      <div className="mb-8">
        <div className="mb-2 h-1.5 w-24 rounded-full" style={{ background: subjectAccent(id) }} />
        <h1 className="font-display text-3xl">{subject?.name ?? 'Subject'}</h1>
        {subject && <p className="mt-1 text-sm text-faded">with {subject.teacher_name}</p>}
      </div>

      {isLoading && <p className="text-faded">Fetching your exams…</p>}

      {exams && exams.length === 0 && (
        <EmptyState
          icon={<PageIcon size={26} />}
          title="No exams filed yet"
          body="When your teacher uploads and marks an answer sheet of yours for this subject, it will appear here."
        />
      )}

      <div className="space-y-3">
        {exams?.map((e) => {
          const graded = e.my_score !== null
          const row = (
            <div
              className={`exam-row ${graded ? '' : 'pointer-events-none'}`}
              style={{ borderLeftColor: subjectAccent(id) }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg leading-tight">{e.title}</p>
                <p className="text-xs text-faded">
                  {new Date(e.created_at).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {graded ? (
                <span className="mono-stat text-sm font-semibold">
                  {e.my_score}
                  <span className="font-normal text-faded">/{e.total_marks}</span>
                  {e.my_percent !== null && (
                    <span className="ml-2 font-normal text-faded">({e.my_percent}%)</span>
                  )}
                </span>
              ) : (
                <StatusPill status={e.status} />
              )}
              {graded && <ArrowIcon size={18} className="shrink-0 text-faded" />}
            </div>
          )
          return graded ? (
            <Link key={e.exam_id} to={`/student/results/${e.exam_id}`}>
              {row}
            </Link>
          ) : (
            <div key={e.exam_id}>{row}</div>
          )
        })}
      </div>
    </AppShell>
  )
}
