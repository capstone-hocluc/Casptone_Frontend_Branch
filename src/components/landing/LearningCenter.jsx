import { useState } from 'react'
import { Reveal, ImageSlot } from '../common/motion'
import SectionHeading from '../common/SectionHeading'
import { media } from '../../data/content'

const MODES = [
  { id: 'live', label: 'Livestream' },
  { id: 'video', label: 'Video tự học' },
  { id: 'ocr', label: 'Chấm bài OCR' },
  { id: 'mentor', label: 'Mentor 1·1' },
]

const liveChat = [
  { u: 'Minh Khôi', m: 'Thầy ơi câu 32 dùng công thức nào ạ?' },
  { u: 'Thu Hà', m: 'Phần này thầy giảng dễ hiểu quá ạ' },
  { u: 'Gia Bảo', m: 'Cho em xin lại ví dụ phút trước với ạ' },
  { u: 'Mentor Lan', m: 'Các em ghi chú kỹ bước 2 nhé!' },
]

const bullet = (t) => (
  <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
    <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#1B4DE4,#4C7BFF)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 900 }}>✓</span>
    <span style={{ fontSize: 14, color: '#2A3354', lineHeight: 1.45 }}>{t}</span>
  </div>
)

const ocrRows = [
  ['Câu 1 · Tư duy định lượng', true],
  ['Câu 2 · Tư duy định lượng', true],
  ['Câu 3 · Suy luận logic', false],
  ['Câu 4 · Đọc hiểu', true],
  ['Câu 5 · Đọc hiểu', true],
]

