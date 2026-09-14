import type { ComponentType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

// Tailwind utility classes only (no index.css rule) - matches the reference
// CRM's nav item: a flat, neutral background tint on hover/active (no accent
// color on the icon) instead of a solid color-filled pill.
interface NavItemProps {
  icon: ComponentType<{ size?: number; className?: string }>
  label: ReactNode
  active?: boolean
  onClick?: () => void
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
        active ? 'bg-black/5 text-text-heading' : 'text-text-muted hover:bg-black/5 hover:text-text-heading'
      )}
    >
      <Icon size={18} className={active ? 'text-text-heading' : 'text-text-subtle'} />
      <span className="flex-1">{label}</span>
    </button>
  )
}

export function SidebarGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 mb-1 px-3 text-[11px] font-medium tracking-wide text-text-subtle uppercase first:mt-0">
      {children}
    </p>
  )
}

export default NavItem
