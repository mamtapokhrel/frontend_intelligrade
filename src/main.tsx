import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './styles/global.css'
import { AuthProvider, useAuth } from './lib/auth'
import type { Role } from './lib/api'
import { Landing } from './pages/Landing'
import { LoginPage } from './pages/Login'
import { SettingsPage } from './pages/Settings'
import { TeacherDashboard } from './pages/teacher/Dashboard'
import { ExamNew } from './pages/teacher/ExamNew'
import { ExamEditPage } from './pages/teacher/ExamEdit'
import { ExamDetailPage } from './pages/teacher/ExamDetail'
import { ExamResultsPage } from './pages/teacher/ExamResults'
import { SubjectsPage } from './pages/teacher/Subjects'
import { SubjectRosterPage } from './pages/teacher/SubjectRoster'
import { StudentDashboard } from './pages/student/Dashboard'
import { SubjectExams } from './pages/student/SubjectExams'
import { RemarksPage } from './pages/Remarks'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

function RequireRole({ role }: { role: Role }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-faded">
        Opening your ledger…
      </div>
    )
  }
  if (!user) return <Navigate to={`/login/${role}`} replace />
  if (user.role !== role) return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
  return <Outlet />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login/teacher" element={<LoginPage role="teacher" />} />
            <Route path="/login/student" element={<LoginPage role="student" />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route element={<RequireRole role="teacher" />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/subjects" element={<SubjectsPage />} />
              <Route path="/teacher/subjects/:subjectId/roster" element={<SubjectRosterPage />} />
              <Route path="/teacher/exams/new" element={<ExamNew />} />
              <Route path="/teacher/exams/:examId" element={<ExamDetailPage />} />
              <Route path="/teacher/exams/:examId/edit" element={<ExamEditPage />} />
              <Route path="/teacher/exams/:examId/results" element={<ExamResultsPage />} />
              <Route path="/teacher/exams/:examId/results/:studentId" element={<RemarksPage viewer="teacher" />} />
            </Route>

            <Route element={<RequireRole role="student" />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/subjects/:subjectId" element={<SubjectExams />} />
              <Route path="/student/results/:examId" element={<RemarksPage viewer="student" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
