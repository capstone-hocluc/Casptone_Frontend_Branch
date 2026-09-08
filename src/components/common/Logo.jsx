function Logo({ light = false }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <img
        src="/logo.png"
        alt="HocLuc.com"
        style={{
          width: 56,
          height: 56,
          objectFit: 'contain',
          flexShrink: 0,
          marginTop: -6,
        }}
      />
      <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: '-.5px', color: light ? '#fff' : '#11183A' }}>
        HocLuc<span style={{ color: light ? '#FBC34F' : '#1B4DE4' }}>.com</span>
      </span>
    </span>
  )
}

export default Logo
