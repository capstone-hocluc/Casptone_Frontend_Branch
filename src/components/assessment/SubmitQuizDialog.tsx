interface SubmitQuizDialogProps {
  answeredCount: number
  totalQuestions: number
  submitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

function SubmitQuizDialog({
  answeredCount,
  totalQuestions,
  submitting,
  onCancel,
  onConfirm,
}: SubmitQuizDialogProps) {
  return (
    <div className="hl-quiz-dialog-backdrop">
      <div className="hl-quiz-dialog" role="dialog" aria-modal="true">
        <h3>Nộp bài kiểm tra?</h3>
        <p>
          Bạn đã trả lời {answeredCount}/{totalQuestions} câu. Sau khi nộp bài, bạn không thể thay
          đổi đáp án.
        </p>
        <div className="hl-quiz-dialog-actions">
          <button
            type="button"
            className="hl-quiz-dialog-btn is-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Tiếp tục làm bài
          </button>
          <button
            type="button"
            className="hl-quiz-dialog-btn is-primary"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitQuizDialog
