import Image from 'next/image';
import Link from 'next/link';

import { DemoAlertButton } from '@/features/landing/ui/components/DemoAlertButton';

export function LandingNavbar() {
  return (
    <header className="border-border bg-bg sticky top-0 z-40 border-b">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-6"
      >
        <Link href="/" aria-label="Racional — ir al inicio" className="inline-flex items-center">
          <Image
            src="/racional-logo.svg"
            alt="Racional"
            width={150}
            height={28}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/portfolio"
            aria-label="Ingresar al portafolio"
            className="border-border text-fg focus-visible:outline-primary hover:bg-fg/5 inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Ingresar
          </Link>
          <DemoAlertButton
            ariaLabel="Crear cuenta (no disponible en la demo)"
            className="bg-primary text-primary-fg focus-visible:outline-primary hover:bg-fg/90 inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Crear cuenta
          </DemoAlertButton>
        </div>
      </nav>
    </header>
  );
}
