export function PortfolioSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8"
    >
      <span className="sr-only">Cargando portafolio</span>

      <div className="flex flex-col gap-4">
        <div className="bg-border/60 h-6 w-40 animate-pulse rounded-md" aria-hidden="true" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div className="bg-border/40 h-20 animate-pulse rounded-xl" aria-hidden="true" />
          <div className="bg-border/40 h-20 animate-pulse rounded-xl" aria-hidden="true" />
          <div className="bg-border/40 h-20 animate-pulse rounded-xl" aria-hidden="true" />
          <div className="bg-border/40 h-20 animate-pulse rounded-xl" aria-hidden="true" />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="bg-border/40 h-8 w-12 animate-pulse rounded-full" aria-hidden="true" />
        <div className="bg-border/40 h-8 w-12 animate-pulse rounded-full" aria-hidden="true" />
        <div className="bg-border/40 h-8 w-12 animate-pulse rounded-full" aria-hidden="true" />
        <div className="bg-border/40 h-8 w-12 animate-pulse rounded-full" aria-hidden="true" />
        <div className="bg-border/40 h-8 w-14 animate-pulse rounded-full" aria-hidden="true" />
      </div>

      <div className="bg-border/30 h-[300px] w-full animate-pulse rounded-xl md:h-[400px]" aria-hidden="true" />
    </div>
  );
}
