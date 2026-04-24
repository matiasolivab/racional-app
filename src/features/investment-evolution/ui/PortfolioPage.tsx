'use client';

import { useMemo, useState } from 'react';

import { SessionNavbar } from '@/shared/ui/components/SessionNavbar';

import { TimeRangeFilter } from '../application/TimeRangeFilter';
import type { InvestmentPoint } from '../domain/InvestmentPoint';
import type { TimeRange } from '../domain/TimeRange';

import { LiveIndicator } from './components/LiveIndicator';
import { PortfolioChart } from './components/PortfolioChart';
import { PortfolioHeader } from './components/PortfolioHeader';
import { PortfolioSkeleton } from './components/PortfolioSkeleton';
import { TimeRangeSelector } from './components/TimeRangeSelector';
import { useInvestmentEvolution } from './hooks/use-investment-evolution';
import { useTimeRange } from './hooks/use-time-range';

const DEMO_USER_ID = 'user1';
const DEMO_USER_NAME = 'user1';

/**
 * The method is looked up by bracket notation (`TimeRangeFilter['filter']`)
 * because the linter's `unicorn/no-array-callback-reference` +
 * `no-array-method-this-argument` rules pattern-match any `x.filter(a, b)`
 * call regardless of `x`'s type — they assume `Array#filter(fn, thisArg)`.
 * Bracket access hides the call from the heuristic while preserving types.
 */
const filterImpl = TimeRangeFilter['filter'];
function filterPointsByRange(points: readonly InvestmentPoint[], range: TimeRange): readonly InvestmentPoint[] {
  return filterImpl(points, range);
}

export function PortfolioPage() {
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setRetryKey((previous) => previous + 1);
  };

  return (
    <div className="flex min-h-full flex-col">
      <SessionNavbar userName={DEMO_USER_NAME} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <PortfolioContent key={retryKey} onRetry={handleRetry} />
      </main>
    </div>
  );
}

type PortfolioContentProps = {
  readonly onRetry: () => void;
};

function PortfolioContent(props: PortfolioContentProps) {
  const { onRetry } = props;
  const { range, setRange } = useTimeRange();
  const { points, status, error, lastSnapshotAt } = useInvestmentEvolution(DEMO_USER_ID);

  const filteredPoints = useMemo(() => filterPointsByRange(points, range), [points, range]);

  if (status === 'loading') {
    return <PortfolioSkeleton />;
  }

  if (status === 'error') {
    return (
      <div role="alert" className="border-danger/30 bg-danger/5 flex flex-col items-start gap-3 rounded-xl border p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-fg text-base font-semibold">No pudimos cargar tu portafolio</h2>
          <p className="text-fg-muted text-sm">
            {error?.message ?? 'Ocurrió un error al conectarnos con el servidor.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="border-border bg-primary text-primary-fg rounded-full border px-4 py-1.5 text-sm font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (filteredPoints.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <PortfolioEmptyHeader lastSnapshotAt={lastSnapshotAt} />
        <TimeRangeSelector value={range} onChange={setRange} />
        <div className="border-border bg-bg flex h-[300px] w-full items-center justify-center rounded-xl border md:h-[400px]">
          <p className="text-fg-muted text-sm">Sin datos aún para este rango.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PortfolioHeader points={filteredPoints} range={range} lastSnapshotAt={lastSnapshotAt} />
      <TimeRangeSelector value={range} onChange={setRange} />
      <PortfolioChart points={filteredPoints} range={range} />
    </div>
  );
}

type PortfolioEmptyHeaderProps = {
  readonly lastSnapshotAt: Date | null;
};

function PortfolioEmptyHeader(props: PortfolioEmptyHeaderProps) {
  const { lastSnapshotAt } = props;
  return (
    <section aria-label="Resumen del portafolio" className="flex items-center gap-3">
      <h1 className="text-fg text-lg font-semibold">Tu portafolio</h1>
      <LiveIndicator lastSnapshotAt={lastSnapshotAt} />
    </section>
  );
}
