function Logo({ light = false, monochrome = false, size = 56 }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <img
        src="/logo.png"
        alt="HocLuc.com"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          flexShrink: 0,
          marginTop: Math.round((-6 * size) / 56),
        }}
      />
      <span
        style={{
          fontWeight: 800,
          fontSize: 21,
          letterSpacing: '-.5px',
          color: light || monochrome ? '#fff' : 'var(--color-heading)',
        }}
      >
        HocLuc
        <span style={{ color: monochrome ? '#fff' : light ? 'var(--color-accent)' : 'var(--color-primary)' }}>.com</span>
      </span>
    </span>
  )
}

export default Logo
