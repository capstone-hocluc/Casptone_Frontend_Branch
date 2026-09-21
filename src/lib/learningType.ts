// How a piece of learning content is classified for display (icon colour,
// caption, badge tone). One place instead of each screen re-deriving
// "video = blue, quiz = purple...".

// Quiz `type` is a backend enum whose full value set isn't confirmed, so this
// only separates the two kinds the UI presents differently: anything that
// reads as a mini/mock/final test is an assessment, the rest is practice.
export type QuizKind = 'practice' | 'assessment'

export function getQuizKind(type?: string | null): QuizKind {
  return /MINI|MOCK|TEST|EXAM|FINAL|ASSESS/i.test(type || '') ? 'assessment' : 'practice'
}

export function quizKindLabel(kind: QuizKind) {
  return kind === 'assessment' ? 'Mini Test' : 'Bài tập'
}