function LearningCenter() {
  const [mode, setMode] = useState('live')
  const [scanned, setScanned] = useState(false)

  return (
    <section id="learn" style={{ scrollMarginTop: 90, padding: '40px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
        <SectionHeading
          title="Học tập đa phương thức"
          banner="Lớp học số toàn diện"
          subtitle="Livestream trực tiếp, kho video tự học, chấm bài bằng OCR và kèm cặp cùng mentor — tất cả trong một nền tảng."
        />

        <Reveal style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 30 }}>
          {MODES.map((m) => {
            const on = m.id === mode
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 14, padding: '13px 24px',
                  borderRadius: 40, transition: 'all .25s',
                  border: `1.5px solid ${on ? '#1B4DE4' : '#E4E9F5'}`,
                  background: on ? 'linear-gradient(180deg,#1B4DE4,#2C63F0)' : '#fff',
                  color: on ? '#fff' : '#2A3354',
                  boxShadow: on ? '0 12px 26px rgba(27,77,228,.35)' : 'none',
                }}
              >
                {m.label}
              </button>
            )
          })}
        </Reveal>

        <Reveal style={{ border: '1.5px solid #E4E9F5', borderRadius: 24, background: 'linear-gradient(180deg,#F8FAFF,#fff)', padding: 24, boxShadow: '0 30px 60px -34px rgba(27,77,228,.5)' }}>
          {/* LIVE */}
          {mode === 'live' && (
            <div className="hl-learn-live" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 22, animation: 'hl-cardin .45s both' }}>
              <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', background: '#0E1530', minHeight: 400 }}>
                <ImageSlot src={media.live} alt="Lớp livestream" style={{ position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(14,21,48,.1),rgba(14,21,48,.78))' }} />
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, background: '#E8324A', color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: '.5px', padding: '7px 13px', borderRadius: 30 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'hl-livedot 1.2s infinite' }} />LIVE
                </div>
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,.5)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '7px 13px', borderRadius: 30 }}>1.248 đang xem</div>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 74, height: 74, borderRadius: '50%', background: 'rgba(255,255,255,.94)', display: 'grid', placeItems: 'center', boxShadow: '0 12px 30px rgba(0,0,0,.35)', animation: 'hl-pulse 2.5s infinite', cursor: 'pointer' }}>
                  <span style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '12px 0 12px 19px', borderColor: 'transparent transparent transparent #1B4DE4', marginLeft: 5 }} />
                </div>
                <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, color: '#fff' }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>Giải đề Tư duy định lượng — Buổi 12</div>
                  <div style={{ fontSize: 13, opacity: .85, marginTop: 3 }}>Thầy Lê Minh · ĐHQG TP.HCM</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #E8ECF7', borderRadius: 16, overflow: 'hidden', background: '#fff', minHeight: 400 }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #EEF1F8', fontWeight: 800, fontSize: 14, color: '#11183A' }}>Trò chuyện trực tiếp</div>
                <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 13 }}>
                  {liveChat.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                      <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1B4DE4,#5B8CFF)' }} />
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 12.5, color: '#1B4DE4' }}>{c.u}</span>
                        <div style={{ fontSize: 13, color: '#2A3354', lineHeight: 1.4 }}>{c.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 14px', borderTop: '1px solid #EEF1F8', display: 'flex', gap: 8 }}>
                  <input placeholder="Nhập câu hỏi..." style={{ flex: 1, fontFamily: 'inherit', fontSize: 13, padding: '10px 14px', borderRadius: 30, border: '1px solid #E4E9F5', background: '#F7F9FF', outline: 'none' }} />
                  <button style={{ border: 'none', cursor: 'pointer', width: 38, height: 38, borderRadius: '50%', background: '#1B4DE4', color: '#fff', fontSize: 14, flexShrink: 0 }}>➤</button>
                </div>
              </div>
            </div>
          )}

          {/* VIDEO */}
          {mode === 'video' && (
            <div className="hl-learn-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 36, alignItems: 'center', animation: 'hl-cardin .45s both' }}>
              <div>
                <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 900, color: '#11183A' }}>Kho video tự học theo lộ trình</h3>
                <p style={{ margin: '0 0 22px', fontSize: 14.5, color: '#5B647F', lineHeight: 1.6 }}>
                  Hơn 500 video bài giảng được sắp xếp theo từng chủ đề và mức độ. Học mọi lúc, tự điều chỉnh tốc độ và theo dõi tiến độ hoàn thành của riêng bạn.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 26 }}>
                  {bullet('Bài giảng chia nhỏ theo từng kỹ năng')}
                  {bullet('Tự động lưu tiến độ, học tiếp từ chỗ đang dừng')}
                  {bullet('Phụ đề và ghi chú theo từng phút')}
                  {bullet('Tải tài liệu đính kèm mỗi bài học')}
                </div>
                <button className="hl-bb" style={{ cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 14, letterSpacing: '.4px', textTransform: 'uppercase', color: '#fff', background: 'linear-gradient(180deg,#1B4DE4,#2C63F0)', border: 'none', borderRadius: 40, padding: '13px 28px', boxShadow: '0 12px 26px rgba(27,77,228,.4)' }}>
                  Khám phá kho video
                </button>
              </div>
              <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', background: '#0E1530', minHeight: 340 }}>
                <ImageSlot src={media.video} alt="Bài giảng video" style={{ position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(14,21,48,.1),rgba(14,21,48,.72))' }} />
                <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 8 }}>18:24</div>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,.94)', display: 'grid', placeItems: 'center', boxShadow: '0 12px 30px rgba(0,0,0,.35)', animation: 'hl-pulse 2.5s infinite', cursor: 'pointer' }}>
                  <span style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '11px 0 11px 18px', borderColor: 'transparent transparent transparent #1B4DE4', marginLeft: 5 }} />
                </div>
                <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, color: '#fff' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Tư duy định lượng — Tỉ lệ &amp; phần trăm</div>
                  <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '72%', background: '#FBC34F', borderRadius: 6 }} />
                  </div>
                  <div style={{ fontSize: 12, opacity: .85, marginTop: 6 }}>Đã xem 72%</div>
                </div>
              </div>
            </div>
          )}

          {/* OCR */}
          {mode === 'ocr' && (
            <div className="hl-learn-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch', animation: 'hl-cardin .45s both' }}>
              <div style={{ position: 'relative', border: '1.5px dashed #B9C6EE', borderRadius: 18, background: '#F7F9FF', minHeight: 380, overflow: 'hidden' }}>
                <ImageSlot src={media.ocr} alt="Bài làm của học sinh" style={{ position: 'absolute', inset: 0 }} />
                {!scanned && (
                  <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,#1B4DE4,transparent)', boxShadow: '0 0 16px 2px #1B4DE4', animation: 'hl-scan 1.6s ease-in-out infinite' }} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 900, color: '#11183A' }}>Chấm bài tự động bằng OCR</h3>
                <p style={{ margin: '0 0 16px', fontSize: 14, color: '#5B647F', lineHeight: 1.55 }}>
                  Chụp hoặc tải ảnh bài làm — AI nhận dạng chữ viết tay, đối chiếu đáp án và chấm điểm tức thì.
                </p>
                <button onClick={() => setScanned((s) => !s)} className="hl-bb" style={{ alignSelf: 'flex-start', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 14, color: '#fff', background: 'linear-gradient(180deg,#1B4DE4,#2C63F0)', border: 'none', padding: '13px 26px', borderRadius: 40, boxShadow: '0 12px 26px rgba(27,77,228,.4)', marginBottom: 18 }}>
                  {scanned ? 'Quét lại bài' : 'Quét & chấm bài'}
                </button>
                <div style={{ border: '1px solid #E8ECF7', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#F7F9FF', borderBottom: '1px solid #EEF1F8' }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#11183A' }}>Kết quả chấm</span>
                    <span style={{ fontWeight: 900, fontSize: 18, color: scanned ? '#1B8A5B' : '#C2C8DA' }}>{scanned ? '8.0 / 10' : '— / 10'}</span>
                  </div>
                  <div style={{ padding: '4px 0' }}>
                    {ocrRows.map(([q, ok], i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 18px' }}>
                        <span style={{ fontSize: 13.5, color: '#2A3354' }}>{q}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: scanned ? (ok ? '#1B8A5B' : '#E8324A') : '#C2C8DA' }}>
                          {scanned ? (ok ? '✓ Đúng' : '✕ Sai') : '• Chờ quét'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MENTOR */}
          {mode === 'mentor' && (
            <div className="hl-learn-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 36, alignItems: 'center', animation: 'hl-cardin .45s both' }}>
              <div>
                <h3 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 900, color: '#11183A' }}>Kèm cặp 1·1 cùng mentor</h3>
                <p style={{ margin: '0 0 22px', fontSize: 14.5, color: '#5B647F', lineHeight: 1.6 }}>
                  Đội ngũ mentor là giáo viên và thủ khoa đồng hành cùng bạn: chấm bài tự luận, giải đáp kiến thức và xây dựng lộ trình ôn luyện riêng theo điểm yếu của từng học sinh.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 26 }}>
                  {bullet('Chấm bài tự luận, nhận xét chi tiết trong 24 giờ')}
                  {bullet('Giải đáp kiến thức 1·1 qua video call')}
                  {bullet('Lộ trình ôn luyện cá nhân hóa theo điểm yếu')}
                  {bullet('Theo sát tiến độ và động viên mỗi tuần')}
                </div>
                <button className="hl-bb" style={{ cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 14, letterSpacing: '.4px', textTransform: 'uppercase', color: '#fff', background: 'linear-gradient(180deg,#1B4DE4,#2C63F0)', border: 'none', borderRadius: 40, padding: '13px 28px', boxShadow: '0 12px 26px rgba(27,77,228,.4)' }}>
                  Đặt lịch với mentor
                </button>
              </div>
              <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', minHeight: 340, background: '#E7EDFB' }}>
                <ImageSlot src={media.mentorSession} alt="Buổi học cùng mentor" style={{ position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, background: 'rgba(255,255,255,.96)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 16px 34px -16px rgba(17,24,58,.4)' }}>
                  <span style={{ width: 48, height: 48, flexShrink: 0, borderRadius: '50%', overflow: 'hidden' }}>
                    <ImageSlot src={media.mentorCard} alt="Mentor" circle />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: '#11183A' }}>Thầy Lê Minh</div>
                    <div style={{ fontSize: 12.5, color: '#5B647F' }}>Tư duy định lượng · <span style={{ color: '#F4A93C' }}>★</span> 4.9</div>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: '#fff', background: 'linear-gradient(180deg,#1B4DE4,#2C63F0)', padding: '8px 14px', borderRadius: 30, cursor: 'pointer' }}>Đặt lịch</span>
                </div>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default LearningCenter
