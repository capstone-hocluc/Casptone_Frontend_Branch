import { Reveal } from '../common/motion'
import SectionHeading from '../common/SectionHeading'
import { partners } from '../../data/content'

function Partners() {
  const loop = [...partners, ...partners]
  return (
    <section style={{ padding: '80px 0 70px', background: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
        <SectionHeading
          title="Đối tác"
          banner="Tin cậy trên toàn quốc"
          subtitle="Hợp tác với các trường đại học và tổ chức giáo dục hàng đầu."
        />
      </div>

      <Reveal
        style={{
          position: 'relative',
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
          maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
        }}
      >
        <div style={{ display: 'flex', gap: 18, width: 'max-content', animation: 'hl-marquee 26s linear infinite' }}>
          {loop.map((p, i) => (
            <div key={i} className="hl-partner" style={{ flexShrink: 0, minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '22px 30px', border: '1.5px solid #E4E9F5', borderRadius: 14, background: '#fff', fontWeight: 800, fontSize: 15, color: '#2A3354', letterSpacing: '.3px' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#1B4DE4', position: 'relative', flexShrink: 0 }}>
                <span style={{ position: 'absolute', left: 4, right: 4, top: '50%', height: 6, transform: 'translateY(-50%)', background: '#fff', borderRadius: 2 }} />
              </span>
              {p}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export default Partners
