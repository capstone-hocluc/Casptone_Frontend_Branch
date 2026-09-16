import { type ReactNode, useState } from 'react'
import StudentSidebar from './StudentSidebar'
import StudentTopbar from './StudentTopbar'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { dashboardSummary } from '../../data/studentDashboard'

interface StudentLayoutProps {
  currentPath: string
  title?: ReactNode
  subtitle?: ReactNode
  onNavigate: (path: string) => void
  onBack?: () => void
  onLogout?: () => void
  logoutLoading?: boolean
  children: ReactNode
}

function StudentLayout({
  currentPath,
  title,
  subtitle,
  onNavigate,
  onLogout,
  logoutLoading = false,
  children,
}: StudentLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const { profile } = useCurrentUser()
  const displayName =
    profile?.displayName ||
    [profile?.lastName, profile?.firstName].filter(Boolean).join(' ') ||
    dashboardSummary.studentName
  const student = {
    ...dashboardSummary,
    studentName: displayName,
    avatar: profile?.avatarUrl || dashboardSummary.avatar,
  }

  return (
    <div className={`hl-student-shell ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
      <StudentTopbar
        title={title}
        subtitle={subtitle}
        student={student}
        onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
        onNavigateHome={() => onNavigate('/student/dashboard')}
        onNavigateLearningProfile={() => onNavigate('/student/learning-profile')}
        onNavigateProfile={() => onNavigate('/student/profile')}
        onLogout={onLogout}
        logoutLoading={logoutLoading}
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
