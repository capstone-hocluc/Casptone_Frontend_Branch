import Logo from './Logo'
import { footerCols } from '../../data/content'

function Footer() {
  return (
    <footer style={{ background: 'var(--color-primary-dark)', color: '#fff', padding: '60px 0 26px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
        <div
          className="hl-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
            gap: 40,
            paddingBottom: 40,
            borderBottom: '1px solid rgba(255,255,255,.15)',
          }}
        >
          <div>
            <div style={{ marginBottom: 18 }}>
              <Logo light />
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,.75)',
                maxWidth: 300,
                margin: 0,
              }}
            >
              Nền tảng đánh giá năng lực hàng đầu Việt Nam — phục vụ mọi lĩnh vực, mọi miền đất
              nước.
            </p>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  margin: '0 0 18px',
                  color: '#fff',
                }}
              >
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.items.map((it) => (
                  <a
                    key={it}
                    href="#"
                    className="hl-flink"
                    style={{ textDecoration: 'none', color: 'rgba(255,255,255,.75)', fontSize: 14 }}
                  >
                    {it}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
            paddingTop: 24,
          }}
        >
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.65)' }}>
            © 2026 HocLuc.com. Bảo lưu mọi quyền.
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a
              href="#"
              className="hl-fb"
              style={{ textDecoration: 'none', color: 'rgba(255,255,255,.65)', fontSize: 13 }}
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="hl-fb"
              style={{ textDecoration: 'none', color: 'rgba(255,255,255,.65)', fontSize: 13 }}
            >
              Điều khoản dịch vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
