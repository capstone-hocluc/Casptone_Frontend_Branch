import { BarChart3, BookOpen, Home, UserRound } from 'lucide-react'
import { cn } from '../../../lib/cn'

const navItems = [
  { label: 'Tổng quan', path: '/student/dashboard', icon: Home },
  { label: 'Hồ sơ năng lực', path: '/student/learning-profile', icon: UserRound },
  { label: 'Khóa học', path: '/student/courses', icon: BookOpen },
  { label: 'Tiến độ', icon: BarChart3, comingSoon: true },
]

interface StudentSidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
  collapsed?: boolean
  onNotify?: (message: string) => void
}

// Icon rail. Labels are hidden when collapsed, and always below 1180px
// (StudentLayout forces the 92px rail there); below 760px it becomes a
// horizontal bar under the topbar.
function StudentSidebar({
  currentPath,
  onNavigate,
  collapsed = false,
  onNotify,
}: StudentSidebarProps) {
  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        'group/sidebar sticky top-[86px] col-start-1 row-start-2 flex h-[calc(100vh-86px)] flex-col gap-6 border-r border-line-shell bg-surface/90 shadow-[10px_0_34px_rgba(17,24,58,0.04)]',
        collapsed ? 'items-center px-3.5 pt-[30px] pb-5' : 'px-[18px] pt-[30px] pb-6',
        'max-[1180px]:items-center max-[1180px]:px-3.5 max-[1180px]:py-5',
        'max-[760px]:static max-[760px]:z-40 max-[760px]:h-auto max-[760px]:flex-row max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:px-3 max-[760px]:py-2.5'
      )}
    >
      <nav className="flex w-full flex-col gap-2 max-[760px]:flex-1 max-[760px]:flex-row max-[760px]:justify-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.path === currentPath ||
            (item.path === '/student/courses' && currentPath.startsWith('/student/courses/'))
          return (
            <button
              key={item.label}
              type="button"
              title={item.label}
              aria-current={active ? 'page' : undefined}
              onClick={() =>
                item.comingSoon
                  ? onNotify?.('Tính năng đang được phát triển.')
                  : onNavigate(item.path as string)
              }
              className={cn(
                'flex min-h-[46px] w-full cursor-pointer items-center gap-[11px] rounded-[15px] border px-3.5 text-[13px] font-extrabold transition duration-200',
                'group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-0',
                'max-[1180px]:justify-center max-[1180px]:px-0 max-[760px]:min-h-[42px] max-[760px]:w-[42px] max-[760px]:rounded-[14px]',
                active
                  ? 'border-line-brand bg-linear-to-br from-badge-info-bg to-[#f8faff] text-primary shadow-[0_10px_22px_rgba(27,77,228,0.08)]'
                  : 'border-transparent text-text-body hover:-translate-y-px hover:border-line-blue hover:bg-[#f3f6ff] hover:text-primary'
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="group-data-[collapsed=true]/sidebar:hidden max-[1180px]:hidden">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default StudentSidebar
