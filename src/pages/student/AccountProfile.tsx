import { useEffect, useState } from 'react'
import { BarChart3, KeyRound, User } from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { getErrorMessage } from '../../lib/errors'
import { showErrorToast } from '../../lib/toastBus'
import PersonalInfoTab from './account-profile/PersonalInfoTab'
import StudentInfoTab from './account-profile/StudentInfoTab'
import SecurityTab from './account-profile/SecurityTab'

const navGroups = [
  {
    label: 'Tài khoản',
    items: [
      { key: 'personal', label: 'Hồ sơ', icon: User },
      { key: 'security', label: 'Đổi mật khẩu', icon: KeyRound },
    ],
  },
  {
    label: 'Học tập',
    items: [{ key: 'student', label: 'Hồ sơ học tập', icon: BarChart3 }],
  },
]

function AccountProfile() {
  const { profile, status, loadCurrentUser } = useCurrentUser()
  const [activeSection, setActiveSection] = useState('personal')

  // Fallback for a direct/refreshed visit to this page where the shared
  // profile hasn't been loaded yet by the login flow.
  useEffect(() => {
    if (!profile && status !== 'loading') {
      loadCurrentUser().catch((error) => {
        showErrorToast(getErrorMessage(error) || 'Không thể tải thông tin hồ sơ.')
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="hl-student-page hl-account-page">
      <div className="hl-account-shell">
        <nav className="hl-account-nav" aria-label="Cài đặt tài khoản">
          {navGroups.map((group) => (
            <div className="hl-account-nav-group" key={group.label}>
              <span className="hl-account-nav-group-label">{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={activeSection === item.key ? 'is-active' : ''}
                    aria-current={activeSection === item.key ? 'page' : undefined}
                    onClick={() => setActiveSection(item.key)}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="hl-account-content">
          {activeSection === 'personal' && <PersonalInfoTab key={profile?.id} />}
          {activeSection === 'student' && <StudentInfoTab key={profile?.id} />}
          {activeSection === 'security' && <SecurityTab />}
        </div>
      </div>
    </section>
  )
}

export default AccountProfile
