import { ArrowUpRight } from 'lucide-react'
import { navLinks } from '../data/content'
import Logo from './Logo'

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#1254D8]/20">
      <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
        <a href="#home" aria-label="Trang chủ">
          <Logo />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-normal text-[#111827] hover:text-[#1254D8] transition-colors uppercase tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" className="btn-flat h-10 px-6 text-[13px]">
            Đăng nhập
          </button>
          <button type="button" aria-label="Mở menu" className="btn-flat btn-flat-icon">
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
