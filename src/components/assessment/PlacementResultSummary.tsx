import { TrendingDown, TrendingUp } from 'lucide-react'
import type { PlacementResult } from '../../services/assessmentService'
import { formatDuration, prettifyEnum } from '../../lib/courseFormat'

interface PlacementResultSummaryProps {
  result: PlacementResult
}

function PlacementResultSummary({ result }: PlacementResultSummaryProps) {
  return (
    <>
      <section className="hl-quiz-card hl-quiz-result-summary">
        <span className="hl-quiz-card-eyebrow">Kết quả kiểm tra đầu vào</span>
        <h1>{prettifyEnum(result.level) || 'Chưa xác định'}</h1>
        <div className="hl-quiz-result-row">
          <div className="hl-quiz-result-score">
            <strong>
              {result.correctCount}/{result.totalQuestions}
            </strong>
            <span>câu đúng</span>
          </div>
          <div className="hl-quiz-result-percentage">{result.overallPercentage}%</div>
        </div>

        <div className="hl-placement-stat-row">
          <div className="hl-placement-stat">
            <span>Điểm số</span>
            <strong>{result.score}</strong>
          </div>
          <div className="hl-placement-stat">
            <span>Câu sai</span>
            <strong>{result.wrongCount}</strong>
          </div>
          <div className="hl-placement-stat">
            <span>Thời gian làm bài</span>
            <strong>{formatDuration(result.timeSpentSeconds)}</strong>
          </div>
        </div>

        {(result.strongCategoryName || result.weakCategoryName) && (
          <div className="hl-placement-highlight-row">
            {result.strongCategoryName && (
              <div className="hl-placement-highlight is-strong">
                <TrendingUp size={16} />
                <div>
                  <span>Thế mạnh</span>
                  <strong>{result.strongCategoryName}</strong>
                </div>
              </div>
            )}
            {result.weakCategoryName && (
              <div className="hl-placement-highlight is-weak">
                <TrendingDown size={16} />
                <div>
                  <span>Cần cải thiện</span>
                  <strong>{result.weakCategoryName}</strong>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {result.categories.length > 0 && (
        <section className="hl-quiz-card">
          <h2>Chi tiết theo chủ đề</h2>
          <div className="hl-placement-category-list">
            {result.categories.map((category) => (
              <div className="hl-placement-category-row" key={category.categoryId}>
                <div className="hl-placement-category-head">
                  <span>{category.categoryName}</span>
                  <strong>{category.percentage}%</strong>
                </div>
                <div className="hl-placement-category-bar" aria-hidden="true">
                  <span style={{ width: `${Math.max(0, Math.min(100, category.percentage))}%` }} />
                </div>
                <span className="hl-placement-category-meta">
                  {category.correctCount}/{category.totalCount} câu đúng · {category.score} điểm
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default PlacementResultSummary
