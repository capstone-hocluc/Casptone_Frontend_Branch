import { ArrowUpRight } from 'lucide-react'
import Sparkles from './Sparkles'

function Hero() {
  return (
    <section id="home" className="grid-bg relative overflow-hidden">
      <Sparkles className="absolute top-16 right-8 lg:right-24 opacity-80 pointer-events-none hidden sm:block" />

      <div className="max-w-[1240px] mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <span className="section-banner">#1 Nền tảng ôn thi đánh giá năng lực 2026</span>

          <h1 className="section-title mt-5 max-w-[560px]">
            Khám Phá Năng Lực Thật Sự Của Bạn
          </h1>

          <p className="mt-4 text-[15px] leading-relaxed text-[#111827] max-w-[480px]">
            Ôn thi đánh giá năng lực toàn diện trên mọi lĩnh vực và mọi miền tại Việt Nam.
          </p>

          <div className="mt-8 flex items-center gap-2">
            <a href="#exams" className="btn-flat h-12 px-8">
              Bắt đầu ngay
            </a>
            <a href="#exams" aria-label="Bắt đầu ngay" className="btn-flat btn-flat-icon">
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </a>
          </div>
        </div>

        <div className="w-full max-w-[520px] lg:max-w-none mx-auto lg:mx-0 lg:ml-auto">
          <img
            src="/Amy.jpg"
            alt="Thí sinh"
            width={1105}
            height={1423}
            className="w-full h-auto block border-2 border-[#1254D8]"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
