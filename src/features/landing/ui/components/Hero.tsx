import Link from 'next/link';

import { DemoAlertButton } from '@/features/landing/ui/components/DemoAlertButton';

export function Hero() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <h1 className="text-fg text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          La forma más fácil de
          <br />
          ahorrar e invertir
        </h1>

        <p className="text-fg-muted max-w-xl text-base leading-relaxed md:text-lg">
          Invertí en un portafolio diseñado para vos y mirá su evolución en tiempo real, sin trámites ni letra chica.
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <DemoAlertButton
            ariaLabel="Obtener Stocks gratis (no disponible en la demo)"
            className="bg-accent-mint text-accent-mint-fg focus-visible:outline-primary hover:bg-accent-mint/90 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:text-base"
          >
            Obtener Stocks gratis
          </DemoAlertButton>

          <Link
            href="/portfolio"
            aria-label="Comenzar — ir al portafolio"
            className="bg-primary text-primary-fg focus-visible:outline-primary hover:bg-fg/90 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:text-base"
          >
            Comenzar
          </Link>
        </div>
      </div>
    </section>
  );
}
