import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ExamSummary } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import { AppShell } from '../../components/AppShell'
import { ScoreGauge } from '../../components/ScoreGauge'
import { StatusPill } from '../../components/StatusPill'
import { EmptyState } from '../../components/EmptyState'
import { ArrowIcon, PlusIcon, QuillIcon, UploadCloudIcon, subjectAccent } from '../../components/Icons'

export function TeacherDashboard() {
  const { user } = useAuth()
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: () => api.get<ExamSummary[]>('/exams'),
  })

  const evaluated = (exams ?? []).filter((e) => e.status === 'evaluated')
  const averages = evaluated.map((e) => e.average_percent).filter((p): p is number => p !== null)
  const overallAvg = averages.length
    ? averages.reduce((a, b) => a + b, 0) / averages.length
    : null
  const totalScripts = (exams ?? []).reduce((a, e) => a + e.student_count, 0)
  const evaluating = (exams ?? []).filter((e) => e.status === 'evaluating').length

  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-redpen">Teacher's desk</p>
          <h1 className="font-display text-3xl">Good to see you, {firstName}.</h1>
        </div>
        <Link to="/teacher/exams/new" className="btn-primary">
          <PlusIcon size={16} /> New exam
        </Link>
      </div>

      {/* Stat row: score ring + three metric cards */}
      <div className="mb-8 grid gap-4 wide:grid-cols-[auto_1fr_1fr_1fr]">
        <div className="card flex items-center gap-4 px-6 py-5">
          <ScoreGauge percent={overallAvg} size={92} label="class avg" />
        </div>
        {[
          { label: 'Exams in the ledger', value: exams?.length ?? '—' },
          { label: 'Scripts received', value: totalScripts },
          { label: 'Evaluating now', value: evaluating },
        ].map((stat) => (
          <div key={stat.label} className="card flex flex-col justify-center px-6 py-5">
            <span className="mono-stat text-3xl font-semibold">{stat.value}</span>
            <span className="mt-1 text-xs uppercase tracking-wider text-faded">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Upload prompt card */}
      <Link
        to={exams && exams.length > 0 ? `/teacher/exams/${exams[0].id}` : '/teacher/exams/new'}
        className="card mb-8 flex items-center gap-5 border-dashed px-6 py-5 transition hover:border-indigo"
      >
        <div className="relative h-14 w-11 shrink-0" aria-hidden>
          <div className="card absolute inset-0 translate-x-1 translate-y-1 rotate-[5deg]" />
          <div className="card ruled absolute inset-0 flex rotate-[-3deg] items-center justify-center text-indigo">
            <UploadCloudIcon size={20} />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-display text-lg">Have a stack of scripts to mark?</p>
          <p className="text-sm text-faded">
            Open an exam and drop the scanned PDFs — one file per student, named by roll number.
          </p>
        </div>
        <ArrowIcon size={20} className="shrink-0 text-indigo" />
      </Link>

      {/* Exam ledger */}
      <h2 className="mb-4 font-display text-xl">The ledger</h2>
      {isLoading && <p className="text-faded">Opening the ledger…</p>}
      {exams && exams.length === 0 && (
        <EmptyState
          icon={<QuillIcon size={26} />}
          title="No exams yet"
          body="Create your first exam, add its questions and sample answers, and Intelligrade will handle the marking."
          action={
            <Link to="/teacher/exams/new" className="btn-primary">
              <PlusIcon size={16} /> Create an exam
            </Link>
          }
        />
      )}
      <div className="space-y-3">
        {exams?.map((exam) => (
          <Link
            key={exam.id}
            to={`/teacher/exams/${exam.id}`}
            className="exam-row"
            style={{ borderLeftColor: subjectAccent(exam.subject_id) }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-tight">{exam.title}</p>
              <p className="text-xs text-faded">
                {exam.subject_name} · {exam.question_count} questions ·{' '}
                <span className="mono-stat">{exam.total_marks}</span> marks
              </p>
            </div>
            <div className="hidden text-right wide:block">
              <p className="mono-stat text-sm">
                {exam.student_count} {exam.student_count === 1 ? 'script' : 'scripts'}
              </p>
              {exam.average_percent !== null && (
                <p className="mono-stat text-xs text-faded">avg {exam.average_percent}%</p>
              )}
            </div>
            <StatusPill status={exam.status} />
            <ArrowIcon size={18} className="shrink-0 text-faded" />
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
