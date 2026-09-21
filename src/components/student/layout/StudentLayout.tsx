import { type ReactNode, useState } from 'react'
import StudentSidebar from './StudentSidebar'
import StudentTopbar from './StudentTopbar'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { dashboardSummary } from '../../../data/studentDashboard'
import { useTransientMessage } from '../../../hooks/useTransientMessage'
import StudentToast from '../common/StudentToast'
import { cn } from '../../../lib/cn'

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

// The one shell every /student/... screen renders inside: sticky topbar,
// icon-rail sidebar and the page area. Pages never render their own header.
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
  const { message, show: notify } = useTransientMessage()
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
    <div
      className={cn(
        'grid min-h-screen grid-rows-[86px_minmax(0,1fr)] bg-app-bg text-text-heading transition-[grid-template-columns] duration-250',
        sidebarCollapsed ? 'grid-cols-[92px_minmax(0,1fr)]' : 'grid-cols-[260px_minmax(0,1fr)]',
        'max-[1180px]:grid-cols-[92px_minmax(0,1fr)] max-[760px]:block'
      )}
    >
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
        onNotify={notify}
      />
      <StudentSidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onNotify={notify}
      />
      <main className="col-start-2 row-start-2 min-w-0 p-[35px] max-[760px]:px-3.5 max-[760px]:pt-5 max-[760px]:pb-7">
        {children}
      </main>
      <StudentToast message={message} />
    </div>
  )
}

export default StudentLayout
