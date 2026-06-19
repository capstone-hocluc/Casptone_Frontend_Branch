function SectionHeading({ title, banner, subtitle, align = 'center' }) {
  const alignClass =
    align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-3 mb-12 max-w-[720px] ${align === 'center' ? 'mx-auto' : ''} ${alignClass}`}>
      <h2 className="section-title">{title}</h2>
      {banner && <span className="section-banner">{banner}</span>}
      {subtitle && (
        <p className="text-[15px] text-[#111827] leading-relaxed max-w-[560px]">{subtitle}</p>
      )}
    </div>
  )
}

export default SectionHeading
