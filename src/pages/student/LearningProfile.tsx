import { useState } from 'react'
import { CalendarDays, Pencil } from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { learningProfilePage } from '../../data/learningProfile'
import { tabs } from './learning-profile/icons'
import OverviewTab from './learning-profile/OverviewTab'
import LearningTab from './learning-profile/LearningTab'
import PracticeTab from './learning-profile/PracticeTab'
import { useTransientMessage } from '../../hooks/useTransientMessage'
import StudentToast from '../../components/student/common/StudentToast'

function LearningProfile() {
  const [activeTab, setActiveTab] = useState('overview')
  const { message, show } = useTransientMessage(2600)
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const profile = learningProfilePage
  const { profile: currentUser } = useCurrentUser()
  const displayName =
    currentUser?.displayName ||
    [currentUser?.lastName, currentUser?.firstName].filter(Boolean).join(' ') ||
    profile.studentName
  const heroMetrics = [
    { label: 'Hiện tại', value: profile.currentScore },
    { label: 'Điểm gần nhất', value: profile.latestScore },
    { label: 'Mục tiêu', value: profile.targetScore },
  ]

  const showMessage = (text = 'Tính năng này đang được phát triển.') => show(text)

  const runAnalysis = () => {
    if (isAnalyzing) return

    setIsAnalyzing(true)
    window.setTimeout(() => {
      setAnalysis({
        ...profile.aiAnalysisHistory[0],
        id: 'analysis-current',
        createdAt: 'Hôm nay',
      })
      setIsAnalyzing(false)
      showMessage('Phân tích hoàn tất.')
    }, 760)
  }

  return (
    <section className="hl-student-page hl-profile-page">
      <StudentToast message={message} />

      <header className="hl-profile-header">
        <div>
          <h1>Hồ sơ năng lực</h1>
          <p>Theo dõi năng lực và sự tiến bộ trong quá trình ôn thi ĐGNL</p>
        </div>
      </header>

      <article className="hl-profile-hero">
        <div className="hl-profile-hero-header">
          <div className="hl-profile-hero-user">
            <img
              className="hl-profile-hero-avatar"
              src="/owl-welcome-wave.png"
              alt=""
              aria-hidden="true"
            />
            <div className="hl-profile-hero-content">
              <h2>
                Hi, <span>{displayName}</span>
              </h2>
              <p>Hãy tiếp tục học mỗi ngày - nỗ lực của bạn sẽ được đền đáp!</p>
              <div className="hl-profile-hero-exam">
                <strong>{profile.exam}</strong>
                <button
                  type="button"
                  onClick={() => showMessage('Tính năng chọn ngày thi đang được phát triển.')}
                >
                  <CalendarDays size={15} />
                  Chọn ngày thi của bạn
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="hl-profile-edit-button"
            onClick={() => showMessage('Tính năng chỉnh sửa hồ sơ đang được phát triển.')}
          >
            <Pencil size={16} />
            Chỉnh sửa hồ sơ
          </button>
        </div>

        <div className="hl-profile-hero-summary">
          <strong>Tổng quan năng lực</strong>
          <div className="hl-profile-hero-metrics">
            {heroMetrics.map((metric) => (
              <div className="hl-profile-hero-metric" key={metric.label}>
                <span>{metric.label}</span>
                <b>
                  {metric.value} <small>/ {profile.maxScore}</small>
                </b>
              </div>
            ))}
          </div>
        </div>
      </article>

      <div className="hl-profile-nav-row">
        <div className="hl-profile-tabs" role="tablist" aria-label="Hồ sơ năng lực">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              id={`hl-profile-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`hl-profile-panel-${tab.key}`}
              className={activeTab === tab.key ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="hl-profile-date-filter"
          onClick={() => showMessage('Tính năng lọc theo thời gian đang được phát triển.')}
        >
          <CalendarDays size={16} />
          01/06/2025 - 31/08/2025
        </button>
      </div>

      {activeTab === 'overview' && (
        <OverviewTab
          panelId="hl-profile-panel-overview"
          labelledBy="hl-profile-tab-overview"
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onAnalyze={runAnalysis}
          onAction={(text) =>
            showMessage(text || 'Tính năng phân tích chi tiết đang được phát triển.')
          }
        />
      )}
      {activeTab === 'learning' && (
        <LearningTab
          panelId="hl-profile-panel-learning"
          labelledBy="hl-profile-tab-learning"
          onAction={() => showMessage()}
        />
      )}
      {activeTab === 'practice' && (
        <PracticeTab
          panelId="hl-profile-panel-practice"
          labelledBy="hl-profile-tab-practice"
          onAction={() => showMessage('Tính năng luyện tập theo đề xuất đang được phát triển.')}
        />
      )}
    </section>
  )
}

export default LearningProfile
