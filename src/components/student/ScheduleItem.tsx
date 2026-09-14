import { CalendarClock } from 'lucide-react'

function ScheduleItem({ item }) {
  return (
    <article className="hl-student-list-item">
      <span className="hl-student-list-icon">
        <CalendarClock size={18} />
      </span>
      <div>
        <strong>{item.lesson}</strong>
        <p>{item.course}</p>
        <small>
          {item.date} lúc {item.time}
        </small>
      </div>
      <button type="button">{item.status === 'Lớp học trực tiếp' ? 'Vào học' : 'Xem'}</button>
    </article>
  )
}

export default ScheduleItem
