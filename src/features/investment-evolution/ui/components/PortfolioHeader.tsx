'use client';

import { CurrencyFormatter } from '@/shared/ui/format/CurrencyFormatter';
import { type DateGranularity, DateFormatter } from '@/shared/ui/format/DateFormatter';
import { PercentFormatter } from '@/shared/ui/format/PercentFormatter';

import { InvestmentMetrics } from '../../application/InvestmentMetrics';
import type { InvestmentPoint } from '../../domain/InvestmentPoint';
import type { TimeRange } from '../../domain/TimeRange';

import { LiveIndicator } from './LiveIndicator';

type PortfolioHeaderProps = {
  readonly points: readonly InvestmentPoint[];
  readonly range: TimeRange;
  readonly lastSnapshotAt: Date | null;
};

// Instance formatters constructed once per module — `Intl` constructors are
// expensive and the locale/currency is fixed for the Racional demo (CLP, es-CL).
const currencyFormatter = new CurrencyFormatter({ locale: 'es-CL', currency: 'CLP' });
const percentFormatter = new PercentFormatter({ locale: 'es-CL', maximumFractionDigits: 2 });
const dateFormatter = new DateFormatter({ locale: 'es-CL' });

function granularityFor(range: TimeRange): DateGranularity {
  switch (range) {
    case '1M':
    case '3M': {
      return 'day';
    }
    case '6M':
    case '1A': {
      return 'short';
    }
    case 'MAX': {
      return 'month';
    }
  }
}

/**
 * Formats a signed absolute CLP variation with an explicit leading sign so it
 * matches the percent variation's `+` / `−` convention (R-H2). The number's
 * magnitude is rendered with the regular CLP formatter; the sign prefix is
 * prepended manually because `Intl.NumberFormat` with `style: currency` does
 * not support `signDisplay: 'exceptZero'` portably across runtimes.
 */
function formatSignedCurrency(value: number): string {
  if (value === 0) {
    return currencyFormatter.format(0);
  }
  const prefix = value > 0 ? '+' : '−';
  return `${prefix}${currencyFormatter.format(Math.abs(value))}`;
}

function variationColorClass(value: number | null): string {
  if (value === null || value === 0) {
    return 'text-fg';
  }
  return value > 0 ? 'text-success' : 'text-danger';
}

export function PortfolioHeader(props: PortfolioHeaderProps) {
  const { points, range, lastSnapshotAt } = props;

  if (points.length === 0) {
    return (
      <section aria-label="Resumen del portafolio" className="flex flex-col gap-3">
        <p className="text-fg-muted text-sm">Sin datos para mostrar en este rango.</p>
      </section>
    );
  }

  const currentValue = InvestmentMetrics.currentValue(points);
  const variationAbsolute = InvestmentMetrics.variationAbsolute(points);
  const variationPercent = InvestmentMetrics.variationPercent(points);
  const contributions = InvestmentMetrics.contributions(points);
  const lastUpdate = InvestmentMetrics.lastUpdate(points);

  const granularity = granularityFor(range);

  return (
    <section aria-label="Resumen del portafolio" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-fg-muted text-xs font-medium uppercase tracking-wide">Valor actual</span>
        <span className="text-fg font-mono text-3xl font-semibold md:text-4xl">
          {currentValue === null ? '—' : currencyFormatter.format(currentValue)}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <div className="border-border bg-bg flex flex-col gap-1 rounded-xl border p-4">
          <dt className="text-fg-muted text-xs font-medium uppercase tracking-wide">Variación</dt>
          <dd className={`font-mono text-lg font-semibold md:text-xl ${variationColorClass(variationAbsolute)}`}>
            {variationAbsolute === null ? '—' : formatSignedCurrency(variationAbsolute)}
          </dd>
        </div>

        <div className="border-border bg-bg flex flex-col gap-1 rounded-xl border p-4">
          <dt className="text-fg-muted text-xs font-medium uppercase tracking-wide">Variación %</dt>
          <dd className={`font-mono text-lg font-semibold md:text-xl ${variationColorClass(variationPercent)}`}>
            {variationPercent === null ? '—' : percentFormatter.format(variationPercent)}
          </dd>
        </div>

        <div className="border-border bg-bg col-span-2 flex flex-col gap-1 rounded-xl border p-4 md:col-span-1">
          <dt className="text-fg-muted text-xs font-medium uppercase tracking-wide">Aportes acumulados</dt>
          <dd className="text-fg font-mono text-lg font-semibold md:text-xl">
            {contributions === null ? '—' : currencyFormatter.format(contributions)}
          </dd>
        </div>
      </dl>

      <div className="text-fg-muted flex flex-wrap items-center gap-2 text-xs">
        <span>Actualizado {lastUpdate === null ? '—' : dateFormatter.formatRangeAware(lastUpdate, granularity)}</span>
        <LiveIndicator lastSnapshotAt={lastSnapshotAt} />
      </div>
    </section>
  );
}
