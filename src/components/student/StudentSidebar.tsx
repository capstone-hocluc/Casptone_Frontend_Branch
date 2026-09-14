import { useState } from 'react'
import { BarChart3, BookOpen, Home, UserRound } from 'lucide-react'

const navItems = [
  { label: 'Tổng quan', path: '/student/dashboard', icon: Home },
  { label: 'Hồ sơ năng lực', path: '/student/learning-profile', icon: UserRound },
  { label: 'Khóa học', path: '/student/courses', icon: BookOpen },
  { label: 'Tiến độ', icon: BarChart3, comingSoon: true },
]

function StudentSidebar({ currentPath, onNavigate, collapsed = false }) {
  const [message, setMessage] = useState('')

  const showMessage = () => {
    setMessage('Tính năng đang được phát triển.')
    window.setTimeout(() => setMessage(''), 2400)
  }

  return (
    <aside className={`hl-student-sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.path === currentPath ||
            (item.path === '/student/courses' && currentPath.startsWith('/student/courses/'))
          return (
            <button
              key={item.label}
              type="button"
              className={active ? 'is-active' : ''}
              onClick={() => (item.comingSoon ? showMessage() : onNavigate(item.path))}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      {message && <div className="hl-student-toast">{message}</div>}
    </aside>
  )
}

export default StudentSidebar
