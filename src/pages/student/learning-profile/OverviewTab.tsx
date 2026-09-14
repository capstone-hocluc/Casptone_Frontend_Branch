import { type CSSProperties, useState } from 'react'
import {
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  LineChart,
  Maximize2,
  Target,
  Trophy,
} from 'lucide-react'
import ScrollableModal from '../../../components/student/common/ScrollableModal'
import { learningProfilePage } from '../../../data/learningProfile'
import { componentIcons } from './icons'
import {
  ComparisonDropdown,
  MetricCard,
  ProfileSectionHeading,
  ProgressLine,
  TrendBadge,
} from './shared'
import ScoreChart from './ScoreChart'

function OverallCompetencySummary() {
  const profile = learningProfilePage
  const scorePercent = Math.round((profile.currentScore / profile.maxScore) * 100)

  return (
    <div className="hl-profile-overall-competency">
      <ProfileSectionHeading title="Tổng quan năng lực" subtitle="Điểm ĐGNL hiện tại" />
      <div
        className="hl-profile-score-donut"
        style={{ '--hl-profile-score': `${scorePercent}%` } as CSSProperties}
      >
        <strong>{profile.currentScore}</strong>
        <span>/ {profile.maxScore}</span>
      </div>
      <p>{scorePercent}% tổng thang điểm</p>
    </div>
  )
}

function ComponentCard({ component, trend = component.trend, trendLabel }) {
  const Icon = componentIcons[component.key] || Brain

  return (
    <article className={`hl-profile-card hl-profile-component-card is-${component.accent}`}>
      <div className="hl-profile-component-top">
        <span>
          <Icon size={18} />
        </span>
        <strong>{component.name}</strong>
      </div>
      <div className="hl-profile-component-score">
        <b>{component.score}</b>
        <small>/ {component.maxScore}</small>
      </div>
      <ProgressLine value={component.score} max={component.maxScore} />
      <div className="hl-profile-component-meta">
        <span>Độ chính xác</span>
        <strong>{component.accuracy}%</strong>
      </div>
      <TrendBadge value={trend} label={trendLabel} />
      {component.skills && (
        <div className="hl-profile-skill-breakdown">
          {component.skills.map((skill) => (
            <p key={skill.name}>
              <span>{skill.name}</span>
              <b>{skill.accuracy}%</b>
            </p>
          ))}
        </div>
      )}
    </article>
  )
}

function ComponentSection({ selectedComparison, onComparisonChange }) {
  return (
    <div className="hl-profile-component-section">
      <div className="hl-profile-component-section-head">
        <ProfileSectionHeading
          title="Năng lực theo thành phần"
          subtitle="Chi tiết điểm số và độ chính xác của từng thành phần"
        />
        <ComparisonDropdown
          options={learningProfilePage.comparisonRanges}
          selected={selectedComparison}
          onChange={onComparisonChange}
        />
      </div>
      <div className="hl-profile-component-grid">
        {learningProfilePage.components.map((component) => (
          <ComponentCard
            key={component.key}
            component={component}
            trend={selectedComparison.trends[component.key] ?? component.trend}
            trendLabel={`so với ${selectedComparison.label.toLowerCase()}`}
          />
        ))}
      </div>
    </div>
  )
}

function UnifiedCompetencySection() {
  const [selectedComparison, setSelectedComparison] = useState(
    learningProfilePage.comparisonRanges[0]
  )

  return (
    <section className="hl-profile-card hl-profile-competency-suite">
      <OverallCompetencySummary />
      <ComponentSection
        selectedComparison={selectedComparison}
        onComparisonChange={setSelectedComparison}
      />
    </section>
  )
}

