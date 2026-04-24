import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { LandingHeroIllustration } from '@landing/ui/components/LandingHeroIllustration';
import { TypewriterWord } from '@landing/ui/components/TypewriterWord';

const HERO_TYPEWRITER_WORDS = ['tiempo', 'libertad', 'opciones', 'calma', 'vida'] as const;

export function Hero() {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
          <h1 className="text-fg text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Invierte hoy para
            <br />
            ganar más <TypewriterWord words={HERO_TYPEWRITER_WORDS} />
          </h1>

          <p className="text-fg-muted max-w-xl text-base leading-relaxed md:text-lg">
            Invierte en un portafolio hecho para ti y mira cómo crece en tiempo real. Sin trámites, sin letra chica, sin
            complicaciones.
          </p>

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 md:justify-start">
            <Link
              href="/portfolio"
              aria-label="Ver mi portafolio en vivo"
              className="bg-accent-mint text-accent-mint-fg shadow-accent-mint/40 hover:shadow-accent-mint/60 focus-visible:outline-primary inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 md:text-lg"
            >
              Ver mi portafolio
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>

            <Link
              href="/portfolio"
              aria-label="Comenzar — ir al portafolio"
              className="bg-primary text-primary-fg focus-visible:outline-primary hover:bg-fg/90 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:text-base"
            >
              Comenzar
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <LandingHeroIllustration />
        </div>
      </div>
    </section>
  );
}
