import { useState } from 'react'
import StudentSidebar from './StudentSidebar'
import StudentTopbar from './StudentTopbar'
import { dashboardSummary } from '../../data/studentDashboard'

function StudentLayout({ currentPath, title, subtitle, onNavigate, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <div className={`hl-student-shell ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
      <StudentTopbar
        title={title}
        subtitle={subtitle}
        student={dashboardSummary}
        onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
        onNavigateHome={() => onNavigate('/student/dashboard')}
      />
      <StudentSidebar currentPath={currentPath} onNavigate={onNavigate} collapsed={sidebarCollapsed} />
      <main className="hl-student-main">
        {children}
      </main>
    </div>
  )
}

export default StudentLayout
