// Shape of one learning activity row of the (mock) student course detail data.
export interface CourseActivity {
  id: string
  type: string
  title: string
  status: string
  questionCount?: number
  duration?: string
  deadline?: string
  instructor?: string
  date?: string
  time?: string
  score?: string
}
