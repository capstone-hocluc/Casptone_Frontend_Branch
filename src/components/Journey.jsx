import { journeySteps } from '../data/content'
import SectionHeading from './SectionHeading'
import Sparkles from './Sparkles'

function RoadmapPin({ number }) {
  return (
    <div className="roadmap-pin">
      <span>{number}</span>
    </div>
  )
}

function Journey() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <Sparkles className="absolute top-10 right-6 lg:right-20 pointer-events-none opacity-70" />

      <div className="max-w-[900px] mx-auto px-5">
        <SectionHeading
          title="Lộ trình"
          banner="5 bước đơn giản"
          subtitle="Hành trình ôn thi đánh giá năng lực từ đăng ký đến nhận chứng chỉ."
        />

        <div className="relative mt-4">
          {/* Đường path xanh */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[120px] pointer-events-none hidden md:block"
            viewBox="0 0 120 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M60 0 C60 80 20 120 20 200 C20 280 100 320 100 400 C100 480 40 520 40 600"
              stroke="#1254D8"
              strokeWidth="28"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <div className="md:hidden absolute left-[21px] top-0 bottom-0 w-[4px] bg-[#1254D8]" aria-hidden="true" />

          <div className="space-y-12 md:space-y-16">
            {journeySteps.map((item) => (
              <div
                key={item.step}
                className={`relative flex items-center gap-6 ${
                  item.side === 'right' ? 'md:flex-row-reverse md:text-right' : 'md:flex-row'
                }`}
              >
                <div
                  className={`flex-1 hidden md:block ${
                    item.side === 'right' ? 'pr-8' : 'pl-8'
                  }`}
                >
                  <h3 className="text-[15px] font-normal text-[#111827] uppercase tracking-widest">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#4b5563]">{item.desc}</p>
                </div>

                <div className="relative z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <RoadmapPin number={item.step} />
                </div>

                <div className="flex-1 md:hidden">
                  <h3 className="text-[15px] font-normal text-[#111827] uppercase tracking-widest">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#4b5563]">{item.desc}</p>
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Journey
