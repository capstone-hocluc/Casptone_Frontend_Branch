import { ClipboardCheck } from 'lucide-react'

function TaskItem({ item }) {
  return (
    <article className="hl-student-list-item">
      <span className="hl-student-list-icon">
        <ClipboardCheck size={18} />
      </span>
      <div>
        <strong>{item.title}</strong>
        <p>{item.course}</p>
        <small>
          {item.type} - {item.deadline}
        </small>
      </div>
      <button type="button">Mở</button>
    </article>
  )
}

export default TaskItem
