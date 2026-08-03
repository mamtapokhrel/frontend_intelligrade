import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ExamSummary } from '../../lib/api'
import { AppShell } from '../../components/AppShell'
import { ExamForm } from '../../components/ExamForm'
import type { ExamFormValues } from '../../components/ExamForm'

export function ExamNew() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function onSubmit(values: ExamFormValues) {
    const exam = await api.post<ExamSummary>('/exams', {
      title: values.title,
      subject_id: Number(values.subject_id),
      questions: values.questions.map((q, i) => ({ ...q, number: i + 1 })),
    })
    queryClient.invalidateQueries({ queryKey: ['exams'] })
    navigate(`/teacher/exams/${exam.id}`)
  }

  return (
    <AppShell>
      <ExamForm onSubmit={onSubmit} submitLabel="Save exam" cancelTo="/teacher" />
    </AppShell>
  )
}
