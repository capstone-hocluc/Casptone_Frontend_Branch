function Sparkles({ className = '' }) {
  return (
    <svg
      className={className}
      width="80"
      height="100"
      viewBox="0 0 80 100"
      fill="none"
      aria-hidden="true"
    >
      <path d="M40 0L43 37L80 40L43 43L40 80L37 43L0 40L37 37L40 0Z" fill="#1254D8" />
      <path d="M65 55L67 72L84 74L67 76L65 93L63 76L46 74L63 72L65 55Z" fill="#1254D8" opacity="0.7" />
      <path d="M15 70L16 80L26 81L16 82L15 92L14 82L4 81L14 80L15 70Z" fill="#1254D8" opacity="0.5" />
    </svg>
  )
}

export default Sparkles
