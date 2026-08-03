import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { StudentResult } from '../lib/api'
import { AppShell } from '../components/AppShell'
import { Marginalia } from '../components/Marginalia'
import { ScoreGauge } from '../components/ScoreGauge'
import { StatusPill } from '../components/StatusPill'
import { BackArrowIcon, PageIcon } from '../components/Icons'
import { EmptyState } from '../components/EmptyState'

/** The Remarks screen — one component shared by teacher and student routes;
 * only the API path (and its permission check) differs. */
export function RemarksPage({ viewer }: { viewer: 'teacher' | 'student' }) {
  const { examId, studentId } = useParams()
  const path =
    viewer === 'teacher' ? `/exams/${examId}/results/${studentId}` : `/results/${examId}`

  const { data, isLoading, error } = useQuery({
    queryKey: ['result', viewer, examId, studentId],
    queryFn: () => api.get<StudentResult>(path),
  })

  const backTo = viewer === 'teacher' ? `/teacher/exams/${examId}/results` : '/student'

  return (
    <AppShell>
      <Link to={backTo} className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink">
        <BackArrowIcon size={15} /> {viewer === 'teacher' ? 'All students' : 'My subjects'}
      </Link>

      {isLoading && <p className="text-faded">Fetching the marked script…</p>}
      {error && (
        <EmptyState
          icon={<PageIcon size={26} />}
          title="No result here yet"
          body={(error as Error).message}
        />
      )}

      {data && (
        <>
          <div className="card mb-6 flex flex-col gap-6 p-6 wide:flex-row wide:items-center wide:justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-faded">{data.subject_name}</p>
              <h1 className="mb-2 font-display text-3xl">{data.exam_title}</h1>
              <p className="text-sm text-faded">
                {data.student_name}
                {data.roll_number && (
                  <span className="mono-stat ml-2 rounded border border-line px-1.5 py-0.5 text-xs">
                    Roll {data.roll_number}
                  </span>
                )}
                <span className="ml-3 align-middle">
                  <StatusPill status={data.status} />
                </span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <ScoreGauge percent={data.percent} label="overall" />
              <div>
                <p className="mono-stat text-3xl font-semibold">
                  {data.total_awarded ?? '—'}
                  <span className="text-base font-normal text-faded"> / {data.total_marks}</span>
                </p>
                <p className="text-xs uppercase tracking-wider text-faded">marks awarded</p>
              </div>
            </div>
          </div>

          {data.overall_remark && (
            <div className="card mb-8 p-6">
              <p className="label !mb-3">Overall remark</p>
              <Marginalia>{data.overall_remark}</Marginalia>
            </div>
          )}

          <div className="space-y-5">
            {data.questions.map((q) => (
              <article key={q.question_id} className="card p-6">
                <header className="mb-3 flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg leading-snug">
                    <span className="mono-stat mr-2 text-faded">Q{q.number}.</span>
                    {q.text}
                  </h2>
                  <span className="mono-stat shrink-0 rounded-lg border border-line px-2.5 py-1 text-sm font-semibold">
                    {q.awarded_marks}
                    <span className="font-normal text-faded">/{q.max_marks}</span>
                  </span>
                </header>

                {q.extracted_answer_snippet && (
                  <blockquote className="ruled mb-4 rounded-lg border border-line bg-paper/60 px-4 py-3 text-sm italic text-ink/80">
                    “{q.extracted_answer_snippet}”
                  </blockquote>
                )}

                <Marginalia>{q.remark}</Marginalia>
              </article>
            ))}
            {data.questions.length === 0 && (
              <EmptyState
                icon={<PageIcon size={26} />}
                title="Not graded yet"
                body="This script hasn't been through evaluation. Check back once marking finishes."
              />
            )}
          </div>
        </>
      )}
    </AppShell>
  )
}
