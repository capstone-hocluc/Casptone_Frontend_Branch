import type { ActivityAttempt, ActivityQuestion, AnswerState } from './types'

export function getAnswerState(question: ActivityQuestion, attempt: ActivityAttempt): AnswerState {
  const answer = attempt.answers[question.id]
  if (!answer) return 'unanswered'
  return answer === question.correctAnswer ? 'correct' : 'incorrect'
}
