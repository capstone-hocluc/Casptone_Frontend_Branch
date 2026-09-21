import ConfirmDialog from '../ui/ConfirmDialog'

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
    <ConfirmDialog
      title="Nộp bài kiểm tra?"
      description={`Bạn đã trả lời ${answeredCount}/${totalQuestions} câu. Sau khi nộp bài, bạn không thể thay đổi đáp án.`}
      cancelLabel="Tiếp tục làm bài"
      confirmLabel="Nộp bài"
      busyLabel="Đang nộp bài..."
      variant="danger"
      busy={submitting}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

export default SubmitQuizDialog
