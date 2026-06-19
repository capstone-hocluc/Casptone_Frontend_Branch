function Logo({ className = '', light = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 overflow-hidden ${
          light ? 'border-white bg-transparent' : 'border-[#1254D8] bg-white'
        }`}
      >
        <div className={`w-full h-1/2 ${light ? 'bg-white' : 'bg-[#1254D8]'}`} />
      </div>
      <span
        className={`text-[20px] font-normal tracking-tight leading-none ${
          light ? 'text-white' : 'text-[#111827]'
        }`}
      >
        HocLuc.com
      </span>
    </div>
  )
}

export default Logo
