import { Users } from 'lucide-react'

interface StudyGroupCardProps {
  name: string
}

function StudyGroupCard({ name }: StudyGroupCardProps) {
  return (
    <div className="hl-study-card hl-study-group-card">
      <span className="hl-study-card-eyebrow">Nhóm học hiện tại</span>
      <div className="hl-study-group-name">
        <Users size={18} />
        <strong>{name}</strong>
      </div>
    </div>
  )
}

export default StudyGroupCard
