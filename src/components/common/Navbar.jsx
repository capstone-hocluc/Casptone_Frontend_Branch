import { useEffect, useState } from 'react'
import { navLinks } from '../../data/content'
import Logo from './Logo'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        transition: 'background .35s, box-shadow .35s, padding .35s',
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.6)',
        boxShadow: scrolled ? '0 8px 30px -12px rgba(17,24,58,.18)' : 'none',
        backdropFilter: 'saturate(180%) blur(10px)',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 28 }}>
        <a href="#top" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Logo />
        </a>

        <nav style={{ display: 'flex', gap: 34, marginLeft: 'auto' }} className="hl-desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hl-nav"
              style={{
                textDecoration: 'none',
                color: '#2A3354',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '.4px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <button
            type="button"
            className="hl-by"
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: { mode: 'login' } }))}
            style={{
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: 'linear-gradient(180deg,#FBC34F,#F4A93C)', color: '#3a2a05',
              fontWeight: 800, fontSize: 13.5, letterSpacing: '.5px', textTransform: 'uppercase',
              padding: '13px 24px', borderRadius: 40, boxShadow: '0 8px 20px rgba(244,169,60,.4)',
            }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            aria-label="Mở menu"
            className="hl-rot"
            style={{
              width: 46, height: 46, flexShrink: 0, border: 'none', cursor: 'pointer', borderRadius: '50%',
              background: 'linear-gradient(180deg,#FBC34F,#F4A93C)', color: '#3a2a05', fontSize: 18,
              display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px rgba(244,169,60,.4)',
            }}
          >
            ↗
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
