export function LandingHeroIllustration() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-md"
      style={{ animation: 'hero-illustration-enter 600ms 150ms ease-out both' }}
    >
      <svg viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full" role="presentation">
        <defs>
          {/* Gradient flows top->bottom: opaque mint at crest, transparent at baseline. */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent-mint)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--color-accent-mint)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Editorial micro-accents, top-left corner of the composition. */}
        <line x1="24" y1="46" x2="64" y2="46" stroke="var(--color-fg)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="78" cy="46" r="2.5" fill="var(--color-fg)" />

        {/* Secondary card — rendered before main card so the tilted main card overlaps it. */}
        <g transform="rotate(6 380 120)">
          <rect
            x="300"
            y="72"
            width="160"
            height="96"
            rx="16"
            fill="var(--color-bg)"
            stroke="var(--color-border)"
            strokeWidth="1.5"
          />
          <text
            x="320"
            y="108"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="20"
            fontWeight="700"
            fill="var(--color-success)"
          >
            +9,12%
          </text>
          {/* Tiny upward sparkline. */}
          <path
            d="M320 146 L340 138 L360 142 L380 128 L400 132 L420 118 L440 122"
            fill="none"
            stroke="var(--color-success)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Main card — subtle left tilt for dynamism. */}
        <g transform="rotate(-3 240 230)">
          <rect
            x="50"
            y="110"
            width="360"
            height="240"
            rx="20"
            fill="var(--color-bg)"
            stroke="var(--color-border)"
            strokeWidth="1.5"
          />

          {/* Label */}
          <text
            x="74"
            y="148"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="11"
            letterSpacing="2"
            fill="var(--color-fg-muted)"
          >
            VALOR ACTUAL
          </text>

          {/* Big number */}
          <text
            x="74"
            y="190"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="28"
            fontWeight="700"
            fill="var(--color-fg)"
          >
            $3.377.856
          </text>

          {/* Area chart — gentle dip then rise, left -> right.
              Path closes down to baseline y=330 for the fill region. */}
          <path
            d="M74 280 C 110 270, 140 296, 176 292 S 242 240, 278 236 S 344 216, 386 206 L 386 330 L 74 330 Z"
            fill="url(#areaGradient)"
          />
          {/* Line drawn on top (no fill), matching the crest of the area path. */}
          <path
            d="M74 280 C 110 270, 140 296, 176 292 S 242 240, 278 236 S 344 216, 386 206"
            fill="none"
            stroke="var(--color-fg)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Footer tick dots */}
          <g fill="var(--color-fg-muted)" fillOpacity="0.4">
            <circle cx="96" cy="334" r="2" />
            <circle cx="168" cy="334" r="2" />
            <circle cx="240" cy="334" r="2" />
            <circle cx="312" cy="334" r="2" />
            <circle cx="384" cy="334" r="2" />
          </g>
        </g>

        {/* Floating accent dot, top-right. */}
        <circle cx="448" cy="56" r="8" fill="var(--color-accent-yellow)" />
      </svg>
    </div>
  );
}
