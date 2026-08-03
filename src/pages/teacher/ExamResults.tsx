import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '../../lib/api'
import type { ExamDetail, ExamStatus, ResultRow } from '../../lib/api'
import { downloadBlob, openBlob } from '../../lib/download'
import { AppShell } from '../../components/AppShell'
import { StatusPill } from '../../components/StatusPill'
import { ScoreGauge } from '../../components/ScoreGauge'
import { EmptyState } from '../../components/EmptyState'
import { ArrowIcon, BackArrowIcon, DownloadIcon, PageIcon, RetryIcon } from '../../components/Icons'

export function ExamResultsPage() {
  const { examId } = useParams()
  const queryClient = useQueryClient()

  const { data: exam } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => api.get<ExamDetail>(`/exams/${examId}`),
  })
  const evaluating = exam?.status === 'evaluating'

  const { data: status } = useQuery({
    queryKey: ['exam-status', examId],
    queryFn: () => api.get<ExamStatus>(`/exams/${examId}/status`),
    enabled: evaluating,
    refetchInterval: (query) =>
      query.state.data && query.state.data.status !== 'evaluating' ? false : 2500,
  })
  useEffect(() => {
    if (status && status.status !== 'evaluating' && evaluating) {
      queryClient.invalidateQueries({ queryKey: ['exam', examId] })
      queryClient.invalidateQueries({ queryKey: ['results', examId] })
    }
  }, [status, evaluating, examId, queryClient])

  const { data: rows } = useQuery({
    queryKey: ['results', examId],
    queryFn: () => api.get<ResultRow[]>(`/exams/${examId}/results`),
    refetchInterval: evaluating ? 3000 : false,
  })

  const retry = useMutation({
    mutationFn: (submissionId: number) =>
      api.post<ExamStatus>(`/exams/${examId}/submissions/${submissionId}/retry`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam', examId] })
      queryClient.invalidateQueries({ queryKey: ['exam-status', examId] })
      queryClient.invalidateQueries({ queryKey: ['results', examId] })
    },
  })

  const graded = (rows ?? []).filter((r) => r.percent !== null)
  const classAvg = graded.length
    ? graded.reduce((a, r) => a + (r.percent as number), 0) / graded.length
    : null

  const [actionError, setActionError] = useState<string | null>(null)

  async function exportCsv() {
    setActionError(null)
    try {
      const blob = await api.getBlob(`/exams/${examId}/results/export`)
      downloadBlob(blob, `${exam?.title ?? 'results'}.csv`)
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not export results.')
    }
  }

  async function viewPdf(submissionId: number) {
    setActionError(null)
    try {
      const blob = await api.getBlob(`/exams/${examId}/submissions/${submissionId}/pdf`)
      openBlob(blob)
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not open the scanned sheet.')
    }
  }

  return (
    <AppShell>
      <Link
        to={`/teacher/exams/${examId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink"
      >
        <BackArrowIcon size={15} /> Back to the exam
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-faded">{exam?.subject_name}</p>
          <h1 className="font-display text-3xl">{exam?.title} — results</h1>
          {exam && (
            <p className="mt-2 text-sm text-faded">
              <StatusPill status={exam.status} />
            </p>
          )}
        </div>
        <div className="flex items-center gap-5">
          {rows && rows.length > 0 && (
            <button type="button" className="btn-ghost" onClick={exportCsv}>
              <DownloadIcon size={16} /> Export CSV
            </button>
          )}
          <ScoreGauge percent={classAvg} label="class avg" />
        </div>
      </div>

      {actionError && (
        <p className="mb-6 rounded-lg border border-redpen/30 bg-redpen/5 px-4 py-2.5 text-sm text-redpen">
          {actionError}
        </p>
      )}

      {evaluating && (
        <div className="card mb-6 flex items-center gap-4 border-gold/40 px-5 py-4">
          <span className="pill pill-evaluating">
            <span className="pulse-dot" /> Evaluating
          </span>
          <p className="text-sm">
            {status ? `${status.done} of ${status.total} submissions graded` : 'Marking in progress…'}
            {status && status.error > 0 && (
              <span className="ml-2 text-redpen">({status.error} failed)</span>
            )}
          </p>
        </div>
      )}

      {rows && rows.length === 0 && (
        <EmptyState
          icon={<PageIcon size={26} />}
          title="No results yet"
          body="Nothing has been marked for this exam. Upload answer sheets and run evaluation first."
          action={
            <Link to={`/teacher/exams/${examId}`} className="btn-primary">
              Go to uploads
            </Link>
          }
        />
      )}

      {rows && rows.length > 0 && (
        <div className="card divide-y divide-line">
          <div className="flex items-center gap-4 px-5 py-2.5 text-xs uppercase tracking-wider text-faded">
            <span className="w-14">Roll</span>
            <span className="flex-1">Student</span>
            <span className="w-20 text-right">Score</span>
            <span className="w-24 text-right">Status</span>
            <span className="w-16" />
          </div>
          {rows.map((r) => (
            <div key={r.submission_id} className="flex items-center gap-4 px-5 py-3.5">
              <span className="mono-stat w-14 shrink-0 text-sm text-faded">{r.roll_number ?? '—'}</span>
              <span className="min-w-0 flex-1 truncate">{r.student_name}</span>
              <span className="mono-stat w-20 text-right text-sm font-semibold">
                {r.total_awarded !== null ? (
                  <>
                    {r.total_awarded}
                    <span className="font-normal text-faded">/{exam?.total_marks}</span>
                  </>
                ) : (
                  '—'
                )}
              </span>
              <span className="flex w-24 justify-end">
                <StatusPill status={r.status} />
              </span>
              <span className="flex w-16 justify-end gap-3">
                <button
                  type="button"
                  className="text-faded transition hover:text-indigo"
                  onClick={() => viewPdf(r.submission_id)}
                  aria-label={`View ${r.student_name}'s scanned sheet`}
                  title="View original scanned sheet"
                >
                  <PageIcon size={16} />
                </button>
                {r.status === 'done' && (
                  <Link
                    to={`/teacher/exams/${examId}/results/${r.student_id}`}
                    className="text-faded transition hover:text-indigo"
                    aria-label={`Open ${r.student_name}'s marked script`}
                  >
                    <ArrowIcon size={17} />
                  </Link>
                )}
                {r.status === 'error' && !evaluating && (
                  <button
                    className="text-redpen transition hover:opacity-70"
                    onClick={() => retry.mutate(r.submission_id)}
                    disabled={retry.isPending}
                    aria-label={`Retry evaluating ${r.student_name}'s script`}
                    title="Retry evaluation"
                  >
                    <RetryIcon size={17} />
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
