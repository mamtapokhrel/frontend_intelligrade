import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api, ApiError } from '../lib/api'
import type { Subject } from '../lib/api'
import { BackArrowIcon, PlusIcon } from './Icons'

export const examFormSchema = z.object({
  title: z.string().min(1, 'Give the exam a title'),
  subject_id: z.string().min(1, 'Pick a subject'),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, 'Write the question'),
        max_marks: z.number({ message: 'Enter marks' }).positive('Marks must be positive'),
        sample_answer: z.string(),
        marking_notes: z.string(),
      }),
    )
    .min(1, 'Add at least one question'),
})

export type ExamFormValues = z.infer<typeof examFormSchema>

const emptyQuestion = { text: '', max_marks: 5, sample_answer: '', marking_notes: '' }

export function ExamForm({
  heading,
  initialValues,
  onSubmit,
  submitLabel,
  cancelTo,
  backLabel = 'Back to the desk',
}: {
  heading: string
  initialValues?: ExamFormValues
  onSubmit: (values: ExamFormValues) => Promise<void>
  submitLabel: string
  cancelTo: string
  backLabel?: string
}) {
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState('')

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.get<Subject[]>('/subjects'),
  })

  const createSubject = useMutation({
    mutationFn: (name: string) => api.post<Subject>('/subjects', { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subjects'] }),
  })

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: initialValues ?? {
      title: '',
      subject_id: '',
      questions: [emptyQuestion],
    },
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'questions' })
  const { errors, isSubmitting } = form.formState

  async function handleSubmit(values: ExamFormValues) {
    setServerError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Could not save the exam.')
    }
  }

  const totalMarks = form.watch('questions').reduce((a, q) => a + (Number(q.max_marks) || 0), 0)

  return (
    <>
      <Link to={cancelTo} className="mb-6 inline-flex items-center gap-2 text-sm text-faded transition hover:text-ink">
        <BackArrowIcon size={15} /> {backLabel}
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl">{heading}</h1>
        <span className="mono-stat rounded-lg border border-line bg-surface px-3 py-1.5 text-sm">
          Total: <strong>{totalMarks}</strong> marks
        </span>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="card grid gap-5 p-6 wide:grid-cols-2">
          <div>
            <label className="label" htmlFor="title">Exam title</label>
            <input id="title" className="input" placeholder="Midterm — Physics II" {...form.register('title')} />
            {errors.title && <p className="mt-1 text-xs text-redpen">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="subject">Subject</label>
            <div className="flex gap-2">
              <select id="subject" className="input" {...form.register('subject_id')}>
                <option value="">Choose…</option>
                {subjects?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            {errors.subject_id && <p className="mt-1 text-xs text-redpen">{errors.subject_id.message}</p>}
            <div className="mt-2 flex gap-2">
              <input
                className="input !py-1.5 text-xs"
                placeholder="…or add a new subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <button
                type="button"
                className="btn-ghost !px-3 !py-1.5 text-xs"
                disabled={!newSubject.trim() || createSubject.isPending}
                onClick={async () => {
                  const s = await createSubject.mutateAsync(newSubject.trim())
                  form.setValue('subject_id', String(s.id))
                  setNewSubject('')
                }}
              >
                <PlusIcon size={14} /> Add
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl">Questions</h2>
          <div className="space-y-4">
            {fields.map((field, i) => (
              <fieldset key={field.id} className="card relative p-6">
                <legend className="sr-only">Question {i + 1}</legend>
                <div className="mb-4 flex items-center justify-between">
                  <span className="mono-stat text-sm font-semibold text-indigo">Q{i + 1}</span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="text-xs text-faded underline-offset-2 hover:text-redpen hover:underline"
                      onClick={() => remove(i)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-4 wide:grid-cols-[1fr_120px]">
                  <div>
                    <label className="label">Question text</label>
                    <textarea rows={2} className="input" placeholder="State and prove…"
                      {...form.register(`questions.${i}.text`)} />
                    {errors.questions?.[i]?.text && (
                      <p className="mt-1 text-xs text-redpen">{errors.questions[i]?.text?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Max marks</label>
                    <input type="number" step="0.5" min="0.5" className="input mono-stat"
                      {...form.register(`questions.${i}.max_marks`, { valueAsNumber: true })} />
                    {errors.questions?.[i]?.max_marks && (
                      <p className="mt-1 text-xs text-redpen">{errors.questions[i]?.max_marks?.message}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 wide:grid-cols-2">
                  <div>
                    <label className="label">Sample answer</label>
                    <textarea rows={3} className="input"
                      placeholder="The model answer the AI grades against"
                      {...form.register(`questions.${i}.sample_answer`)} />
                  </div>
                  <div>
                    <label className="label">Marking notes (optional)</label>
                    <textarea rows={3} className="input"
                      placeholder="e.g. award 2 marks for the diagram alone"
                      {...form.register(`questions.${i}.marking_notes`)} />
                  </div>
                </div>
              </fieldset>
            ))}
          </div>
          <button
            type="button"
            className="btn-ghost mt-4"
            onClick={() => append(emptyQuestion)}
          >
            <PlusIcon size={16} /> Add question
          </button>
        </div>

        {serverError && (
          <p className="rounded-lg border border-redpen/30 bg-redpen/5 px-3 py-2 text-sm text-redpen">
            {serverError}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Link to={cancelTo} className="btn-ghost">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : submitLabel}
          </button>
        </div>
      </form>
    </>
  )
}
