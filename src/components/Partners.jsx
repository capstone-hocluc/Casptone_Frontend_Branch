import { partners } from '../data/content'
import SectionHeading from './SectionHeading'

function Partners() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <SectionHeading
          title="Đối tác"
          banner="Tin cậy trên toàn quốc"
          subtitle="Hợp tác với các trường đại học và tổ chức giáo dục hàng đầu."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {partners.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center h-[64px] px-2 border-2 border-[#1254D8]/30 bg-white"
            >
              <span className="text-[12px] font-normal text-[#111827] text-center uppercase tracking-wide leading-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners
