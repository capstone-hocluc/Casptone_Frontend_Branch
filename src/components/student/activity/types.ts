export interface ActivityOption {
  id: string
  text: string
}

export interface ActivityQuestion {
  id: string
  number: number
  type: string
  content: string
  options: ActivityOption[]
  correctAnswer: string
  explanation: string
}

export interface ActivityAttempt {
  id: string
  attemptNumber: number
  score: number
  totalQuestions: number
  percentage: number
  duration: string
  submittedAt: string
  answers: Record<string, string>
}

export type AnswerState = 'correct' | 'incorrect' | 'unanswered'
