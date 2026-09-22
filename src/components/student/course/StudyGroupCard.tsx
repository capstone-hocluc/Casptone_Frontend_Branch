import { Users } from 'lucide-react'
import Card, { CardEyebrow } from '../../ui/Card'

interface StudyGroupCardProps {
  name: string
}

function StudyGroupCard({ name }: StudyGroupCardProps) {
  return (
    <Card>
      <CardEyebrow>Nhóm học hiện tại</CardEyebrow>
      <div className="flex items-center gap-2.5 text-sm text-text-heading">
        <Users size={18} className="text-text-secondary" />
        <strong className="font-semibold">{name}</strong>
      </div>
    </Card>
  )
}

export default StudyGroupCard
