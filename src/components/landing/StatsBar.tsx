import { Reveal, Counter } from '../common/motion'
import { stats } from '../../data/content'

function StatsBar() {
  return (
    <section
      style={{
        background: '#fff',
        borderTop: '1px solid #EEF1F8',
        borderBottom: '1px solid #EEF1F8',
      }}
    >
      <div
        className="hl-stats"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '46px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
        }}
      >
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 80}
            style={{
              textAlign: 'center',
              padding: '10px 16px',
              borderRight: i < 3 ? '1px solid #EEF1F8' : 'none',
            }}
          >
            <Counter
              to={s.value}
              suffix={s.suffix}
              style={{
                display: 'block',
                fontSize: 'clamp(34px,3.6vw,48px)',
                fontWeight: 900,
                color: '#1B4DE4',
                letterSpacing: '-1px',
              }}
            />
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                color: '#5B647F',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default StatsBar
