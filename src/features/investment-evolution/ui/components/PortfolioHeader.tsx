'use client';

import { InvestmentMetrics } from '@investment-evolution/application/InvestmentMetrics';
import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';
import { CurrencyFormatter } from '@shared/ui/format/CurrencyFormatter';
import { DateFormatter } from '@shared/ui/format/DateFormatter';
import { PercentFormatter } from '@shared/ui/format/PercentFormatter';

import { LiveIndicator } from './LiveIndicator';

type PortfolioHeaderProps = {
  readonly points: readonly InvestmentPoint[];
  readonly lastSnapshotAt: Date | null;
};

const currencyFormatter = new CurrencyFormatter({ locale: 'es-CL', currency: 'CLP' });
const percentFormatter = new PercentFormatter({ locale: 'es-CL', maximumFractionDigits: 2 });
const dateFormatter = new DateFormatter({ locale: 'es-CL' });

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
  const { points, lastSnapshotAt } = props;

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
          <dt className="text-fg-muted text-xs font-medium uppercase tracking-wide">Ganancia</dt>
          <dd className={`font-mono text-lg font-semibold md:text-xl ${variationColorClass(variationAbsolute)}`}>
            {variationAbsolute === null ? '—' : formatSignedCurrency(variationAbsolute)}
          </dd>
        </div>

        <div className="border-border bg-bg flex flex-col gap-1 rounded-xl border p-4">
          <dt className="text-fg-muted text-xs font-medium uppercase tracking-wide">Rentabilidad</dt>
          <dd className={`font-mono text-lg font-semibold md:text-xl ${variationColorClass(variationPercent)}`}>
            {variationPercent === null ? '—' : percentFormatter.format(variationPercent)}
          </dd>
        </div>

        <div className="border-border bg-bg col-span-2 flex flex-col gap-1 rounded-xl border p-4 md:col-span-1">
          <dt className="text-fg-muted text-xs font-medium uppercase tracking-wide">Total aportado</dt>
          <dd className="text-fg font-mono text-lg font-semibold md:text-xl">
            {contributions === null ? '—' : currencyFormatter.format(contributions)}
          </dd>
        </div>
      </dl>

      <div className="text-fg-muted flex flex-wrap items-center gap-2 text-xs">
        <span>Actualizado {lastUpdate === null ? '—' : dateFormatter.formatShort(lastUpdate)}</span>
        <LiveIndicator lastSnapshotAt={lastSnapshotAt} />
      </div>
    </section>
  );
}
