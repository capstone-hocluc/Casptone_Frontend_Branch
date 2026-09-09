import { useEffect, useRef, useState } from 'react'
import { Bell, Flame, Menu, Settings, User, UserRound, LogOut } from 'lucide-react'
import Logo from '../common/Logo'

function StudentTopbar({ student, onToggleSidebar, onNavigateHome }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [message, setMessage] = useState('')
  const menuRef = useRef(null)
  const notificationRef = useRef(null)

  const showMessage = (text) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2400)
  }

  useEffect(() => {
    const closeFloatingMenus = (event) => {
      if (!menuRef.current?.contains(event.target)) setProfileOpen(false)
      if (!notificationRef.current?.contains(event.target)) setNotificationOpen(false)
    }

    document.addEventListener('mousedown', closeFloatingMenus)
    return () => document.removeEventListener('mousedown', closeFloatingMenus)
  }, [])

  return (
    <header className="hl-student-topbar">
      <div className="hl-student-header-left">
        <button type="button" className="hl-student-icon-button" aria-label="Thu gọn thanh điều hướng" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <button type="button" className="hl-student-header-logo" aria-label="HocLuc.com" onClick={onNavigateHome}>
          <Logo />
        </button>
      </div>

      <div className="hl-student-top-actions">
        <button
          type="button"
          className="hl-student-streak"
          aria-label={`Chuỗi ${student.currentStreak} ngày`}
          onClick={() => showMessage(`Bạn đang giữ chuỗi học tập ${student.currentStreak} ngày.`)}
        >
          <Flame size={17} />
          <strong>Khám phá streak</strong>
        </button>
        <div className="hl-student-notification-wrap" ref={notificationRef}>
          <button
            type="button"
            className="hl-student-icon-button hl-student-notification"
            aria-label="Thông báo"
            aria-expanded={notificationOpen}
            onClick={() => setNotificationOpen((current) => !current)}
          >
            <Bell size={18} />
            {student.notificationCount > 0 && <span>{student.notificationCount}</span>}
          </button>
          {notificationOpen && (
            <div className="hl-student-notification-menu">
              <strong>Thông báo</strong>
              <p>Chưa có thông báo mới.</p>
            </div>
          )}
        </div>
        <div className="hl-student-profile" ref={menuRef}>
          <button
            type="button"
            className="hl-student-avatar-button"
            aria-label="Mở menu hồ sơ"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((current) => !current)}
          >
            <img src={student.avatar || '/avatar-minhanh.jpg'} alt={student.studentName} />
          </button>
          {profileOpen && (
            <div className="hl-student-profile-menu">
              <button type="button" onClick={() => showMessage('Tính năng Hồ sơ cá nhân đang được phát triển.')}><UserRound size={16} />Hồ sơ cá nhân</button>
              <button type="button" onClick={() => showMessage('Tính năng Hồ sơ học tập đang được phát triển.')}><User size={16} />Hồ sơ học tập</button>
              <button type="button" onClick={() => showMessage('Tính năng Cài đặt đang được phát triển.')}><Settings size={16} />Cài đặt</button>
              <button type="button" onClick={() => showMessage('Tính năng Đăng xuất đang được phát triển.')}><LogOut size={16} />Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
      {message && <div className="hl-student-toast">{message}</div>}
    </header>
  )
}

export default StudentTopbar
