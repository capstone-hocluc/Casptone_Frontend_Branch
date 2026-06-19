import { Check } from 'lucide-react'
import { features } from '../data/content'
import SectionHeading from './SectionHeading'

function Features() {
  return (
    <section id="about" className="py-20 grid-bg">
      <div className="max-w-[1200px] mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
        <div className="border-2 border-[#1254D8] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=650&fit=crop"
            alt="Học viên đang học nhóm"
            className="w-full h-[420px] object-cover"
          />
        </div>

        <div>
          <SectionHeading
            title="Tính năng"
            banner="Tại sao chọn chúng tôi"
            subtitle="Giải pháp ôn thi đánh giá năng lực toàn diện, phục vụ mọi lĩnh vực và mọi vùng miền tại Việt Nam."
            align="left"
          />

          <ul className="space-y-4">
            {features.map((item) => (
              <li key={item.title} className="flex gap-3 border-l-4 border-[#fcbf56] pl-4">
                <div className="shrink-0 w-6 h-6 bg-[#1254D8] flex items-center justify-center mt-0.5">
                  <Check size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[15px] font-normal text-[#111827] uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#4b5563] leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Features
