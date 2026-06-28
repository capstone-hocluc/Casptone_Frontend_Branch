import { useEffect, useRef, useState } from 'react'

function botReply(msg) {
  const m = msg.toLowerCase()
  if (m.includes('điểm') || m.includes('tính'))
    return 'Điểm ĐGNL được quy đổi theo thang riêng của từng trường. Trên HocLuc, sau mỗi bài thi bạn nhận điểm từng phần kèm phân tích chi tiết điểm mạnh/yếu.'
  if (m.includes('lộ trình') || m.includes('4 tuần') || m.includes('ôn'))
    return 'Gợi ý lộ trình 4 tuần: tuần 1 kiểm tra đầu vào, tuần 2–3 luyện theo môn yếu, tuần 4 thi thử đề mẫu. Bạn muốn mình lên lộ trình theo môn nào?'
  if (m.includes('gói') || m.includes('giá') || m.includes('phù hợp'))
    return 'Nếu bạn cần livestream + chấm bài OCR thì gói Học viên là hợp lý nhất. Muốn được kèm 1·1 thì chọn gói Toàn diện nhé!'
  if (m.includes('mentor') || m.includes('chấm') || m.includes('tự luận'))
    return 'Đội ngũ mentor sẽ chấm bài tự luận và giải đáp kiến thức trong vòng 24 giờ. Bạn đặt lịch ở mục Học tập → Mentor 1·1 nhé.'
  if (m.includes('chào') || m.includes('hi') || m.includes('hello'))
    return 'Chào bạn! Mình có thể giúp gì cho hành trình ôn thi của bạn?'
  return 'Cảm ơn câu hỏi của bạn! Bạn có thể thử hỏi về cách tính điểm, lộ trình ôn luyện, livestream, mentor hoặc các gói học nhé.'
}

const suggestions = ['Cách tính điểm ĐGNL?', 'Lộ trình ôn 4 tuần', 'Gói nào phù hợp em?']

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [chat, setChat] = useState([
    { role: 'bot', text: 'Chào bạn! Mình là trợ lý AI của HocLuc. Hỏi mình bất cứ điều gì về kỳ thi, lộ trình ôn luyện hay các gói học nhé!' },
  ])
  const bodyRef = useRef(null)

  useEffect(() => {
    const b = bodyRef.current
    if (b) b.scrollTop = b.scrollHeight
  }, [chat, open])

  const send = (text) => {
    const msg = (text != null ? text : input).trim()
    if (!msg) return
    setChat((c) => [...c, { role: 'user', text: msg }])
    setInput('')
    setTimeout(() => setChat((c) => [...c, { role: 'bot', text: botReply(msg) }]), 650)
  }

  return (
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {open && (
        <div style={{ width: 360, maxWidth: 'calc(100vw - 32px)', height: 480, maxHeight: 'calc(100vh - 130px)', background: '#fff', borderRadius: 22, boxShadow: '0 30px 70px -18px rgba(17,24,58,.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #E4E9F5', animation: 'hl-cardin .3s both', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', background: 'linear-gradient(120deg,#1230A6,#1B4DE4)', color: '#fff' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.18)', display: 'grid', placeItems: 'center', fontSize: 15, fontWeight: 800, letterSpacing: '.5px' }}>AI</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>Trợ lý AI HocLuc</div>
              <div style={{ fontSize: 12, opacity: .9, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#46E08A' }} />Đang hoạt động
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.16)', color: '#fff', width: 32, height: 32, borderRadius: '50%', fontSize: 15, flexShrink: 0 }}>✕</button>
          </div>

          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, background: '#F7F9FF' }}>
            {chat.map((c, i) => (
              <div key={i} style={{ alignSelf: c.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', background: c.role === 'user' ? 'linear-gradient(180deg,#1B4DE4,#2C63F0)' : '#fff', color: c.role === 'user' ? '#fff' : '#2A3354', padding: '11px 15px', borderRadius: 16, fontSize: 14, lineHeight: 1.5, boxShadow: '0 4px 12px rgba(17,24,58,.06)' }}>
                {c.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 14px', borderTop: '1px solid #EEF1F8', background: '#fff' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {suggestions.map((sg) => (
                <button key={sg} onClick={() => send(sg)} className="hl-sg" style={{ cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#1B4DE4', background: '#EEF3FF', border: '1px solid #D9E3FB', borderRadius: 30, padding: '7px 12px' }}>{sg}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send() }} style={{ display: 'flex', gap: 8 }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Hỏi trợ lý AI..." className="hl-input" style={{ flex: 1, fontFamily: 'inherit', fontSize: 14, padding: '12px 16px', borderRadius: 30, border: '1px solid #E4E9F5', background: '#F7F9FF', outline: 'none' }} />
              <button type="submit" style={{ border: 'none', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(180deg,#1B4DE4,#2C63F0)', color: '#fff', fontSize: 16, flexShrink: 0 }}>➤</button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: 'linear-gradient(135deg,#1B4DE4,#2C63F0)', color: '#fff', fontWeight: 800, fontSize: 14, padding: '13px 22px 13px 14px', borderRadius: 40, boxShadow: '0 16px 34px -10px rgba(27,77,228,.6)', animation: 'hl-pulse 3s infinite' }}>
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, letterSpacing: '.5px' }}>AI</span>
        {open ? 'Đóng trợ lý' : 'Hỏi trợ lý AI'}
      </button>
    </div>
  )
}

export default Chatbot
