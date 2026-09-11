import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CalendarDays,
  Calculator,
  ChevronDown,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  GraduationCap,
  ListChecks,
  FlaskConical,
  Languages,
  LineChart,
  Maximize2,
  Pencil,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import ScrollableModal from '../../components/student/common/ScrollableModal'
import { learningProfilePage } from '../../data/learningProfile'

const componentIcons = {
  vietnamese: Languages,
  english: BookOpen,
  math: Calculator,
  science: FlaskConical,
}

const componentColors = {
  vietnamese: '#1B4DE4',
  english: '#D97706',
  math: '#16A05B',
  science: '#6D54D4',
}

const learningMetricIcons = {
  lessons: BookOpen,
  time: Clock3,
  questions: ClipboardCheck,
  topics: Brain,
}

const practiceOverviewIcons = {
  completed: ClipboardCheck,
  latest: Activity,
  best: Trophy,
  average: BarChart3,
}

const practiceStatIcons = {
  accuracy: Target,
  time: Clock3,
  questions: ListChecks,
  completed: BadgeCheck,
}

const tabs = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'learning', label: 'Học tập' },
  { key: 'practice', label: 'Luyện đề' },
]

const practiceFilters = ['Tất cả', 'Thi thử', 'Mini Test']

function ProgressLine({ value, max = 100 }) {
  return (
    <div className="hl-profile-progress" aria-hidden="true">
      <span style={{ width: `${Math.min(100, Math.round((value / max) * 100))}%` }} />
    </div>
  )
}

function TrendBadge({ value, label = 'so với tuần trước' }) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown

  return (
    <span className={`hl-profile-trend ${positive ? 'is-up' : 'is-down'}`}>
      <Icon size={14} />
      {positive ? '+' : ''}{value}% {label}
    </span>
  )
}

function MetricCard({ icon: Icon, label, value, note }) {
  return (
    <div className="hl-profile-metric-card">
      {Icon && <Icon size={18} />}
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  )
}

function LearningMetricCard({ metric }) {
  const Icon = learningMetricIcons[metric.key] || BookOpen

  return (
    <div className={`hl-profile-metric-card hl-profile-learning-metric-card is-${metric.tone}`}>
      <span className="hl-profile-learning-metric-icon">
        <Icon size={18} />
      </span>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
    </div>
  )
}

function LearningAccuracyCard({ item, comparisonLabel }) {
  const Icon = componentIcons[item.key] || Brain

  return (
    <article className={`hl-profile-card hl-profile-accuracy-card is-${item.accent}`}>
      <div className="hl-profile-accuracy-top">
        <span className="hl-profile-subject-badge">
          <Icon size={17} />
        </span>
        <span>{item.name}</span>
      </div>
      <strong>{item.accuracy}%</strong>
      <TrendBadge value={item.trend} label={comparisonLabel.toLowerCase()} />
    </article>
  )
}

function PracticeMetricCard({ metric, iconMap }) {
  const Icon = iconMap[metric.key] || ClipboardCheck

  return (
    <div className={`hl-profile-metric-card hl-profile-practice-metric-card is-${metric.tone}`}>
      <span className="hl-profile-practice-metric-icon">
        <Icon size={18} />
      </span>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
    </div>
  )
}

function SectionHeading({ title, subtitle, action, onAction }) {
  return (
    <div className="hl-profile-section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <button type="button" onClick={onAction}>{action}</button>}
    </div>
  )
}

