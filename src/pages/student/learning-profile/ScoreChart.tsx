import type { ReactNode } from 'react'
import { ProfileSectionHeading } from './shared'

interface ScorePoint {
  label: string
  score: number
}

interface ScoreSeries {
  key: string
  label: string
  color: string
  points: ScorePoint[]
}

interface ScoreChartProps {
  title: ReactNode
  subtitle?: ReactNode
  points: ScorePoint[]
  series?: ScoreSeries[]
  target?: number
  max?: number
  componentMode?: boolean
  toolbar?: ReactNode
  filterLabel?: string | null
}

function ScoreChart({
  title,
  subtitle,
  points,
  series,
  target = 900,
  max = 1200,
  componentMode = false,
  toolbar,
  filterLabel = 'Tất cả',
}: ScoreChartProps) {
  const chartWidth = 640
  const chartHeight = 220
  const padding = { top: 24, right: 26, bottom: 30, left: 48 }
  const usableWidth = chartWidth - padding.left - padding.right
  const usableHeight = chartHeight - padding.top - padding.bottom
  const chartSeries = series?.length
    ? series
    : [
        {
          key: 'score',
          label: componentMode ? 'Điểm thành phần' : 'Điểm ĐGNL',
          color: 'var(--color-primary)',
          points,
        },
      ]
  const axisPoints = chartSeries[0]?.points || points || []
  const axisLevels =
    max === 1200
      ? [1200, 900, 600, 300, 0]
      : [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0]
  const toPoint = (item, index, list = axisPoints) => {
    const x =
      padding.left +
      (list.length === 1 ? usableWidth / 2 : (index / Math.max(1, list.length - 1)) * usableWidth)
    const y = padding.top + usableHeight - (item.score / max) * usableHeight
    return `${x},${y}`
  }
  const polyline = axisPoints.map((item, index) => toPoint(item, index)).join(' ')
  const targetY = padding.top + usableHeight - (target / max) * usableHeight
  const latest = axisPoints[axisPoints.length - 1]
  const latestCoordinates = latest
    ? toPoint(latest, axisPoints.length - 1)
        .split(',')
        .map(Number)
    : [0, 0]

  return (
    <article className="hl-profile-card hl-profile-chart-card">
      <div className="hl-profile-chart-head">
        <ProfileSectionHeading title={title} subtitle={subtitle} />
        {filterLabel && <span>{filterLabel}</span>}
      </div>
      {toolbar}
      <div className="hl-profile-chart-wrap">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={String(title)}>
          {axisLevels.map((level) => {
            const y = padding.top + usableHeight - (level / max) * usableHeight
            return (
              <g key={level}>
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="hl-profile-axis-label"
                >
                  {level}
                </text>
                <line
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={y}
                  y2={y}
                  className="hl-profile-grid-line"
                />
              </g>
            )
          })}
          <line
            x1={padding.left}
            x2={padding.left}
            y1={padding.top}
            y2={padding.top + usableHeight}
            className="hl-profile-axis-line"
          />
          <line
            x1={padding.left}
            x2={chartWidth - padding.right}
            y1={targetY}
            y2={targetY}
            className="hl-profile-target-line"
          />
          <text
            x={chartWidth - padding.right}
            y={targetY - 6}
            textAnchor="end"
            className="hl-profile-chart-label"
          >
            Mục tiêu {target}
          </text>
          {series?.length ? (
            chartSeries.map((entry) => (
              <g key={entry.key}>
                <polyline
                  points={entry.points
                    .map((item, index) => toPoint(item, index, entry.points))
                    .join(' ')}
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
            ))
          ) : (
            <polyline
              points={polyline}
              className={componentMode ? 'hl-profile-line is-component' : 'hl-profile-line'}
            />
          )}
          {axisPoints.map((item, index) => {
            const [x, y] = toPoint(item, index).split(',').map(Number)
            return (
              <g key={`${item.label}-${index}`}>
                {!series?.length && <circle cx={x} cy={y} r="4.5" className="hl-profile-point" />}
                <text
                  x={x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  className="hl-profile-chart-label"
                >
                  {item.label}
                </text>
              </g>
            )
          })}
          {latest && !componentMode && (
            <g className="hl-profile-chart-tooltip">
              <rect
                x={Math.min(chartWidth - 118, latestCoordinates[0] - 36)}
                y={latestCoordinates[1] - 54}
                width="92"
                height="42"
                rx="10"
              />
              <text
                x={Math.min(chartWidth - 72, latestCoordinates[0] + 10)}
                y={latestCoordinates[1] - 34}
                textAnchor="middle"
              >
                {latest.score} điểm
              </text>
              <text
                x={Math.min(chartWidth - 72, latestCoordinates[0] + 10)}
                y={latestCoordinates[1] - 18}
                textAnchor="middle"
              >
                {latest.label}
              </text>
            </g>
          )}
        </svg>
      </div>
      <div className="hl-profile-chart-legend">
        {series?.length ? (
          chartSeries.map((entry) => (
            <span key={entry.key}>
              <i style={{ background: entry.color }} /> {entry.label}
            </span>
          ))
        ) : (
          <span>
            <i /> {chartSeries[0]?.label || 'Điểm ĐGNL'}
          </span>
        )}
        {!componentMode && (
          <span>
            <i /> Mục tiêu
          </span>
        )}
      </div>
    </article>
  )
}

export default ScoreChart
