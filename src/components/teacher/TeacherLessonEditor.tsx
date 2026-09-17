import { useRef, useState } from 'react'
import { ArrowLeft, FileText, Film, Link, Save, Send, Trash2, Upload } from 'lucide-react'

const initialAttachments = [
  { id: 'file-1', name: 'Tài liệu bài học.pdf', type: 'PDF', size: '1.8 MB', icon: FileText },
  { id: 'file-2', name: 'Video bài giảng.mp4', type: 'VIDEO', size: '125 MB', icon: Film },
]

function TeacherLessonEditor({ course, lesson, onBack, onNotify }) {
  const inputRef = useRef(null)
  const [title, setTitle] = useState(lesson.lesson || lesson.title)
  const [content, setContent] = useState('Trong bài học này, học viên sẽ nắm được kiến thức trọng tâm, xem ví dụ minh họa và hoàn thành phần luyện tập.')
  const [attachments, setAttachments] = useState(initialAttachments)
  const [link, setLink] = useState('')
  const addFiles = (event) => {
    const files = Array.from(event.target.files || []) as File[]
    if (!files.length) return
    setAttachments((items) => [...items, ...files.map((file) => ({ id: `${file.name}-${file.lastModified}`, name: file.name, type: file.type.includes('video') ? 'VIDEO' : file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TÀI LIỆU', size: `${Math.max(file.size / 1024 / 1024, .1).toFixed(1)} MB`, icon: file.type.includes('video') ? Film : FileText }))])
    event.target.value = ''
  }
  const addLink = () => { if (!link.trim()) return; setAttachments((items) => [...items, { id: `link-${Date.now()}`, name: link.trim(), type: 'LIÊN KẾT', size: 'Tài liệu trực tuyến', icon: Link }]); setLink('') }
  const save = (status) => onNotify(status === 'published' ? `Đã xuất bản bài học “${title || lesson.title}”.` : `Đã lưu bản nháp bài học “${title || lesson.title}”.`)
  return <section className="hl-teacher-lesson-editor"><button type="button" className="hl-teacher-text-back" onClick={onBack}><ArrowLeft size={16} />Quay lại nội dung khóa học</button><div className="hl-teacher-title"><div><h1>Chỉnh sửa bài học</h1><p>{course.name} · {lesson.title}</p></div></div><section className="hl-teacher-panel"><div className="hl-teacher-panel-heading"><div><h2>Nội dung bài học</h2></div></div><div className="hl-teacher-lesson-form"><label>Tên bài học<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nhập tên bài học" /></label><label>Nội dung chi tiết<textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Soạn nội dung bài học tại đây..." /></label></div></section><section className="hl-teacher-panel"><div className="hl-teacher-panel-heading"><div><h2>Tài liệu đính kèm</h2><p className="hl-teacher-lesson-note">Hỗ trợ video, PDF, tài liệu tham khảo và liên kết trực tuyến.</p></div></div><input ref={inputRef} type="file" multiple hidden onChange={addFiles} accept="video/*,.pdf,.doc,.docx,.ppt,.pptx" /><button type="button" className="hl-teacher-file-dropzone" onClick={() => inputRef.current?.click()}><Upload size={22} /><strong>Tải tệp lên</strong><span>Kéo thả tệp vào đây hoặc bấm để chọn tệp</span></button><div className="hl-teacher-link-attachment"><Link size={16} /><input value={link} onChange={(event) => setLink(event.target.value)} placeholder="Dán liên kết tài liệu hoặc video" /><button type="button" onClick={addLink}>Thêm liên kết</button></div><div className="hl-teacher-attachment-list">{attachments.map((file) => { const Icon = file.icon; return <article key={file.id}><span><Icon size={18} /></span><div><strong>{file.name}</strong><small>{file.type} · {file.size}</small></div><button type="button" onClick={() => setAttachments((items) => items.filter((item) => item.id !== file.id))} aria-label={`Xóa ${file.name}`}><Trash2 size={15} /></button></article> })}</div><div className="hl-teacher-quiz-editor-actions"><button type="button" onClick={onBack}>Hủy</button><button type="button" className="hl-teacher-outline-action" onClick={() => save('draft')}><Save size={15} />Lưu bản nháp</button><button type="button" className="hl-teacher-primary" onClick={() => save('published')}><Send size={15} />Xuất bản bài học</button></div></section></section>
}

export default TeacherLessonEditor
