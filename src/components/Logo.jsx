function Logo({ light = false }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <span
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: light ? '#fff' : '#1B4DE4',
          position: 'relative',
          display: 'inline-block',
          flexShrink: 0,
          boxShadow: light ? 'none' : '0 6px 16px rgba(27,77,228,.35)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 6,
            right: 6,
            top: '50%',
            height: 9,
            transform: 'translateY(-50%)',
            background: light ? '#1230A6' : '#fff',
            borderRadius: 2,
          }}
        />
      </span>
      <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: '-.5px', color: light ? '#fff' : '#11183A' }}>
        HocLuc<span style={{ color: light ? '#FBC34F' : '#1B4DE4' }}>.com</span>
      </span>
    </span>
  )
}

export default Logo
