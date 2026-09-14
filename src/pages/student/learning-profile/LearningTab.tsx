import { type CSSProperties, useState } from 'react'
import { BookOpen, Brain } from 'lucide-react'
import { learningProfilePage } from '../../../data/learningProfile'
import { componentIcons, learningMetricIcons } from './icons'
import { ComparisonDropdown, ProfileSectionHeading, ProgressLine, TrendBadge } from './shared'

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

function LearningTab({ onAction, panelId, labelledBy }) {
  const [selectedAccuracyPeriod, setSelectedAccuracyPeriod] = useState(
    learningProfilePage.learningAccuracyPeriods[0]
  )
  const totalCourses = learningProfilePage.courseProgress.length
  const completedCourses = learningProfilePage.courseProgress.filter(
    (course) => course.progress >= 100
  ).length
  const activeCourses = learningProfilePage.courseProgress.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length
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
          <ProfileSectionHeading title="Tiến độ khóa học" action="Xem tất cả" onAction={onAction} />
          <div className="hl-profile-course-content">
            <div
              className="hl-profile-donut"
              style={
                {
                  '--hl-profile-progress': `${Math.round((activeCourses / totalCourses) * 100)}%`,
                } as CSSProperties
              }
            >
              <strong>{totalCourses}</strong>
              <span>Tổng khóa học</span>
            </div>
            <div className="hl-profile-course-legend">
              <span>
                <i /> Chưa bắt đầu: {untouchedCourses}
              </span>
              <span>
                <i /> Đang học: {activeCourses}
              </span>
              <span>
                <i /> Hoàn thành: {completedCourses}
              </span>
            </div>
            <div className="hl-profile-course-list">
              <strong>Khóa học gần đây</strong>
              {learningProfilePage.courseProgress.map((course) => (
                <div key={course.name}>
                  <p>
                    <span>{course.name}</span>
                    <b>{course.progress}%</b>
                  </p>
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
          <ProfileSectionHeading
            title="Độ chính xác trung bình"
            subtitle={selectedAccuracyPeriod.comparisonLabel}
          />
          <ComparisonDropdown<(typeof learningProfilePage.learningAccuracyPeriods)[number]>
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
        <ProfileSectionHeading title="Lịch sử học tập" subtitle="Hoạt động trong 30 ngày gần đây" />
        <div className="hl-profile-timeline is-scrollable">
          {learningProfilePage.learningHistory.map((item) => (
            <div key={`${item.date}-${item.title}`}>
              <time>{item.date}</time>
              <span />
              <p>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

export default LearningTab
