import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { faqs } from '../data/content'
import SectionHeading from './SectionHeading'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(1)

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-[760px] mx-auto px-5">
        <SectionHeading
          title="Hỏi đáp"
          banner="Câu hỏi thường gặp"
          subtitle="Giải đáp những thắc mắc phổ biến về đánh giá năng lực."
        />

        <div className="space-y-2 -mt-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.question}
                className={`border-2 ${isOpen ? 'border-[#1254D8] bg-[#1254D8]/5' : 'border-[#1254D8]/25 bg-white'}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left"
                >
                  <span className="text-[14px] font-normal text-[#111827] uppercase tracking-wide">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                      isOpen ? 'bg-[#fcbf56] text-[#111827]' : 'bg-[#1254D8] text-white'
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                {isOpen && (
                  <p className="px-4 pb-4 text-[14px] text-[#4b5563] leading-relaxed border-t-2 border-[#1254D8]/20 pt-3">
                    {item.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