function ActivityHeatmap({ data }) {
  return (
    <article className="hl-profile-card hl-profile-heatmap-card">
      <ProfileSectionHeading
        title="Tần suất học tập"
        subtitle="Duy trì thói quen học tập để đạt kết quả tốt nhất"
      />
      <div className="hl-profile-legend">
        <span>
          <i /> Không có hoạt động
        </span>
        <span>
          <i /> &lt;15 phút
        </span>
        <span>
          <i /> 15-60 phút
        </span>
        <span>
          <i /> &gt;60 phút
        </span>
      </div>
      <div className="hl-profile-months">
        {data.months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
      <div className="hl-profile-heatmap">
        <div className="hl-profile-days">
          {data.days.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="hl-profile-cells">
          {data.days.map((day, row) => (
            <div key={day}>
              {data.totals.map((total, column) => {
                const level = total === 0 ? 0 : total < 15 ? 1 : total < 60 ? 2 : 3
                return <span key={`${row}-${column}`} className={`is-level-${level}`} />
              })}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function AchievementCard({ onAction }) {
  return (
    <article className="hl-profile-card hl-profile-achievement-card">
      <div className="hl-profile-achievement-head">
        <strong>
          <Award size={18} />
          Thành tựu gần đây
        </strong>
        <button type="button" onClick={onAction}>
          Xem tất cả
        </button>
      </div>
      <div className="hl-profile-achievement-list">
        {learningProfilePage.achievements.map((item) => (
          <div key={item.title}>
            <span className={`is-${item.tone}`}>
              <Award size={15} />
            </span>
            <p>{item.title}</p>
            <time>{item.date}</time>
          </div>
        ))}
      </div>
    </article>
  )
}

function AnalysisResult({ analysis }) {
  return (
    <div className="hl-profile-ai-result">
      <span>Phân tích dựa trên kết quả làm đề gần đây</span>
      <p>{analysis.summary}</p>
      <div className="hl-profile-ai-result-grid">
        <div>
          <strong>Điểm mạnh</strong>
          <ul>
            {analysis.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Cần cải thiện</strong>
          <ul>
            {analysis.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function AiInsightDetailModal({ insight, analysis, isOpen, onClose }) {
  if (!insight || !analysis) return null

  return (
    <ScrollableModal title={insight.detailTitle} isOpen={isOpen} onClose={onClose} maxWidth={720}>
      <div className="hl-profile-ai-detail">
        <p>{analysis.summary}</p>
        <div className="hl-profile-ai-detail-list">
          {insight.items.map((item) => (
            <article key={item}>
              <strong>{item}</strong>
              <span>{insight.description}</span>
            </article>
          ))}
        </div>
      </div>
    </ScrollableModal>
  )
}

function AiInsightCard({ type, title, items, onDetail }) {
  const Icon = type === 'strength' ? CheckCircle2 : Target

  return (
    <article className={`hl-profile-card hl-profile-ai-insight-card is-${type}`}>
      <div className="hl-profile-ai-insight-head">
        <strong>
          <Icon size={16} />
          {title}
        </strong>
        <div>
          <button
            type="button"
            onClick={onDetail}
            aria-label={`Xem chi tiết ${title.toLowerCase()}`}
          >
            <Maximize2 size={14} />
            Xem chi tiết
          </button>
        </div>
      </div>
      <div className="hl-profile-ai-insight-body">
        <ul
          className={
            type === 'strength' ? 'hl-profile-insight-list' : 'hl-profile-insight-list is-warning'
          }
        >
          {items.map((item) => (
            <li key={item}>
              <Icon size={15} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function AiLearningAssistant({ analysis, isAnalyzing, onAnalyze, onOpenHistory }) {
  const [detailType, setDetailType] = useState(null)
  const activeAnalysis = analysis
  const insightDetails = {
    strength: {
      detailTitle: 'Chi tiết điểm mạnh',
      items: activeAnalysis?.strengths || [],
      description:
        'Nên tiếp tục duy trì nhịp luyện tập ở nhóm kỹ năng này trong các bài học và đề gần nhất.',
    },
    improvement: {
      detailTitle: 'Chi tiết cần cải thiện',
      items: activeAnalysis?.improvements || [],
      description:
        'Nên ưu tiên ôn tập có chủ đích và theo dõi lại độ chính xác sau mỗi phiên luyện đề.',
    },
  }
  const selectedInsight = detailType ? insightDetails[detailType] : null

  return (
    <div className={`hl-profile-ai-stack ${activeAnalysis ? 'is-expanded' : 'is-compact'}`}>
      <section className="hl-profile-ai-action-banner">
        <div className="hl-profile-ai-banner-panel">
          <button type="button" onClick={onAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? 'Đang phân tích...' : analysis ? 'Cập nhật phân tích' : 'Phân tích ngay'}
          </button>
          <p>Phân tích kết quả làm đề của bạn để tìm ra điểm mạnh và nội dung cần cải thiện.</p>
        </div>
      </section>

      {activeAnalysis ? (
        <div className="hl-profile-ai-results">
          <AiInsightCard
            type="strength"
            title="Điểm mạnh"
            items={activeAnalysis.strengths}
            onDetail={() => setDetailType('strength')}
          />
          <AiInsightCard
            type="improvement"
            title="Cần cải thiện"
            items={activeAnalysis.improvements}
            onDetail={() => setDetailType('improvement')}
          />

          <button type="button" className="hl-profile-ai-history-button" onClick={onOpenHistory}>
            Xem lại phân tích cũ
          </button>
        </div>
      ) : null}

      <AiInsightDetailModal
        insight={selectedInsight}
        analysis={activeAnalysis}
        isOpen={Boolean(selectedInsight)}
        onClose={() => setDetailType(null)}
      />
    </div>
  )
}

function AiAnalysisHistoryModal({ isOpen, onClose }) {
  const [expandedId, setExpandedId] = useState(learningProfilePage.aiAnalysisHistory[0]?.id)

  return (
    <ScrollableModal title="Lịch sử phân tích AI" isOpen={isOpen} onClose={onClose}>
      <div className="hl-profile-history-list">
        {learningProfilePage.aiAnalysisHistory.map((item) => {
          const expanded = expandedId === item.id
          return (
            <article key={item.id} className="hl-profile-history-item">
              <div>
                <strong>{item.createdAt}</strong>
                <span>{item.basedOn}</span>
              </div>
              <p>{item.summary}</p>
              {expanded && <AnalysisResult analysis={item} />}
              <button type="button" onClick={() => setExpandedId(expanded ? '' : item.id)}>
                {expanded ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </article>
          )
        })}
      </div>
    </ScrollableModal>
  )
}

function AchievementHistoryModal({ isOpen, onClose }) {
  return (
    <ScrollableModal title="Tất cả thành tựu" isOpen={isOpen} onClose={onClose} maxWidth={640}>
      <div className="hl-profile-achievement-modal-list">
        {learningProfilePage.achievements.map((item) => (
          <article key={item.id} className="hl-profile-achievement-modal-item">
            <span className={`is-${item.tone}`}>
              <Award size={17} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            <time>{item.date}</time>
          </article>
        ))}
      </div>
    </ScrollableModal>
  )
}

function OverviewTab({
  analysis,
  isAnalyzing,
  onAnalyze,
  panelId,
  labelledBy,
  onAction,
}: {
  analysis: unknown
  isAnalyzing: boolean
  onAnalyze: () => void
  panelId: string
  labelledBy: string
  // Accepted for parity with the other tabs' onAction prop - unused here
  // today since this tab's only action button (AchievementCard) has its
  // own local handler instead.
  onAction?: (text?: string) => void
}) {
  const profile = learningProfilePage
  const [aiHistoryOpen, setAiHistoryOpen] = useState(false)
  const [achievementHistoryOpen, setAchievementHistoryOpen] = useState(false)
  const average = Math.round(
    profile.scoreAttempts.reduce((sum, item) => sum + item.score, 0) / profile.scoreAttempts.length
  )
  const best = Math.max(...profile.scoreAttempts.map((item) => item.score))

  return (
    <div className="hl-profile-tab-panel" role="tabpanel" id={panelId} aria-labelledby={labelledBy}>
      <UnifiedCompetencySection />

      <section className="hl-profile-analytics-grid">
        <div className="hl-profile-chart-stack">
          <ScoreChart
            title="Xu hướng điểm ĐGNL"
            subtitle="Kết quả các bài thi thử gần đây"
            points={profile.scoreAttempts}
          />

          <div className="hl-profile-chart-metrics">
            <MetricCard icon={LineChart} label="Điểm gần nhất" value={profile.latestScore} />
            <MetricCard icon={Trophy} label="Điểm cao nhất" value={best} />
            <MetricCard icon={BarChart3} label="Trung bình" value={average} />
          </div>

          <ActivityHeatmap data={profile.activityFrequency} />
        </div>

        <div className="hl-profile-right-stack">
          <AiLearningAssistant
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            onAnalyze={onAnalyze}
            onOpenHistory={() => setAiHistoryOpen(true)}
          />
          <AchievementCard onAction={() => setAchievementHistoryOpen(true)} />
        </div>
      </section>

      <AiAnalysisHistoryModal isOpen={aiHistoryOpen} onClose={() => setAiHistoryOpen(false)} />
      <AchievementHistoryModal
        isOpen={achievementHistoryOpen}
        onClose={() => setAchievementHistoryOpen(false)}
      />
    </div>
  )
}

export default OverviewTab
