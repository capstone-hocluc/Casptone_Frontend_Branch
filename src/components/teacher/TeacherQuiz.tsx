import { useState } from 'react'
import { ArrowLeft, CheckCircle2, ClipboardCheck, Clock3, FileText, Pencil, Plus, Send, Trash2, Users } from 'lucide-react'

const mockQuizzes = [
  { id: 1, title: 'Kiểm tra chương 02', questions: 10, duration: 25, attempts: 2, status: 'Đã xuất bản', submissions: 28, updated: 'Hôm nay, 10:20' },
  { id: 2, title: 'Bài kiểm tra giữa khóa', questions: 20, duration: 45, attempts: 1, status: 'Bản nháp', submissions: 0, updated: 'Hôm qua, 16:40' },
]

const emptyQuestion = () => ({ id: Date.now() + Math.random(), text: '', options: ['', '', '', ''], correct: 0 })

function QuizEditor({ quiz, onCancel, onSave }) {
  const [title, setTitle] = useState(quiz?.title || '')
  const [duration, setDuration] = useState(quiz?.duration || 30)
  const [attempts, setAttempts] = useState(quiz?.attempts || 1)
  const [questions, setQuestions] = useState(quiz?.questionItems || [emptyQuestion()])
  const [formError, setFormError] = useState('')
  const updateQuestion = (id, update) => setQuestions((items) => items.map((item) => item.id === id ? { ...item, ...update } : item))
  const updateOption = (questionId, optionIndex, value) => setQuestions((items) => items.map((item) => item.id === questionId ? { ...item, options: item.options.map((option, index) => index === optionIndex ? value : option) } : item))
  const removeQuestion = (id) => setQuestions((items) => items.length === 1 ? items : items.filter((item) => item.id !== id))
  const submit = (status) => {
    const hasIncompleteQuestion = questions.some((question) => !question.text.trim() || question.options.some((option) => !option.trim()))
    if (status === 'Đã xuất bản' && !title.trim()) {
      setFormError('Vui lòng nhập tên bài kiểm tra trước khi xuất bản.')
      return
    }
    if (status === 'Đã xuất bản' && hasIncompleteQuestion) {
      setFormError('Vui lòng nhập đầy đủ nội dung câu hỏi và 4 lựa chọn trước khi xuất bản.')
      return
    }
    setFormError('')
    onSave({ ...quiz, id: quiz?.id || Date.now(), title: title.trim() || 'Bài kiểm tra chưa đặt tên', duration: Number(duration), attempts: Number(attempts), questionItems: questions, questions: questions.filter((question) => question.text.trim()).length, status, submissions: quiz?.submissions || 0, updated: 'Vừa xong' })
  }
  return <section className="hl-teacher-quiz-editor">
    <button type="button" className="hl-teacher-text-back" onClick={onCancel}><ArrowLeft size={16} />Quay lại danh sách bài kiểm tra</button>
    <div className="hl-teacher-title"><div><h1>{quiz ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra'}</h1><p>Thiết lập câu hỏi, lựa chọn đáp án và quy định làm bài cho học viên.</p></div></div>
    <div className="hl-teacher-quiz-editor-grid">
      <section className="hl-teacher-panel"><div className="hl-teacher-panel-heading"><div><h2>Thông tin bài kiểm tra</h2></div></div><div className="hl-teacher-quiz-form"><label>Tên bài kiểm tra<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ví dụ: Kiểm tra chương 03" /></label><div className="hl-teacher-quiz-rules"><label>Thời gian làm bài (phút)<input type="number" min="1" value={duration} onChange={(event) => setDuration(event.target.value)} /></label><label>Số lần thử tối đa<input type="number" min="1" value={attempts} onChange={(event) => setAttempts(event.target.value)} /></label></div></div></section>
      <aside className="hl-teacher-panel hl-teacher-quiz-rule-note"><Clock3 size={20} /><div><strong>Quy định làm bài</strong><p>Học viên có tối đa {attempts || 1} lần thử và {duration || 0} phút cho mỗi lần làm bài.</p></div></aside>
    </div>
    {formError && <p className="hl-teacher-quiz-form-error" role="alert">{formError}</p>}
    <section className="hl-teacher-panel"><div className="hl-teacher-panel-heading"><div><h2>Câu hỏi ({questions.length})</h2></div><button type="button" onClick={() => setQuestions((items) => [...items, emptyQuestion()])}><Plus size={15} />Thêm câu hỏi</button></div><div className="hl-teacher-question-list">{questions.map((question, index) => <article key={question.id}><div className="hl-teacher-question-top"><strong>Câu {index + 1}</strong><button type="button" onClick={() => removeQuestion(question.id)} disabled={questions.length === 1} aria-label={`Xóa câu ${index + 1}`}><Trash2 size={15} /></button></div><label>Nội dung câu hỏi<input value={question.text} onChange={(event) => updateQuestion(question.id, { text: event.target.value })} placeholder="Nhập nội dung câu hỏi" /></label><div className="hl-teacher-option-list">{question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`} className={question.correct === optionIndex ? 'is-correct' : ''}><input type="radio" name={`correct-${question.id}`} checked={question.correct === optionIndex} onChange={() => updateQuestion(question.id, { correct: optionIndex })} /><span>{String.fromCharCode(65 + optionIndex)}</span><input value={option} onChange={(event) => updateOption(question.id, optionIndex, event.target.value)} placeholder={`Lựa chọn ${String.fromCharCode(65 + optionIndex)}`} /></label>)}</div></article>)}</div><div className="hl-teacher-quiz-editor-actions"><button type="button" onClick={onCancel}>Hủy</button>{!quiz && <button type="button" className="hl-teacher-outline-action" onClick={() => submit('Bản nháp')}><FileText size={15} />Lưu bài kiểm tra</button>}<button type="button" className="hl-teacher-primary" onClick={() => submit('Đã xuất bản')}><Send size={15} />{quiz ? 'Lưu bài kiểm tra' : 'Tạo bài kiểm tra'}</button></div></section>
  </section>
}

function TeacherQuiz({ course, onBack, onAction, startCreating = false }) {
  const [quizzes, setQuizzes] = useState(mockQuizzes)
  const [editingQuiz, setEditingQuiz] = useState(startCreating ? {} : null)
  const saveQuiz = (quiz) => { setQuizzes((items) => items.some((item) => item.id === quiz.id) ? items.map((item) => item.id === quiz.id ? quiz : item) : [quiz, ...items]); setEditingQuiz(null); onAction(quiz.status === 'Đã xuất bản' ? 'Đã xuất bản bài kiểm tra.' : 'Đã lưu bài kiểm tra dưới dạng bản nháp.') }
  if (editingQuiz !== null) return <QuizEditor quiz={editingQuiz || null} onCancel={() => setEditingQuiz(null)} onSave={saveQuiz} />
  return <section className="hl-teacher-quiz-page"><button type="button" className="hl-teacher-text-back" onClick={onBack}><ArrowLeft size={16} />Quay lại lớp học</button><div className="hl-teacher-title"><div><h1>Quản lý bài kiểm tra</h1><p>{course.name} · Tạo và theo dõi các bài kiểm tra của lớp học.</p></div><button type="button" className="hl-teacher-primary" onClick={() => setEditingQuiz({})}><Plus size={16} />Tạo bài kiểm tra</button></div><section className="hl-teacher-quiz-summary"><span><ClipboardCheck size={20} /><div><strong>{quizzes.length}</strong><small>Bài kiểm tra</small></div></span><span><CheckCircle2 size={20} /><div><strong>{quizzes.filter((quiz) => quiz.status === 'Đã xuất bản').length}</strong><small>Đã xuất bản</small></div></span><span><Users size={20} /><div><strong>{quizzes.reduce((total, quiz) => total + quiz.submissions, 0)}</strong><small>Lượt nộp bài</small></div></span></section><section className="hl-teacher-panel hl-teacher-quiz-list-panel"><div className="hl-teacher-panel-heading"><div><h2>Danh sách bài kiểm tra</h2></div></div><div className="hl-teacher-quiz-table"><div className="hl-teacher-quiz-row is-head"><span>Tên bài kiểm tra</span><span>Câu hỏi</span><span>Quy định làm bài</span><span>Trạng thái</span><span /></div>{quizzes.map((quiz) => <article className="hl-teacher-quiz-row" key={quiz.id}><span><strong>{quiz.title}</strong><small>Cập nhật {quiz.updated}</small></span><span>{quiz.questions} câu</span><span>{quiz.duration} phút · {quiz.attempts} lần thử</span><span><em className={quiz.status === 'Đã xuất bản' ? 'is-published' : ''}>{quiz.status}</em><small>{quiz.submissions} lượt nộp</small></span><button type="button" onClick={() => setEditingQuiz(quiz)}><Pencil size={15} />Chỉnh sửa</button></article>)}</div></section></section>
}

export default TeacherQuiz
