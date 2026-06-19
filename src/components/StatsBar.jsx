import { stats } from '../data/content'

function StatsBar() {
  return (
    <section className="bg-white border-y-2 border-[#1254D8]/20">
      <div className="max-w-[1200px] mx-auto px-5 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x-2 lg:divide-[#1254D8]/20">
          {stats.map((item) => (
            <div key={item.label} className="text-center px-4">
              <p className="text-[clamp(1.8rem,3vw,2.5rem)] font-normal text-[#1254D8] tracking-tight">
                {item.value}
              </p>
              <p className="mt-1 text-[13px] text-[#111827] font-normal uppercase tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar
