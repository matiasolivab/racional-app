'use client';

import { useEffect } from 'react';

type PortfolioErrorProps = {
  readonly error: Error & { digest?: string };
  // Next 16 `error.tsx` signature mandates `unstable_retry` — framework-owned identifier.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly unstable_retry: () => void;
};

export default function PortfolioError(props: PortfolioErrorProps) {
  const { error } = props;
  const retry = props.unstable_retry;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="bg-bg text-fg flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <h1 className="text-2xl font-semibold">No pudimos cargar tu portafolio</h1>
      <p className="text-fg-muted max-w-md text-sm">
        Ocurrió un error inesperado al conectarnos con el servidor. Intenta nuevamente o vuelve más tarde.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="border-border bg-primary text-primary-fg rounded-full border px-5 py-2 text-sm font-medium"
      >
        Reintentar
      </button>
    </div>
  );
}
