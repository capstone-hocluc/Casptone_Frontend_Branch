import { useState } from 'react'
import { Reveal } from '../common/motion'

function CTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section
      style={{
        position: 'relative',
        padding: '64px 0',
        background: 'linear-gradient(120deg,var(--color-primary-dark),var(--color-primary) 60%,var(--color-brand-bright))',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -40,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,.06)',
          animation: 'hl-blob 9s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: '10%',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'rgba(247,178,59,.14)',
          animation: 'hl-blob 11s ease-in-out infinite',
        }}
      />

      <Reveal
        className="hl-cta"
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 40,
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <div>
          <h2
            style={{
              color: '#fff',
              fontSize: 'clamp(26px,3.4vw,40px)',
              fontWeight: 900,
              margin: '0 0 10px',
              letterSpacing: '-.5px',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            Bắt đầu hành trình
            <br />
            ôn thi đánh giá năng lực
          </h2>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 16, margin: 0 }}>
            Đăng ký nhận tin để cập nhật kỳ thi và lộ trình mới nhất.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
        >
          {submitted ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,.16)',
                color: '#fff',
                fontWeight: 700,
                padding: '16px 26px',
                borderRadius: 40,
                fontSize: 15,
              }}
            >
              ✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hl-input"
                style={{
                  fontFamily: 'inherit',
                  width: 300,
                  maxWidth: '70vw',
                  padding: '16px 22px',
                  borderRadius: 40,
                  border: 'none',
                  background: 'rgba(255,255,255,.16)',
                  color: '#fff',
                  fontSize: 15,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="hl-by"
                style={{
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: 'linear-gradient(180deg,var(--color-accent),var(--color-accent-dark))',
                  color: 'var(--color-primary-dark)',
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: '.6px',
                  textTransform: 'uppercase',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: 40,
                  boxShadow: '0 10px 24px rgba(0,0,0,.2)',
                }}
              >
                Gửi
              </button>
            </>
          )}
        </form>
      </Reveal>
    </section>
  )
}

export default CTA
