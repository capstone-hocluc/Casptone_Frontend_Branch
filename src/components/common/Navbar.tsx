import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, PackageSearch, ShoppingCart, Sparkles, UserRound } from 'lucide-react'
import { navLinks } from '../../data/content'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import Logo from './Logo'

const navLinkStyle = {
  textDecoration: 'none',
  color: '#2A3354',
  fontWeight: 600,
  fontSize: 14.5,
  whiteSpace: 'nowrap' as const,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: '9px 16px',
  borderRadius: 999,
  display: 'inline-flex',
  alignItems: 'center',
}

function navigateTo(path: string) {
  window.dispatchEvent(new CustomEvent('hl-navigate', { detail: { path } }))
}

function openAuth(mode: 'login' | 'signup') {
  window.dispatchEvent(new CustomEvent('open-auth', { detail: { mode } }))
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { profile } = useCurrentUser()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const displayName =
    profile?.displayName ||
    [profile?.lastName, profile?.firstName].filter(Boolean).join(' ') ||
    profile?.email ||
    'Học viên'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        display: 'flex',
        justifyContent: 'center',
        transition: 'padding .35s',
        padding: scrolled ? '10px 20px' : '16px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div
          style={{
            height: 52,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            padding: '0 24px',
            borderRadius: 999,
            background: '#fff',
            boxShadow: scrolled
              ? '0 10px 30px -12px rgba(17,24,58,.22)'
              : '0 8px 24px -14px rgba(17,24,58,.16)',
            transition: 'box-shadow .35s',
          }}
        >
          <a href="/#top" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Logo size={34} />
          </a>

          <nav style={{ display: 'flex', gap: 4 }} className="hl-desktop-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hl-nav" style={navLinkStyle}>
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="hl-nav"
              style={navLinkStyle}
              onClick={() => navigateTo('/courses')}
            >
              Khóa học
            </button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {profile ? (
            <>
              <button
                type="button"
                aria-label="Giỏ hàng"
                onClick={() => navigateTo('/cart')}
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  border: '1px solid rgba(27,77,228,.16)',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  background: '#fff',
                  color: '#2A3354',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <ShoppingCart size={18} />
              </button>
              <div className="hl-nav-user" ref={menuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                aria-expanded={menuOpen}
                aria-label="Mở menu tài khoản"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(27,77,228,.16)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: '#fff',
                  padding: '6px 14px 6px 6px',
                  borderRadius: 40,
                  boxShadow: '0 6px 16px -8px rgba(17,24,58,.2)',
                }}
              >
                <img
                  src={profile.avatarUrl || '/avatar-minhanh.jpg'}
                  alt={displayName}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 13.5,
                    color: '#2A3354',
                    maxWidth: 130,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </span>
                <ChevronDown size={16} color="#2A3354" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    minWidth: 200,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 20px 44px -18px rgba(17,24,58,.32)',
                    border: '1px solid rgba(17,24,58,.06)',
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <button
                    type="button"
                    className="hl-nav-menu-item"
                    onClick={() => {
                      setMenuOpen(false)
                      navigateTo('/student/dashboard')
                    }}
                  >
                    <Sparkles size={16} />
                    Bắt đầu học
                  </button>
                  <button
                    type="button"
                    className="hl-nav-menu-item"
                    onClick={() => {
                      setMenuOpen(false)
                      navigateTo('/student/profile')
                    }}
                  >
                    <UserRound size={16} />
                    Hồ sơ
                  </button>
                  <button
                    type="button"
                    className="hl-nav-menu-item"
                    onClick={() => {
                      setMenuOpen(false)
                      navigateTo('/orders')
                    }}
                  >
                    <PackageSearch size={16} />
                    Đơn hàng của tôi
                  </button>
                  <button
                    type="button"
                    className="hl-nav-menu-item is-danger"
                    onClick={() => {
                      setMenuOpen(false)
                      window.dispatchEvent(new CustomEvent('hl-logout'))
                    }}
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
              </div>
            </>
          ) : (
            <button
              type="button"
              className="hl-by"
              onClick={() => openAuth('login')}
              style={{
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: 'linear-gradient(180deg,#FBC34F,#F4A93C)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14.5,
                height: 52,
                padding: '0 24px',
                borderRadius: 40,
                boxShadow: '0 8px 20px rgba(244,169,60,.4)',
              }}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
