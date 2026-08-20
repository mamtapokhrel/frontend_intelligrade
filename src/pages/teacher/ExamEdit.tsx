import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '../../lib/api'
import type { ExamDetail, Question } from '../../lib/api'
import { AppShell } from '../../components/AppShell'
import { ExamForm } from '../../components/ExamForm'
import type { ExamFormValues } from '../../components/ExamForm'

function toFormValues(exam: ExamDetail): ExamFormValues {
  return {
    title: exam.title,
    subject_id: String(exam.subject_id),
    questions: exam.questions.map((q: Question) => ({
      text: q.text,
      max_marks: q.max_marks,
      sample_answer: q.sample_answer,
      marking_notes: q.marking_notes,
    })),
  }
}

export function ExamEditPage() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: exam, isLoading } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => api.get<ExamDetail>(`/exams/${examId}`),
  })

  const deleteExam = useMutation({
    mutationFn: () => api.delete(`/exams/${examId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      navigate('/teacher')
    },
    onError: (err) =>
      setDeleteError(err instanceof ApiError ? err.message : 'Could not delete this exam.'),
  })

  async function onSubmit(values: ExamFormValues) {
    await api.patch(`/exams/${examId}`, {
      title: values.title,
      subject_id: Number(values.subject_id),
    })
    await api.post(`/exams/${examId}/questions`, values.questions.map((q, i) => ({ ...q, number: i + 1 })))
    queryClient.invalidateQueries({ queryKey: ['exams'] })
    queryClient.invalidateQueries({ queryKey: ['exam', examId] })
    navigate(`/teacher/exams/${examId}`)
  }

  return (
    <AppShell>
      {isLoading || !exam ? (
        <p className="text-faded">Opening the exam…</p>
      ) : (
        <>
          <ExamForm
            heading="Edit exam"
            initialValues={toFormValues(exam)}
            onSubmit={onSubmit}
            submitLabel="Save changes"
            cancelTo={`/teacher/exams/${examId}`}
            backLabel="Back to the exam"
          />

          <div className="card mt-8 flex items-center justify-between gap-4 border-redpen/30 p-6">
            <div>
              <p className="font-display text-lg">Delete this exam</p>
              <p className="text-sm text-faded">
                Removes the exam, its questions, and every uploaded script and result. This can't be undone.
              </p>
              {deleteError && <p className="mt-2 text-sm text-redpen">{deleteError}</p>}
            </div>
            <button
              type="button"
              className="btn-redpen shrink-0"
              disabled={exam.status === 'evaluating' || deleteExam.isPending}
              onClick={() => {
                if (confirm(`Delete "${exam.title}"? This cannot be undone.`)) deleteExam.mutate()
              }}
            >
              {deleteExam.isPending ? 'Deleting…' : 'Delete exam'}
            </button>
          </div>
        </>
      )}
    </AppShell>
  )
}