function ScoreChart({ title, subtitle, points, series, target = 900, max = 1200, componentMode = false, toolbar, filterLabel = 'Tất cả' }) {
  const chartWidth = 640
  const chartHeight = 220
  const padding = { top: 24, right: 26, bottom: 30, left: 48 }
  const usableWidth = chartWidth - padding.left - padding.right
  const usableHeight = chartHeight - padding.top - padding.bottom
  const chartSeries = series?.length ? series : [{ key: 'score', label: componentMode ? 'Điểm thành phần' : 'Điểm ĐGNL', color: '#1B4DE4', points }]
  const axisPoints = chartSeries[0]?.points || points || []
  const axisLevels = max === 1200 ? [1200, 900, 600, 300, 0] : [max, Math.round(max * .75), Math.round(max * .5), Math.round(max * .25), 0]
  const toPoint = (item, index, list = axisPoints) => {
    const x = padding.left + (list.length === 1 ? usableWidth / 2 : (index / Math.max(1, list.length - 1)) * usableWidth)
    const y = padding.top + usableHeight - (item.score / max) * usableHeight
    return `${x},${y}`
  }
  const polyline = axisPoints.map((item, index) => toPoint(item, index)).join(' ')
  const targetY = padding.top + usableHeight - (target / max) * usableHeight
  const latest = axisPoints[axisPoints.length - 1]
  const latestCoordinates = latest ? toPoint(latest, axisPoints.length - 1).split(',').map(Number) : [0, 0]

  return (
    <article className="hl-profile-card hl-profile-chart-card">
      <div className="hl-profile-chart-head">
        <SectionHeading title={title} subtitle={subtitle} />
        {filterLabel && <span>{filterLabel}</span>}
      </div>
      {toolbar}
      <div className="hl-profile-chart-wrap">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={title}>
          {axisLevels.map((level) => {
            const y = padding.top + usableHeight - (level / max) * usableHeight
            return (
              <g key={level}>
                <text x={padding.left - 12} y={y + 4} textAnchor="end" className="hl-profile-axis-label">{level}</text>
                <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} className="hl-profile-grid-line" />
              </g>
            )
          })}
          <line x1={padding.left} x2={padding.left} y1={padding.top} y2={padding.top + usableHeight} className="hl-profile-axis-line" />
          <line x1={padding.left} x2={chartWidth - padding.right} y1={targetY} y2={targetY} className="hl-profile-target-line" />
          <text x={chartWidth - padding.right} y={targetY - 6} textAnchor="end" className="hl-profile-chart-label">Mục tiêu {target}</text>
          {series?.length ? chartSeries.map((entry) => (
            <g key={entry.key}>
              <polyline
                points={entry.points.map((item, index) => toPoint(item, index, entry.points)).join(' ')}
                className="hl-profile-line"
                style={{ stroke: entry.color }}
              />
              {entry.points.map((item, index) => {
                const [x, y] = toPoint(item, index, entry.points).split(',').map(Number)
                return (
                  <circle
                    key={`${entry.key}-${item.label}-${index}`}
                    cx={x}
                    cy={y}
                    r="3.6"
                    className="hl-profile-point"
                    style={{ stroke: entry.color }}
                  />
                )
              })}
            </g>
          )) : (
            <polyline points={polyline} className={componentMode ? 'hl-profile-line is-component' : 'hl-profile-line'} />
          )}
          {axisPoints.map((item, index) => {
            const [x, y] = toPoint(item, index).split(',').map(Number)
            return (
              <g key={`${item.label}-${index}`}>
                {!series?.length && <circle cx={x} cy={y} r="4.5" className="hl-profile-point" />}
                <text x={x} y={chartHeight - 8} textAnchor="middle" className="hl-profile-chart-label">{item.label}</text>
              </g>
            )
          })}
          {latest && !componentMode && (
            <g className="hl-profile-chart-tooltip">
              <rect x={Math.min(chartWidth - 118, latestCoordinates[0] - 36)} y={latestCoordinates[1] - 54} width="92" height="42" rx="10" />
              <text x={Math.min(chartWidth - 72, latestCoordinates[0] + 10)} y={latestCoordinates[1] - 34} textAnchor="middle">{latest.score} điểm</text>
              <text x={Math.min(chartWidth - 72, latestCoordinates[0] + 10)} y={latestCoordinates[1] - 18} textAnchor="middle">{latest.label}</text>
            </g>
          )}
        </svg>
      </div>
      <div className="hl-profile-chart-legend">
        {series?.length ? chartSeries.map((entry) => (
          <span key={entry.key}><i style={{ background: entry.color }} /> {entry.label}</span>
        )) : (
          <span><i /> {chartSeries[0]?.label || 'Điểm ĐGNL'}</span>
        )}
        {!componentMode && <span><i /> Mục tiêu</span>}
      </div>
    </article>
  )
}

