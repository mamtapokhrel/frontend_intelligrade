import { axiosClient, ApiError, getRefreshToken, hasSession, setTokens } from './axiosConfig'

export { ApiError, getRefreshToken, hasSession, setTokens }

export const api = {
  get: <T>(path: string) => axiosClient.get<T>(path).then((r) => r.data),
  post: <T>(path: string, body?: unknown) => axiosClient.post<T>(path, body).then((r) => r.data),
  patch: <T>(path: string, body?: unknown) => axiosClient.patch<T>(path, body).then((r) => r.data),
  delete: <T = void>(path: string) => axiosClient.delete<T>(path).then((r) => r.data),
  postForm: <T>(path: string, form: FormData) => axiosClient.post<T>(path, form).then((r) => r.data),
  getBlob: (path: string) =>
    axiosClient.get<Blob>(path, { responseType: 'blob' }).then((r) => r.data),
}

// ---------- API types (mirror backend/app/schemas.py) ----------

export type Role = 'teacher' | 'student'

export interface User {
  id: number
  email: string
  name: string
  role: Role
  roll_number: string | null
}

export interface Subject {
  id: number
  name: string
  teacher_id: number
}

export interface StudentSubject {
  id: number
  name: string
  teacher_name: string
  exam_count: number
  average_percent: number | null
}

export interface RosterStudent {
  id: number
  name: string
  email: string
  roll_number: string | null
  submission_count: number
  average_percent: number | null
}

export interface Question {
  id: number
  number: number
  text: string
  max_marks: number
  sample_answer: string
  marking_notes: string
}

export interface Submission {
  id: number
  student_id: number
  student_name: string
  roll_number: string | null
  status: 'uploaded' | 'processing' | 'done' | 'error'
  error_detail: string | null
  total_awarded: number | null
  uploaded_at: string
}

export interface ExamSummary {
  id: number
  title: string
  subject_id: number
  subject_name: string
  status: 'draft' | 'evaluating' | 'evaluated'
  total_marks: number
  question_count: number
  student_count: number
  average_percent: number | null
  created_at: string
}

export interface ExamDetail extends ExamSummary {
  questions: Question[]
  submissions: Submission[]
}

export interface BatchUploadResult {
  created: Submission[]
  unmatched: string[]
  rejected: string[]
}

export interface ExamStatus {
  exam_id: number
  status: ExamSummary['status']
  total: number
  done: number
  processing: number
  error: number
}

export interface QuestionResult {
  question_id: number
  number: number
  text: string
  max_marks: number
  sample_answer: string
  awarded_marks: number
  remark: string
  extracted_answer_snippet: string
}

export interface StudentResult {
  exam_id: number
  exam_title: string
  subject_name: string
  student_id: number
  student_name: string
  roll_number: string | null
  status: Submission['status']
  total_marks: number
  total_awarded: number | null
  percent: number | null
  overall_remark: string | null
  evaluated_at: string | null
  questions: QuestionResult[]
}

export interface ResultRow {
  submission_id: number
  student_id: number
  student_name: string
  roll_number: string | null
  status: Submission['status']
  total_awarded: number | null
  percent: number | null
}

export interface StudentExamRow {
  exam_id: number
  title: string
  status: ExamSummary['status']
  total_marks: number
  my_score: number | null
  my_percent: number | null
  created_at: string
}
