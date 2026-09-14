import { Reveal } from '../common/motion'
import SectionHeading from '../common/SectionHeading'
import { subjects, sampleExams, mindBranches } from '../../data/content'

const node = (status) =>
  ({
    done: { bg: '#1B4DE4', border: '#1B4DE4', color: '#fff', dot: '#fff' },
    doing: { bg: '#EAF0FF', border: '#1B4DE4', color: '#1B4DE4', dot: '#1B4DE4' },
    todo: { bg: '#F4F6FB', border: '#E0E4EF', color: '#9AA2BC', dot: '#C2C8DA' },
  })[status]

function Subjects() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '90px 0',
        background: '#F6F8FE',
        backgroundImage:
          'linear-gradient(rgba(27,77,228,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,77,228,.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
        <SectionHeading
          title="Ôn tập & Đề thi mẫu"
          banner="Củng cố kiến thức"
          subtitle="Hệ thống ôn tập kiến thức theo từng môn kèm ngân hàng đề thi mẫu bám sát cấu trúc thật."
        />

        <Reveal style={{ textAlign: 'center', marginBottom: 42 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: '#9AA2BC',
              marginBottom: 16,
            }}
          >
            Chọn môn ôn tập
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {subjects.map((s) => (
              <span
                key={s}
                className="hl-chip"
                style={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: '#2A3354',
                  background: '#fff',
                  border: '1.5px solid #E4E9F5',
                  borderRadius: 40,
                  padding: '10px 20px',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Mindmap */}
        <Reveal
          className="hl-mind"
          style={{
            marginBottom: 46,
            background: '#fff',
            border: '1.5px solid #E4E9F5',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 26px 56px -36px rgba(27,77,228,.5)',
            display: 'grid',
            gridTemplateColumns: '.82fr 1.18fr',
            gap: 36,
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: '#1B4DE4',
                marginBottom: 10,
              }}
            >
              Sơ đồ tư duy thông minh
            </div>
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 22,
                fontWeight: 900,
                color: '#11183A',
                lineHeight: 1.25,
              }}
            >
              Mindmap giúp bạn kiểm soát quá trình học
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 14.5, color: '#5B647F', lineHeight: 1.6 }}>
              Mỗi môn được trực quan hóa thành sơ đồ tư duy: bạn thấy rõ đã học gì, phần nào chưa
              nắm và lộ trình tiếp theo — tất cả trong một bức tranh tổng thể.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Theo dõi tiến độ từng chủ đề bằng màu đậm – nhạt',
                'Xem lộ trình học được gợi ý theo điểm yếu',
                'Nhấp vào từng nhánh để mở bài học liên quan',
              ].map((t) => (
                <div key={t} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      background: 'linear-gradient(135deg,#1B4DE4,#4C7BFF)',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: 14, color: '#2A3354', lineHeight: 1.45 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto', padding: 4 }}>
            <div
              style={{
                position: 'relative',
                minWidth: 560,
                backgroundColor: '#FBFCFF',
                backgroundImage: 'radial-gradient(rgba(27,77,228,.12) 1.2px, transparent 1.2px)',
                backgroundSize: '18px 18px',
                border: '1px solid #EAEEF8',
                borderRadius: 18,
                padding: '26px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    position: 'relative',
                    width: 118,
                    height: 118,
                    borderRadius: '50%',
                    background: 'conic-gradient(#FBC34F 0% 62%, #E3E9F6 62% 100%)',
                    padding: 7,
                    flexShrink: 0,
                    boxShadow: '0 16px 34px -16px rgba(27,77,228,.6)',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'linear-gradient(140deg,#1230A6,#1B4DE4)',
                      display: 'grid',
                      placeItems: 'center',
                      textAlign: 'center',
                      color: '#fff',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 21, letterSpacing: '.5px' }}>
                        TOÁN
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                        62% hoàn thành
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    width: 30,
                    height: 3,
                    background: 'linear-gradient(90deg,#1B4DE4,#9BB6FF)',
                  }}
                />
                <div style={{ position: 'relative', flex: 1 }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 33,
                      bottom: 33,
                      width: 3,
                      background: 'linear-gradient(180deg,#9BB6FF,#1B4DE4)',
                      borderRadius: 3,
                    }}
                  />
                  {mindBranches.map((b) => {
                    const n = node(b.status)
                    return (
                      <div
                        key={b.label}
                        style={{ height: 66, display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            width: 26,
                            height: 3,
                            background: '#C7D4F5',
                            borderRadius: 3,
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 9,
                            flexShrink: 0,
                            padding: '10px 15px',
                            borderRadius: 12,
                            fontWeight: 800,
                            fontSize: 13.5,
                            background: n.bg,
                            border: `1.5px solid ${n.border}`,
                            color: n.color,
                            boxShadow: '0 8px 18px -12px rgba(27,77,228,.5)',
                          }}
                        >
                          <span
                            style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot }}
                          />
                          {b.label}
                        </div>
                        <div
                          style={{ flexShrink: 0, width: 14, height: 2, background: '#E0E7F7' }}
                        />
                        <div style={{ display: 'flex', gap: 7 }}>
                          {b.leaves.map(([t, st]) => {
                            const c = node(st)
                            return (
                              <span
                                key={t}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 30,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap',
                                  background: c.bg,
                                  border: `1px solid ${c.border}`,
                                  color: c.color,
                                }}
                              >
                                {t}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div
              style={{ display: 'flex', gap: 18, marginTop: 18, paddingLeft: 4, flexWrap: 'wrap' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 12,
                  color: '#5B647F',
                }}
              >
                <span
                  style={{ width: 12, height: 12, borderRadius: '50%', background: '#1B4DE4' }}
                />
                Đã học
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 12,
                  color: '#5B647F',
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#EAF0FF',
                    border: '1.5px solid #1B4DE4',
                  }}
                />
                Đang học
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  fontSize: 12,
                  color: '#5B647F',
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#F0F1F6',
                    border: '1px solid #E0E4EF',
                  }}
                />
                Chưa học
              </div>
            </div>
          </div>
        </Reveal>

        {/* Sample exams */}
        <Reveal
          className="hl-grid-3"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}
        >
          {sampleExams.map((e) => (
            <div
              key={e.n}
              className="hl-card"
              style={{
                background: '#fff',
                border: '1.5px solid #E4E9F5',
                borderRadius: 18,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: 26,
                    color: '#1B4DE4',
                    letterSpacing: '-.5px',
                  }}
                >
                  {e.n}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.4px',
                    textTransform: 'uppercase',
                    color: '#3a2a05',
                    background: 'linear-gradient(180deg,#FBC34F,#F4A93C)',
                    padding: '6px 13px',
                    borderRadius: 30,
                  }}
                >
                  {e.level}
                </span>
              </div>
              <h3
                style={{
                  margin: '0 0 10px',
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#11183A',
                  lineHeight: 1.3,
                }}
              >
                {e.name}
              </h3>
              <div style={{ fontSize: 13.5, color: '#5B647F', marginBottom: 18 }}>{e.meta}</div>
              <button
                className="hl-bb"
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 800,
                  fontSize: 13.5,
                  letterSpacing: '.4px',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'linear-gradient(180deg,#1B4DE4,#2C63F0)',
                  border: 'none',
                  borderRadius: 40,
                  padding: 13,
                }}
              >
                Làm thử ngay
              </button>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default Subjects
