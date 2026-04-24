'use client';

import { useEffect } from 'react';

type RootErrorProps = {
  readonly error: Error & { digest?: string };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly unstable_retry: () => void;
};

export default function RootError(props: RootErrorProps) {
  const { error } = props;
  const retry = props.unstable_retry;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="bg-bg text-fg flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <h1 className="text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-fg-muted max-w-md text-sm">
        Ocurrió un error inesperado. Intenta nuevamente o vuelve más tarde.
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
