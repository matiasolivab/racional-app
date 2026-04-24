import Link from 'next/link';

import { DemoAlertButton } from '@/features/landing/ui/components/DemoAlertButton';

export function LandingNavbar() {
  return (
    <header className="border-border bg-bg sticky top-0 z-40 border-b">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-6"
      >
        <Link
          href="/"
          className="text-fg text-lg font-semibold tracking-tight md:text-xl"
          aria-label="Racional — ir al inicio"
        >
          Racional<span aria-hidden="true">.</span>
        </Link>

        <ul className="text-fg-muted hidden items-center gap-8 text-sm font-medium md:flex">
          <li>
            <span role="link" aria-disabled="true" className="cursor-default select-none">
              Productos
            </span>
          </li>
          <li>
            <span role="link" aria-disabled="true" className="cursor-default select-none">
              Aprende
            </span>
          </li>
          <li>
            <span role="link" aria-disabled="true" className="cursor-default select-none">
              Nosotros
            </span>
          </li>
        </ul>

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
