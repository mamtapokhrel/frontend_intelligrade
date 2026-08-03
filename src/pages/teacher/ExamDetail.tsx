import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { api, ApiError } from '../../lib/api'
import type { BatchUploadResult, ExamDetail, ExamStatus } from '../../lib/api'
import { openBlob } from '../../lib/download'
import { AppShell } from '../../components/AppShell'
import { StatusPill } from '../../components/StatusPill'
import { EmptyState } from '../../components/EmptyState'
import {
  AlertIcon,
  ArrowIcon,
  BackArrowIcon,
  CheckIcon,
  EditIcon,
  PageIcon,
  UploadCloudIcon,
} from '../../components/Icons'

export function ExamDetailPage() {
  const { examId } = useParams()
  const queryClient = useQueryClient()
  const [uploadReport, setUploadReport] = useState<BatchUploadResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { data: exam } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => api.get<ExamDetail>(`/exams/${examId}`),
  })

  const evaluating = exam?.status === 'evaluating'

  // Poll the status endpoint while evaluation runs, then refresh the exam.
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
      queryClient.invalidateQueries({ queryKey: ['exams'] })
    }
  }, [status, evaluating, examId, queryClient])

  const upload = useMutation({
    mutationFn: (files: File[]) => {
      const form = new FormData()
      files.forEach((f) => form.append('files', f))
      return api.postForm<BatchUploadResult>(`/exams/${examId}/submissions/batch`, form)
    },
    onSuccess: (report) => {
      setUploadReport(report)
      setUploadError(null)
      queryClient.invalidateQueries({ queryKey: ['exam', examId] })
    },
    onError: (err) =>
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed. Try again.'),
  })

  const evaluate = useMutation({
    mutationFn: () => api.post<ExamStatus>(`/exams/${examId}/evaluate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam', examId] })
      queryClient.invalidateQueries({ queryKey: ['exam-status', examId] })
    },
  })

  const [pdfError, setPdfError] = useState<string | null>(null)
  async function viewPdf(submissionId: number) {
    setPdfError(null)
    try {
      const blob = await api.getBlob(`/exams/${examId}/submissions/${submissionId}/pdf`)
      openBlob(blob)
    } catch (err) {
      setPdfError(err instanceof ApiError ? err.message : 'Could not open the scanned sheet.')
    }
  }

  const onDrop = useCallback((accepted: File[]) => upload.mutate(accepted), [upload])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: evaluating || upload.isPending,
  })

  const pendingCount =
    exam?.submissions.filter((s) => s.status === 'uploaded' || s.status === 'error').length ?? 0

  return (
    <AppShell>
      <Link to="/teacher" className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink">
        <BackArrowIcon size={15} /> Back to the desk
      </Link>

      {!exam ? (
        <p className="text-faded">Opening the exam…</p>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-faded">{exam.subject_name}</p>
              <h1 className="mb-2 font-display text-3xl">{exam.title}</h1>
              <p className="text-sm text-faded">
                {exam.question_count} {exam.question_count === 1 ? 'question' : 'questions'} ·{' '}
                <span className="mono-stat">{exam.total_marks}</span>{' '}
                marks · <StatusPill status={exam.status} />
              </p>
            </div>
            <div className="flex gap-3">
              {!evaluating && (
                <Link to={`/teacher/exams/${exam.id}/edit`} className="btn-ghost" aria-label="Edit exam">
                  <EditIcon size={16} /> Edit
                </Link>
              )}
              {exam.status === 'evaluated' && (
                <Link to={`/teacher/exams/${exam.id}/results`} className="btn-primary">
                  View results <ArrowIcon size={16} />
                </Link>
              )}
              {!evaluating && pendingCount > 0 && exam.question_count > 0 && (
                <button className="btn-redpen" onClick={() => evaluate.mutate()} disabled={evaluate.isPending}>
                  {evaluate.isPending ? 'Starting…' : `Evaluate ${pendingCount} script${pendingCount > 1 ? 's' : ''}`}
                </button>
              )}
            </div>
          </div>

          {evaluating && (
            <div className="card mb-8 flex items-center gap-5 border-gold/40 p-6">
              <span className="pill pill-evaluating !text-sm">
                <span className="pulse-dot" /> Evaluating
              </span>
              <div className="flex-1">
                <p className="font-display text-lg">
                  {status ? `${status.done} of ${status.total} submissions graded` : 'Marking in progress…'}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-700"
                    style={{ width: status && status.total ? `${(status.done / status.total) * 100}%` : '6%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Batch upload dropzone — dashed border, tilted paper-stack thumbnail */}
          <section
            {...getRootProps()}
            className={`card mb-4 flex cursor-pointer items-center gap-6 border-2 border-dashed p-7 transition ${
              isDragActive ? 'border-indigo bg-indigo/5' : 'border-line hover:border-indigo/60'
            } ${evaluating ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="relative h-20 w-16 shrink-0" aria-hidden>
              <div className="card absolute inset-0 translate-x-2 translate-y-1.5 rotate-[6deg]" />
              <div className="card absolute inset-0 translate-x-1 translate-y-0.5 rotate-[2deg]" />
              <div className="card ruled absolute inset-0 flex rotate-[-3deg] items-center justify-center text-indigo">
                <UploadCloudIcon size={24} />
              </div>
            </div>
            <div>
              <p className="font-display text-xl">
                {upload.isPending
                  ? 'Receiving the stack…'
                  : isDragActive
                    ? 'Drop the scripts here'
                    : 'Drop scanned answer sheets'}
              </p>
              <p className="mt-1 text-sm text-faded">
                One PDF per student, named by roll number — <span className="mono-stat">017.pdf</span>{' '}
                belongs to roll 017. Non-PDFs are turned away at the door.
              </p>
            </div>
          </section>

          {uploadError && (
            <p className="mb-4 rounded-lg border border-redpen/30 bg-redpen/5 px-4 py-2.5 text-sm text-redpen">
              {uploadError}
            </p>
          )}
          {uploadReport && (
            <div className="mb-6 space-y-2 text-sm">
              {uploadReport.created.length > 0 && (
                <p className="flex items-center gap-2 text-teal">
                  <CheckIcon size={16} /> {uploadReport.created.length} script
                  {uploadReport.created.length > 1 ? 's' : ''} matched and filed.
                </p>
              )}
              {uploadReport.unmatched.length > 0 && (
                <p className="flex items-center gap-2 text-gold">
                  <AlertIcon size={16} /> No student found for:{' '}
                  <span className="mono-stat">{uploadReport.unmatched.join(', ')}</span> — check the
                  roll numbers.
                </p>
              )}
              {uploadReport.rejected.length > 0 && (
                <p className="flex items-center gap-2 text-redpen">
                  <AlertIcon size={16} /> Not valid PDFs:{' '}
                  <span className="mono-stat">{uploadReport.rejected.join(', ')}</span>
                </p>
              )}
            </div>
          )}

          {/* Submissions list */}
          <h2 className="mb-4 font-display text-xl">Submissions</h2>
          {pdfError && (
            <p className="mb-4 rounded-lg border border-redpen/30 bg-redpen/5 px-4 py-2.5 text-sm text-redpen">
              {pdfError}
            </p>
          )}
          {exam.submissions.length === 0 ? (
            <EmptyState
              icon={<PageIcon size={26} />}
              title="No scripts yet"
              body="Drop a batch of scanned answer sheets above and they'll appear here, matched to students by roll number."
            />
          ) : (
            <div className="card divide-y divide-line">
              {exam.submissions.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="mono-stat w-14 shrink-0 text-sm text-faded">
                    {s.roll_number ?? '—'}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{s.student_name}</span>
                  {s.status === 'done' && s.total_awarded !== null && (
                    <span className="mono-stat text-sm font-semibold">
                      {s.total_awarded}
                      <span className="font-normal text-faded">/{exam.total_marks}</span>
                    </span>
                  )}
                  {s.status === 'error' && s.error_detail && (
                    <span className="hidden max-w-xs truncate text-xs text-redpen wide:inline" title={s.error_detail}>
                      {s.error_detail}
                    </span>
                  )}
                  <StatusPill status={s.status} />
                  <button
                    type="button"
                    className="text-faded transition hover:text-indigo"
                    onClick={() => viewPdf(s.id)}
                    aria-label={`View ${s.student_name}'s scanned sheet`}
                    title="View original scanned sheet"
                  >
                    <PageIcon size={16} />
                  </button>
                  {s.status === 'done' && (
                    <Link
                      to={`/teacher/exams/${exam.id}/results/${s.student_id}`}
                      className="text-faded transition hover:text-indigo"
                      aria-label={`Open ${s.student_name}'s marked script`}
                    >
                      <ArrowIcon size={17} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {exam.question_count === 0 && (
            <p className="mt-6 flex items-center gap-2 text-sm text-gold">
              <AlertIcon size={16} /> This exam has no questions yet — evaluation needs them. Add
              questions from the exam creation page.
            </p>
          )}
        </>
      )}
    </AppShell>
  )
}
