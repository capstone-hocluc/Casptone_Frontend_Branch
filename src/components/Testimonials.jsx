import { Star } from 'lucide-react'
import { testimonials } from '../data/content'
import SectionHeading from './SectionHeading'

function Testimonials() {
  return (
    <section className="py-20 grid-bg">
      <div className="max-w-[1200px] mx-auto px-5">
        <SectionHeading
          title="Phản hồi"
          banner="Thí sinh nói gì"
          subtitle="Phản hồi từ thí sinh trên khắp 63 tỉnh thành Việt Nam."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <article key={item.name} className="card-flat p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#fcbf56] fill-[#fcbf56]" />
                ))}
              </div>
              <p className="text-[14px] text-[#4b5563] leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t-2 border-[#1254D8]/20">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 object-cover border-2 border-[#1254D8]"
                />
                <div>
                  <p className="text-[13px] font-normal text-[#111827] uppercase tracking-wide">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-[#6b7280]">{item.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
