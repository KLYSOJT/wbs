const HeroWaveBackground = () => (
  <>
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-52"
      viewBox="0 0 1440 520"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="hero-wave-blur" x="-25%" y="-55%" width="150%" height="210%">
          <feGaussianBlur stdDeviation="48" />
        </filter>
        <filter id="hero-wave-soft-blur" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <linearGradient id="hero-wave-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,238,204,0)" />
          <stop offset="22%" stopColor="rgba(255,238,204,0.22)" />
          <stop offset="52%" stopColor="rgba(255,245,224,0.26)" />
          <stop offset="78%" stopColor="rgba(139,23,23,0.16)" />
          <stop offset="100%" stopColor="rgba(255,238,204,0)" />
        </linearGradient>
      </defs>
      <path
        d="M -120 470 C 150 390 210 215 430 285 S 760 430 980 230 S 1240 60 1560 118"
        fill="none"
        stroke="url(#hero-wave-gradient)"
        strokeWidth="230"
        strokeLinecap="round"
        filter="url(#hero-wave-blur)"
      />
      <path
        d="M -120 470 C 150 390 210 215 430 285 S 760 430 980 230 S 1240 60 1560 118"
        fill="none"
        stroke="rgba(255,248,232,0.06)"
        strokeWidth="92"
        strokeLinecap="round"
        filter="url(#hero-wave-soft-blur)"
      />
    </svg>
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_22%_82%,rgba(255,218,185,0.12),transparent_32%)]"></div>
  </>
);

export default HeroWaveBackground;
