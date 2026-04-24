// Server-rendered: zero JS shipped for the backdrop; grain + single radial are static.
export function LandingBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 20%, color-mix(in oklch, var(--color-accent-mint) 40%, transparent) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          // Grain sits ABOVE the mint glow so the gradient reads as textured, not flat.
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}
