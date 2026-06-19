import { useState } from 'react'
import { Star } from 'lucide-react'
import { categories, exams } from '../data/content'
import SectionHeading from './SectionHeading'

function ExamsSection() {
  const [active, setActive] = useState('Tất cả')
  const filtered = active === 'Tất cả' ? exams : exams.filter((e) => e.category === active)

  return (
    <section id="exams" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <SectionHeading
          title="Kỳ thi nổi bật"
          banner="Đánh giá năng lực"
          subtitle="Các kỳ thi đánh giá năng lực và tuyển sinh đại học phổ biến tại Việt Nam."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`px-4 py-2 text-[13px] font-normal uppercase tracking-wide border-2 rounded-full transition-colors ${
                active === cat
                  ? 'border-[#1254D8] bg-[#1254D8] text-white'
                  : 'border-[#1254D8]/30 text-[#111827] hover:border-[#1254D8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((exam) => (
            <article key={exam.title} className="card-flat overflow-hidden">
              <div className="relative h-[170px] overflow-hidden border-b-2 border-[#1254D8]">
                <img src={exam.image} alt={exam.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#fcbf56] text-[#111827] text-[11px] uppercase tracking-wide">
                  {exam.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="text-[#fcbf56] fill-[#fcbf56]" />
                    ))}
                  </div>
                  <span className="text-[12px] text-[#111827]">{exam.rating}</span>
                  <span className="text-[12px] text-[#6b7280]">({exam.reviews.toLocaleString()})</span>
                </div>

                <h3 className="text-[15px] font-normal text-[#111827] leading-snug mb-3 uppercase tracking-wide">
                  {exam.title}
                </h3>

                <div className="flex items-center justify-between gap-3 text-[12px] text-[#6b7280]">
                  <span className="truncate">{exam.instructor}</span>
                  <span className="text-[#111827] shrink-0">{exam.price}</span>
                </div>

                <button type="button" className="mt-4 btn-outline w-full h-10">
                  Xem chi tiết
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExamsSection
