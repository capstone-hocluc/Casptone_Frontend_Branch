import { mentors } from '../data/content'
import SectionHeading from './SectionHeading'

function Mentors() {
  return (
    <section id="mentors" className="py-20 grid-bg">
      <div className="max-w-[1200px] mx-auto px-5">
        <SectionHeading
          title="Chuyên gia"
          banner="Đội ngũ cố vấn"
          subtitle="Các chuyên gia hàng đầu trong lĩnh vực khảo thí và đánh giá năng lực tại Việt Nam."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {mentors.map((mentor) => (
            <article key={mentor.name} className="card-flat text-center">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-full h-[200px] object-cover border-b-2 border-[#1254D8]"
              />
              <div className="p-3">
                <h3 className="text-[13px] font-normal text-[#111827] leading-snug uppercase tracking-wide">
                  {mentor.name}
                </h3>
                <p className="mt-1 text-[11px] text-[#4b5563]">{mentor.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Mentors