function OverallCompetencySummary() {
  const profile = learningProfilePage
  const scorePercent = Math.round((profile.currentScore / profile.maxScore) * 100)

  return (
    <div className="hl-profile-overall-competency">
      <SectionHeading
        title="Tổng quan năng lực"
        subtitle="Điểm ĐGNL hiện tại"
      />
      <div className="hl-profile-score-donut" style={{ '--hl-profile-score': `${scorePercent}%` }}>
        <strong>{profile.currentScore}</strong>
        <span>/ {profile.maxScore}</span>
      </div>
      <p>{scorePercent}% tổng thang điểm</p>
    </div>
  )
}

function ComparisonDropdown({ options, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setOpen(false)
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', closeDropdown)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeDropdown)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <div className="hl-profile-comparison" ref={dropdownRef}>
      <span>So sánh với</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {selected.label}
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className="hl-profile-comparison-menu" role="listbox" aria-label="Chọn khoảng so sánh">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="option"
              aria-selected={selected.key === option.key}
              className={selected.key === option.key ? 'is-selected' : ''}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ComponentSection({ selectedComparison, onComparisonChange }) {
  return (
    <div className="hl-profile-component-section">
      <div className="hl-profile-component-section-head">
        <SectionHeading
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
  const [selectedComparison, setSelectedComparison] = useState(learningProfilePage.comparisonRanges[0])

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

function AnalysisResult({ analysis }) {
  return (
    <div className="hl-profile-ai-result">
      <span>Phân tích dựa trên kết quả làm đề gần đây</span>
      <p>{analysis.summary}</p>
      <div className="hl-profile-ai-result-grid">
        <div>
          <strong>Điểm mạnh</strong>
          <ul>
            {analysis.strengths.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <strong>Cần cải thiện</strong>
          <ul>
            {analysis.improvements.map((item) => <li key={item}>{item}</li>)}
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
        <strong><Icon size={16} />{title}</strong>
        <div>
          <button type="button" onClick={onDetail} aria-label={`Xem chi tiết ${title.toLowerCase()}`}>
            <Maximize2 size={14} />
            Xem chi tiết
          </button>
        </div>
      </div>
      <div className="hl-profile-ai-insight-body">
        <ul className={type === 'strength' ? 'hl-profile-insight-list' : 'hl-profile-insight-list is-warning'}>
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
      description: 'Nên tiếp tục duy trì nhịp luyện tập ở nhóm kỹ năng này trong các bài học và đề gần nhất.',
    },
    improvement: {
      detailTitle: 'Chi tiết cần cải thiện',
      items: activeAnalysis?.improvements || [],
      description: 'Nên ưu tiên ôn tập có chủ đích và theo dõi lại độ chính xác sau mỗi phiên luyện đề.',
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
            <span className={`is-${item.tone}`}><Award size={17} /></span>
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

function ComponentCard({ component, trend = component.trend, trendLabel }) {
  const Icon = componentIcons[component.key] || Brain

  return (
    <article className={`hl-profile-card hl-profile-component-card is-${component.accent}`}>
      <div className="hl-profile-component-top">
        <span><Icon size={18} /></span>
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

function ActivityHeatmap({ data }) {
  return (
    <article className="hl-profile-card hl-profile-heatmap-card">
      <SectionHeading title="Tần suất học tập" subtitle="Duy trì thói quen học tập để đạt kết quả tốt nhất" />
      <div className="hl-profile-legend">
        <span><i /> Không có hoạt động</span>
        <span><i /> &lt;15 phút</span>
        <span><i /> 15-60 phút</span>
        <span><i /> &gt;60 phút</span>
      </div>
      <div className="hl-profile-months">
        {data.months.map((month) => <span key={month}>{month}</span>)}
      </div>
      <div className="hl-profile-heatmap">
        <div className="hl-profile-days">
          {data.days.map((day) => <span key={day}>{day}</span>)}
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
        <strong><Award size={18} />Thành tựu gần đây</strong>
        <button type="button" onClick={onAction}>Xem tất cả</button>
      </div>
      <div className="hl-profile-achievement-list">
        {learningProfilePage.achievements.map((item) => (
          <div key={item.title}>
            <span className={`is-${item.tone}`}><Award size={15} /></span>
            <p>{item.title}</p>
            <time>{item.date}</time>
          </div>
        ))}
      </div>
    </article>
  )
}

function PracticeAiDetailModal({ analysis, isOpen, onClose }) {
  return (
    <ScrollableModal title="Phân tích luyện đề" isOpen={isOpen} onClose={onClose} maxWidth={720}>
      <div className="hl-profile-practice-ai-detail">
        <span>{analysis.basedOn}</span>
        <p>{analysis.summary}</p>
        <div className="hl-profile-practice-ai-detail-list">
          {analysis.recommendations.map((item) => (
            <article key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <b>{item.accuracy}% chính xác</b>
              </div>
              <p>{item.explanation}</p>
              <small>Ưu tiên: {item.priority}</small>
            </article>
          ))}
        </div>
      </div>
    </ScrollableModal>
  )
}

function PracticeAiHistoryModal({ analysis, isOpen, onClose }) {
  return (
    <ScrollableModal title="Lịch sử phân tích luyện đề" isOpen={isOpen} onClose={onClose} maxWidth={680}>
      <div className="hl-profile-history-list">
        {analysis.history.map((item) => (
          <article key={item.id} className="hl-profile-history-item">
            <div>
              <strong>{item.createdAt}</strong>
              <span>{item.basedOn}</span>
            </div>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </ScrollableModal>
  )
}

function formatFeedbackDate(date) {
  if (!date) return ''

  const [year, month, day] = date.split('-')
  return day && month && year ? `${day}/${month}/${year}` : date
}

function TeacherFeedbackDetailModal({ feedback, isOpen, onClose }) {
  if (!feedback) return null

  return (
    <ScrollableModal title="Chi tiết nhận xét giáo viên" isOpen={isOpen} onClose={onClose} maxWidth={760}>
      <div className="hl-profile-teacher-detail">
        <div className="hl-profile-teacher-detail-head">
          <span className="hl-profile-teacher-avatar" aria-hidden="true">
            {feedback.teacher.avatar ? <img src={feedback.teacher.avatar} alt="" /> : <GraduationCap size={20} />}
          </span>
          <div>
            <strong>{feedback.teacher.name}</strong>
            <span>{feedback.teacher.role} · {feedback.teacher.subject}</span>
            <time>{formatFeedbackDate(feedback.createdAt)}</time>
          </div>
        </div>

        <div className="hl-profile-teacher-detail-grid">
          <section>
            <h3>Điểm làm tốt</h3>
            <ul className="hl-profile-insight-list">
              {feedback.strengths.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Nội dung cần cải thiện</h3>
            <ul className="hl-profile-insight-list is-warning">
              {feedback.improvements.map((item) => (
                <li key={item}>
                  <Target size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="hl-profile-teacher-comment">
          <h3>Lời khuyên</h3>
          <p>{feedback.comment}</p>
        </section>
      </div>
    </ScrollableModal>
  )
}

function TeacherFeedbackPanel({ feedbackList, onOpenDetail }) {
  const [selectedDate, setSelectedDate] = useState('all')
  const feedbackDates = [...new Set(feedbackList.map((item) => item.createdAt))]
  const visibleFeedback = selectedDate === 'all'
    ? feedbackList
    : feedbackList.filter((item) => item.createdAt === selectedDate)

  if (!feedbackList.length) {
    return (
      <div className="hl-profile-teacher-empty">
        <GraduationCap size={28} />
        <strong>Chưa có nhận xét từ giáo viên</strong>
        <p>Nhận xét từ giáo viên hoặc mentor sẽ xuất hiện tại đây sau khi họ đánh giá quá trình học tập của bạn.</p>
      </div>
    )
  }

  return (
    <div className="hl-profile-teacher-panel">
      <div className="hl-profile-teacher-filter">
        <span>Lọc theo ngày</span>
        <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>
          <option value="all">Tất cả nhận xét</option>
          {feedbackDates.map((date) => (
            <option key={date} value={date}>{formatFeedbackDate(date)}</option>
          ))}
        </select>
      </div>

      <div className="hl-profile-teacher-comment-list">
        {visibleFeedback.map((item) => (
          <button key={item.id} type="button" className="hl-profile-teacher-comment-card" onClick={() => onOpenDetail(item)}>
            <div>
              <div className="hl-profile-teacher-comment-head">
                <strong>{item.teacher.name}</strong>
                <time>{formatFeedbackDate(item.createdAt)}</time>
              </div>
              <span>{item.teacher.role} · {item.teacher.subject}</span>
              <p>{item.comment}</p>
            </div>
            <Maximize2 size={14} />
          </button>
        ))}
      </div>
    </div>
  )
}

function PracticeAiRecommendations({ onAction }) {
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [activeSource, setActiveSource] = useState('ai')
  const [feedbackDetail, setFeedbackDetail] = useState(null)
  const activeAnalysis = analysis
  const teacherFeedback = learningProfilePage.teacherFeedback || []
  const hasActiveContent = activeSource === 'ai' ? Boolean(activeAnalysis) : teacherFeedback.length > 0
  const practiceStrengths = learningProfilePage.strengths.slice(0, 3)
  const practiceImprovements = activeAnalysis?.recommendations.slice(0, 3) || []

  const runPracticeAnalysis = () => {
    if (isAnalyzing) return

    setIsAnalyzing(true)
    window.setTimeout(() => {
      setAnalysis(learningProfilePage.practiceAiAnalysis)
      setIsAnalyzing(false)
      onAction('Phân tích luyện đề hoàn tất.')
    }, 680)
  }

  return (
    <article className={`hl-profile-card hl-profile-practice-ai-card ${hasActiveContent ? 'is-expanded' : 'is-compact'}`}>
      <SectionHeading title="Nội dung cần cải thiện" subtitle="Phân tích và nhận xét giúp bạn xác định nội dung cần ưu tiên cải thiện." />

      <div className="hl-profile-feedback-head">
        <div className="hl-profile-feedback-tabs" role="tablist" aria-label="Nguồn đánh giá">
          <button
            type="button"
            role="tab"
            aria-selected={activeSource === 'ai'}
            className={activeSource === 'ai' ? 'is-active' : ''}
            onClick={() => setActiveSource('ai')}
          >
            <Bot size={15} />
            AI phân tích
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSource === 'teacher'}
            className={activeSource === 'teacher' ? 'is-active' : ''}
            onClick={() => setActiveSource('teacher')}
          >
            <GraduationCap size={15} />
            Nhận xét giáo viên
          </button>
        </div>
        {activeSource === 'ai' && (
          <button type="button" className="hl-profile-practice-update-button" onClick={runPracticeAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? 'Đang phân tích...' : activeAnalysis ? 'Cập nhật phân tích' : 'Phân tích ngay'}
          </button>
        )}
      </div>

      {activeSource === 'ai' ? (
        <>
          {!activeAnalysis && (
            <p className="hl-profile-practice-ai-empty">Hiện tại chưa có nội dung phân tích.</p>
          )}

          {activeAnalysis ? (
            <>
              <div className="hl-profile-practice-ai-insight-grid">
                <article className="hl-profile-card hl-profile-practice-insight-card is-strength">
                  <div className="hl-profile-practice-insight-head">
                    <strong>Điểm mạnh</strong>
                    <div>
                      <button type="button" onClick={() => setDetailOpen(true)}>
                        <Maximize2 size={14} />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                  <div className="hl-profile-practice-insight-body">
                    <ul className="hl-profile-insight-list">
                      {practiceStrengths.map((item) => (
                        <li key={item}>
                          <CheckCircle2 size={15} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>

                <article className="hl-profile-card hl-profile-practice-insight-card is-improvement">
                  <div className="hl-profile-practice-insight-head">
                    <strong>Cần cải thiện</strong>
                    <div>
                      <button type="button" onClick={() => setDetailOpen(true)}>
                        <Maximize2 size={14} />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                  <div className="hl-profile-practice-insight-body">
                    <ul className="hl-profile-insight-list is-warning">
                      {practiceImprovements.map((item) => (
                        <li key={item.title}>
                          <Target size={15} />
                          <span>{item.title}</span>
                          <small>{item.accuracy}%</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>

              <button type="button" className="hl-profile-practice-ai-history-button" onClick={() => setHistoryOpen(true)}>
                Xem lại phân tích cũ
              </button>
            </>
          ) : null}
        </>
      ) : (
        <TeacherFeedbackPanel
          feedbackList={teacherFeedback}
          onOpenDetail={setFeedbackDetail}
        />
      )}

      {activeAnalysis && activeSource === 'ai' && (
        <>
          <PracticeAiDetailModal analysis={activeAnalysis} isOpen={detailOpen} onClose={() => setDetailOpen(false)} />
          <PracticeAiHistoryModal analysis={activeAnalysis} isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
        </>
      )}
      <TeacherFeedbackDetailModal feedback={feedbackDetail} isOpen={Boolean(feedbackDetail)} onClose={() => setFeedbackDetail(null)} />
    </article>
  )
}

function OverviewTab({ analysis, isAnalyzing, onAnalyze, onAction, panelId, labelledBy }) {
  const profile = learningProfilePage
  const [aiHistoryOpen, setAiHistoryOpen] = useState(false)
  const [achievementHistoryOpen, setAchievementHistoryOpen] = useState(false)
  const average = Math.round(profile.scoreAttempts.reduce((sum, item) => sum + item.score, 0) / profile.scoreAttempts.length)
  const best = Math.max(...profile.scoreAttempts.map((item) => item.score))

  return (
    <div className="hl-profile-tab-panel" role="tabpanel" id={panelId} aria-labelledby={labelledBy}>
      <UnifiedCompetencySection />

      <section className="hl-profile-analytics-grid">
        <div className="hl-profile-chart-stack">
          <ScoreChart title="Xu hướng điểm ĐGNL" subtitle="Kết quả các bài thi thử gần đây" points={profile.scoreAttempts} />

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
      <AchievementHistoryModal isOpen={achievementHistoryOpen} onClose={() => setAchievementHistoryOpen(false)} />
    </div>
  )
}

function LearningTab({ onAction, panelId, labelledBy }) {
  const [selectedAccuracyPeriod, setSelectedAccuracyPeriod] = useState(learningProfilePage.learningAccuracyPeriods[0])
  const totalCourses = learningProfilePage.courseProgress.length
  const completedCourses = learningProfilePage.courseProgress.filter((course) => course.progress >= 100).length
  const activeCourses = learningProfilePage.courseProgress.filter((course) => course.progress > 0 && course.progress < 100).length
  const untouchedCourses = totalCourses - completedCourses - activeCourses
  const accuracyItems = learningProfilePage.weeklyAccuracy.map((item) => {
    const component = learningProfilePage.components.find((entry) => entry.key === item.key)
    const periodValues = selectedAccuracyPeriod.values[item.key] || item

    return {
      ...item,
      ...periodValues,
      accent: component?.accent || 'blue',
    }
  })

  return (
    <div className="hl-profile-tab-panel" role="tabpanel" id={panelId} aria-labelledby={labelledBy}>
      <section className="hl-profile-learning-grid">
        <article className="hl-profile-card hl-profile-course-card">
          <SectionHeading title="Tiến độ khóa học" action="Xem tất cả" onAction={onAction} />
          <div className="hl-profile-course-content">
            <div className="hl-profile-donut" style={{ '--hl-profile-progress': `${Math.round((activeCourses / totalCourses) * 100)}%` }}>
              <strong>{totalCourses}</strong>
              <span>Tổng khóa học</span>
            </div>
            <div className="hl-profile-course-legend">
              <span><i /> Chưa bắt đầu: {untouchedCourses}</span>
              <span><i /> Đang học: {activeCourses}</span>
              <span><i /> Hoàn thành: {completedCourses}</span>
            </div>
            <div className="hl-profile-course-list">
              <strong>Khóa học gần đây</strong>
              {learningProfilePage.courseProgress.map((course) => (
                <div key={course.name}>
                  <p><span>{course.name}</span><b>{course.progress}%</b></p>
                  <ProgressLine value={course.progress} />
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="hl-profile-metric-grid">
          {learningProfilePage.learningMetrics.map((metric) => (
            <LearningMetricCard key={metric.key} metric={metric} />
          ))}
        </div>
      </section>

      <section className="hl-profile-learning-accuracy-section">
        <div className="hl-profile-learning-section-head">
          <SectionHeading title="Độ chính xác trung bình" subtitle={selectedAccuracyPeriod.comparisonLabel} />
          <ComparisonDropdown
            options={learningProfilePage.learningAccuracyPeriods}
            selected={selectedAccuracyPeriod}
            onChange={setSelectedAccuracyPeriod}
          />
        </div>
        <div className="hl-profile-accuracy-grid">
          {accuracyItems.map((item) => (
            <LearningAccuracyCard
              key={item.key}
              item={item}
              comparisonLabel={selectedAccuracyPeriod.comparisonLabel}
            />
          ))}
        </div>
      </section>

      <article className="hl-profile-card hl-profile-history-card">
        <SectionHeading title="Lịch sử học tập" subtitle="Hoạt động trong 30 ngày gần đây" />
        <div className="hl-profile-timeline is-scrollable">
          {learningProfilePage.learningHistory.map((item) => (
            <div key={`${item.date}-${item.title}`}>
              <time>{item.date}</time>
              <span />
              <p><strong>{item.title}</strong><small>{item.meta}</small></p>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

function PracticeTab({ onAction, panelId, labelledBy }) {
  const [filter, setFilter] = useState('Tất cả')
  const [selectedComponents, setSelectedComponents] = useState(() => learningProfilePage.components.map((item) => item.key))
  const attempts = useMemo(() => {
    if (filter === 'Tất cả') return learningProfilePage.practiceAttempts
    return learningProfilePage.practiceAttempts.filter((item) => item.type === filter)
  }, [filter])
  const componentPoints = attempts.map((attempt) => ({
    label: attempt.label,
    score: Math.round(selectedComponents.reduce((sum, key) => sum + (attempt.components[key] || 0), 0) / Math.max(1, selectedComponents.length)),
  }))
  const componentSeries = learningProfilePage.components
    .filter((component) => selectedComponents.includes(component.key))
    .map((component) => ({
      key: component.key,
      label: component.name,
      color: componentColors[component.key],
      points: attempts.map((attempt) => ({
        label: attempt.label,
        score: attempt.components[component.key] || 0,
      })),
    }))

  const toggleComponent = (key) => {
    setSelectedComponents((current) => current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key])
  }

  return (
    <div className="hl-profile-tab-panel" role="tabpanel" id={panelId} aria-labelledby={labelledBy}>
      <div className="hl-profile-metric-grid is-four">
        {learningProfilePage.practiceOverview.map((metric) => (
          <PracticeMetricCard key={metric.key} metric={metric} iconMap={practiceOverviewIcons} />
        ))}
      </div>

      <section className="hl-profile-practice-chart-grid">
        <ScoreChart
          title="Theo dõi điểm số"
          subtitle="Dựa trên các bài thi thử gần nhất"
          points={attempts}
          filterLabel={null}
          toolbar={(
            <div className="hl-profile-filter-row" role="tablist" aria-label="Lọc bài luyện đề">
            {practiceFilters.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                className={filter === item ? 'is-active' : ''}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
            </div>
          )}
        />

        <ScoreChart
          title="Kết quả theo thành phần"
          points={componentPoints}
          series={componentSeries}
          target={230}
          max={300}
          componentMode
          filterLabel={null}
          toolbar={(
            <div className="hl-profile-toggle-row">
            {learningProfilePage.components.map((component) => (
              <label key={component.key}>
                <input
                  type="checkbox"
                  checked={selectedComponents.includes(component.key)}
                  onChange={() => toggleComponent(component.key)}
                />
                <span>{component.name}</span>
              </label>
            ))}
            </div>
          )}
        />
      </section>

      <section>
        <SectionHeading title="Hiệu suất luyện đề" />
        <div className="hl-profile-metric-grid is-four">
          {learningProfilePage.practiceStats.map((metric) => (
            <PracticeMetricCard key={metric.key} metric={metric} iconMap={practiceStatIcons} />
          ))}
        </div>
      </section>

      <PracticeAiRecommendations onAction={onAction} />
    </div>
  )
}

function LearningProfile() {
  const [activeTab, setActiveTab] = useState('overview')
  const [message, setMessage] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const profile = learningProfilePage
  const heroMetrics = [
    { label: 'Hiện tại', value: profile.currentScore },
    { label: 'Điểm gần nhất', value: profile.latestScore },
    { label: 'Mục tiêu', value: profile.targetScore },
  ]

  const showMessage = (text = 'Tính năng này đang được phát triển.') => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2600)
  }
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
      {message && <div className="hl-student-toast">{message}</div>}

      <header className="hl-profile-header">
        <div>
          <h1>Hồ sơ năng lực</h1>
          <p>Theo dõi năng lực và sự tiến bộ trong quá trình ôn thi ĐGNL</p>
        </div>
      </header>

      <article className="hl-profile-hero">
        <div className="hl-profile-hero-header">
          <div className="hl-profile-hero-user">
            <img className="hl-profile-hero-avatar" src="/owl-mascot3.png" alt="" aria-hidden="true" />
            <div className="hl-profile-hero-content">
              <h2>Hi, <span>{profile.studentName}</span></h2>
              <p>Hãy tiếp tục học mỗi ngày - nỗ lực của bạn sẽ được đền đáp!</p>
              <div className="hl-profile-hero-exam">
                <strong>{profile.exam}</strong>
                <button type="button" onClick={() => showMessage('Tính năng chọn ngày thi đang được phát triển.')}>
                  <CalendarDays size={15} />
                  Chọn ngày thi của bạn
                </button>
              </div>
            </div>
          </div>
          <button type="button" className="hl-profile-edit-button" onClick={() => showMessage('Tính năng chỉnh sửa hồ sơ đang được phát triển.')}>
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
                <b>{metric.value} <small>/ {profile.maxScore}</small></b>
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
        <button type="button" className="hl-profile-date-filter" onClick={() => showMessage('Tính năng lọc theo thời gian đang được phát triển.')}>
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
          onAction={(text) => showMessage(text || 'Tính năng phân tích chi tiết đang được phát triển.')}
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
