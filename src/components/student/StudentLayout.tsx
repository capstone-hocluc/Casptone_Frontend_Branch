import { type ReactNode, useState } from 'react'
import StudentSidebar from './StudentSidebar'
import StudentTopbar from './StudentTopbar'
import { dashboardSummary } from '../../data/studentDashboard'

interface StudentLayoutProps {
  currentPath: string
  title?: ReactNode
  subtitle?: ReactNode
  onNavigate: (path: string) => void
  onBack?: () => void
  children: ReactNode
}

function StudentLayout({ currentPath, title, subtitle, onNavigate, children }: StudentLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <div className={`hl-student-shell ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
      <StudentTopbar
        title={title}
        subtitle={subtitle}
        student={dashboardSummary}
        onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
        onNavigateHome={() => onNavigate('/student/dashboard')}
        onNavigateLearningProfile={() => onNavigate('/student/learning-profile')}
      />
      <StudentSidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
      />
      <main className="hl-student-main">{children}</main>
    </div>
  )
}

export default StudentLayout
