import { useMemo, useState } from 'react'
import { Bot, CheckCircle2, ClipboardCheck, GraduationCap, Maximize2, Target } from 'lucide-react'
import ScrollableModal from '../../../components/student/common/ScrollableModal'
import { learningProfilePage } from '../../../data/learningProfile'
import { componentColors, practiceFilters, practiceOverviewIcons, practiceStatIcons } from './icons'
import { ProfileSectionHeading } from './shared'
import ScoreChart from './ScoreChart'

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
    <ScrollableModal
      title="Lịch sử phân tích luyện đề"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={680}
    >
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
    <ScrollableModal
      title="Chi tiết nhận xét giáo viên"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={760}
    >
      <div className="hl-profile-teacher-detail">
        <div className="hl-profile-teacher-detail-head">
          <span className="hl-profile-teacher-avatar" aria-hidden="true">
            {feedback.teacher.avatar ? (
              <img src={feedback.teacher.avatar} alt="" />
            ) : (
              <GraduationCap size={20} />
            )}
          </span>
          <div>
            <strong>{feedback.teacher.name}</strong>
            <span>
              {feedback.teacher.role} · {feedback.teacher.subject}
            </span>
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

function TeacherFeedbackPanel({
  feedbackList,
  onOpenDetail,
}: {
  feedbackList: (typeof learningProfilePage)['teacherFeedback']
  onOpenDetail: (feedback: (typeof learningProfilePage)['teacherFeedback'][number]) => void
}) {
  const [selectedDate, setSelectedDate] = useState('all')
  const feedbackDates = [...new Set(feedbackList.map((item) => item.createdAt))]
  const visibleFeedback =
    selectedDate === 'all'
      ? feedbackList
      : feedbackList.filter((item) => item.createdAt === selectedDate)

  if (!feedbackList.length) {
    return (
      <div className="hl-profile-teacher-empty">
        <GraduationCap size={28} />
        <strong>Chưa có nhận xét từ giáo viên</strong>
        <p>
          Nhận xét từ giáo viên hoặc mentor sẽ xuất hiện tại đây sau khi họ đánh giá quá trình học
          tập của bạn.
        </p>
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
            <option key={date} value={date}>
              {formatFeedbackDate(date)}
            </option>
          ))}
        </select>
      </div>

      <div className="hl-profile-teacher-comment-list">
        {visibleFeedback.map((item) => (
          <button
            key={item.id}
            type="button"
            className="hl-profile-teacher-comment-card"
            onClick={() => onOpenDetail(item)}
          >
            <div>
              <div className="hl-profile-teacher-comment-head">
                <strong>{item.teacher.name}</strong>
                <time>{formatFeedbackDate(item.createdAt)}</time>
              </div>
              <span>
                {item.teacher.role} · {item.teacher.subject}
              </span>
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
  const hasActiveContent =
    activeSource === 'ai' ? Boolean(activeAnalysis) : teacherFeedback.length > 0
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
    <article
      className={`hl-profile-card hl-profile-practice-ai-card ${hasActiveContent ? 'is-expanded' : 'is-compact'}`}
    >
      <ProfileSectionHeading
        title="Nội dung cần cải thiện"
        subtitle="Phân tích và nhận xét giúp bạn xác định nội dung cần ưu tiên cải thiện."
      />

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
          <button
            type="button"
            className="hl-profile-practice-update-button"
            onClick={runPracticeAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing
              ? 'Đang phân tích...'
              : activeAnalysis
                ? 'Cập nhật phân tích'
                : 'Phân tích ngay'}
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

              <button
                type="button"
                className="hl-profile-practice-ai-history-button"
                onClick={() => setHistoryOpen(true)}
              >
                Xem lại phân tích cũ
              </button>
            </>
          ) : null}
        </>
      ) : (
        <TeacherFeedbackPanel feedbackList={teacherFeedback} onOpenDetail={setFeedbackDetail} />
      )}

      {activeAnalysis && activeSource === 'ai' && (
        <>
          <PracticeAiDetailModal
            analysis={activeAnalysis}
            isOpen={detailOpen}
            onClose={() => setDetailOpen(false)}
          />
          <PracticeAiHistoryModal
            analysis={activeAnalysis}
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
          />
        </>
      )}
      <TeacherFeedbackDetailModal
        feedback={feedbackDetail}
        isOpen={Boolean(feedbackDetail)}
        onClose={() => setFeedbackDetail(null)}
      />
    </article>
  )
}

function PracticeTab({ onAction, panelId, labelledBy }) {
  const [filter, setFilter] = useState('Tất cả')
  const [selectedComponents, setSelectedComponents] = useState(() =>
    learningProfilePage.components.map((item) => item.key)
  )
  const attempts = useMemo(() => {
    if (filter === 'Tất cả') return learningProfilePage.practiceAttempts
    return learningProfilePage.practiceAttempts.filter((item) => item.type === filter)
  }, [filter])
  const componentPoints = attempts.map((attempt) => ({
    label: attempt.label,
    score: Math.round(
      selectedComponents.reduce((sum, key) => sum + (attempt.components[key] || 0), 0) /
        Math.max(1, selectedComponents.length)
    ),
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
    setSelectedComponents((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    )
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
          toolbar={
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
          }
        />

        <ScoreChart
          title="Kết quả theo thành phần"
          points={componentPoints}
          series={componentSeries}
          target={230}
          max={300}
          componentMode
          filterLabel={null}
          toolbar={
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
          }
        />
      </section>

      <section>
        <ProfileSectionHeading title="Hiệu suất luyện đề" />
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

export default PracticeTab
