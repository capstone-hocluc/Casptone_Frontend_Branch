import Logo from './Logo'

const footerLinks = {
  company: {
    title: 'Về chúng tôi',
    links: ['Giới thiệu', 'Tin tức', 'Tuyển dụng', 'Liên hệ'],
  },
  services: {
    title: 'Dịch vụ',
    links: ['Kỳ thi đánh giá năng lực', 'Chứng chỉ', 'Tư vấn lộ trình', 'Doanh nghiệp'],
  },
  support: {
    title: 'Hỗ trợ',
    links: ['Trung tâm trợ giúp', 'Chính sách', 'Điều khoản', 'Bảo mật'],
  },
}

function Footer() {
  return (
    <footer className="bg-[#1254D8] text-white">
      <div className="max-w-[1200px] mx-auto px-5 py-12 border-b-2 border-white/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-normal uppercase tracking-wide">
              Bắt đầu hành trình ôn thi đánh giá năng lực
            </h2>
            <p className="mt-2 text-[14px] text-white/85">
              Đăng ký nhận tin để cập nhật kỳ thi và lộ trình mới nhất.
            </p>
          </div>
          <form className="flex w-full max-w-[420px] gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email của bạn"
              aria-label="Email"
              className="flex-1 h-11 px-4 rounded-full bg-white/10 border-2 border-white/25 text-white placeholder:text-white/50 outline-none focus:border-white"
            />
            <button type="submit" className="btn-flat h-11 px-6 shrink-0">
              Gửi
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Logo light />
          <p className="mt-4 text-[13px] text-white/80 leading-relaxed">
            Nền tảng đánh giá năng lực hàng đầu Việt Nam — phục vụ mọi lĩnh vực, mọi miền đất nước.
          </p>
        </div>

        {Object.values(footerLinks).map((col) => (
          <div key={col.title}>
            <h3 className="text-[13px] font-normal mb-3 uppercase tracking-widest">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] text-white/75 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-5 py-5 border-t-2 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[12px] text-white/70">&copy; 2026 HocLuc.com. Bảo lưu mọi quyền.</p>
        <div className="flex gap-4 text-[12px] text-white/70">
          <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
