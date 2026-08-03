import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Role } from '../lib/api'
import { ApiError } from '../lib/api'
import { useAuth } from '../lib/auth'
import { BackArrowIcon, QuillIcon } from '../components/Icons'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})

const registerSchema = loginSchema.extend({
  name: z.string().min(1, 'Enter your name'),
  roll_number: z.string().optional(),
})

type RegisterForm = z.infer<typeof registerSchema>

export function LoginPage({ role }: { role: Role }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [serverError, setServerError] = useState<string | null>(null)
  const { login, register: signUp } = useAuth()
  const navigate = useNavigate()
  const isTeacher = role === 'teacher'

  const form = useForm<RegisterForm>({
    resolver: zodResolver(mode === 'login' ? (loginSchema as never) : registerSchema),
  })

  async function onSubmit(values: RegisterForm) {
    setServerError(null)
    try {
      if (mode === 'register') {
        if (!isTeacher && !values.roll_number?.trim()) {
          form.setError('roll_number', { message: 'Roll number is required for students' })
          return
        }
        await signUp({
          email: values.email,
          password: values.password,
          name: values.name,
          role,
          roll_number: isTeacher ? undefined : values.roll_number?.trim(),
        })
      } else {
        const me = await login(values.email, values.password)
        if (me.role !== role) {
          setServerError(
            `This account is a ${me.role} account — use the ${me.role} door instead.`,
          )
          return
        }
      }
      navigate(isTeacher ? '/teacher' : '/student')
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    }
  }

  const { errors, isSubmitting } = form.formState

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <Link to="/" className="mb-8 flex items-center gap-2 text-faded transition hover:text-ink">
        <BackArrowIcon size={16} /> Back to Intelligrade
      </Link>

      <div className="card relative w-full max-w-md p-8">
        <div className="absolute -top-3 left-8 rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo">
          {isTeacher ? 'Teacher' : 'Student'}
        </div>
        <div className="mb-6 flex items-center gap-2.5">
          <QuillIcon size={22} className="text-indigo" />
          <h1 className="font-display text-2xl">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {mode === 'register' && (
            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input id="name" className="input" placeholder="A. Teacher" {...form.register('name')} />
              {errors.name && <p className="mt-1 text-xs text-redpen">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@school.edu"
              {...form.register('email')} />
            {errors.email && <p className="mt-1 text-xs text-redpen">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="••••••••"
              {...form.register('password')} />
            {errors.password && <p className="mt-1 text-xs text-redpen">{errors.password.message}</p>}
          </div>
          {mode === 'register' && !isTeacher && (
            <div>
              <label className="label" htmlFor="roll">Roll number</label>
              <input id="roll" className="input" placeholder="e.g. 017" {...form.register('roll_number')} />
              <p className="mt-1 text-xs text-faded">
                Your teacher names your scanned answer sheet with this number.
              </p>
              {errors.roll_number && (
                <p className="mt-1 text-xs text-redpen">{errors.roll_number.message}</p>
              )}
            </div>
          )}

          {serverError && (
            <p className="rounded-lg border border-redpen/30 bg-redpen/5 px-3 py-2 text-sm text-redpen">
              {serverError}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-faded">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
          <button
            className="font-medium text-indigo underline-offset-2 hover:underline"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setServerError(null)
            }}
          >
            {mode === 'login' ? 'Create an account' : 'Sign in instead'}
          </button>
        </p>
      </div>
    </div>
  )
}
