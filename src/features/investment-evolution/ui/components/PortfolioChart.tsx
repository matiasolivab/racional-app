'use client';

import {
  AreaSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { useEffect, useMemo, useRef, useState } from 'react';

import { CurrencyFormatter } from '@/shared/ui/format/CurrencyFormatter';
import { DateFormatter } from '@/shared/ui/format/DateFormatter';
import { PercentFormatter } from '@/shared/ui/format/PercentFormatter';

import type { InvestmentPoint } from '../../domain/InvestmentPoint';
import type { TimeRange } from '../../domain/TimeRange';

type PortfolioChartProps = {
  readonly points: readonly InvestmentPoint[];
  readonly range: TimeRange;
};

type TooltipState = {
  readonly x: number;
  readonly y: number;
  readonly point: InvestmentPoint;
};

const currencyFormatter = new CurrencyFormatter({ locale: 'es-CL', currency: 'CLP' });
const percentFormatter = new PercentFormatter({ locale: 'es-CL', maximumFractionDigits: 2 });
const dateFormatter = new DateFormatter({ locale: 'es-CL' });

function toUtcTimestamp(date: Date): UTCTimestamp {
  return Math.floor(date.getTime() / 1000) as UTCTimestamp;
}

// lightweight-charts cannot interpret `var(--…)` — resolve tokens at mount via getComputedStyle.
function readCssColor(name: string, fallback: string): string {
  const value = globalThis.getComputedStyle(globalThis.document.documentElement).getPropertyValue(name).trim();
  return value.length > 0 ? value : fallback;
}

export function PortfolioChart(props: PortfolioChartProps) {
  const { points } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const pointsByTime = useMemo(() => {
    const map = new Map<number, InvestmentPoint>();
    for (const point of points) {
      map.set(toUtcTimestamp(point.date), point);
    }
    return map;
  }, [points]);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return;
    }

    const lineColor = readCssColor('--color-chart-line', '#0a0a0a');
    const areaColor = readCssColor('--color-chart-area', 'rgba(10, 10, 10, 0.08)');
    const mutedColor = readCssColor('--color-fg-muted', '#6b7280');
    const borderColor = readCssColor('--color-border', '#e5e7eb');

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { color: 'transparent' },
        textColor: mutedColor,
        fontFamily: 'var(--font-mono), ui-monospace, Menlo, monospace',
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: borderColor, visible: true },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        horzLine: { visible: false, labelVisible: false },
        vertLine: { color: mutedColor, labelVisible: false, width: 1 },
      },
      localization: {
        locale: 'es-CL',
        priceFormatter: (value: number) => currencyFormatter.formatCompact(value),
      },
      // Historical dataset — range selector is the only X-axis control; pan/zoom disabled.
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: areaColor,
      bottomColor: 'rgba(10, 10, 10, 0)',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    series.setData(
      points.map((point) => ({
        time: toUtcTimestamp(point.date),
        value: point.portfolioValue,
      })),
    );

    chart.timeScale().fitContent();

    const handleCrosshairMove = (parameters: MouseEventParams<Time>) => {
      const time = parameters.time;
      const coordinate = parameters.point;
      if (time === undefined || coordinate === undefined) {
        setTooltip(null);
        return;
      }
      const seconds = typeof time === 'number' ? time : Number.NaN;
      if (Number.isNaN(seconds)) {
        setTooltip(null);
        return;
      }
      const point = pointsByTime.get(seconds);
      if (point === undefined) {
        setTooltip(null);
        return;
      }
      const tooltipWidth = 220;
      const margin = 8;
      const maxX = Math.max(margin, container.clientWidth - tooltipWidth - margin);
      const clampedX = Math.min(Math.max(coordinate.x, margin), maxX);
      setTooltip({ x: clampedX, y: coordinate.y, point });
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      setTooltip(null);
    };
  }, [points, pointsByTime]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        role="img"
        aria-label="Gráfico de evolución del portafolio"
        className="h-[300px] w-full md:h-[400px]"
      />
      {tooltip === null ? null : <ChartTooltip tooltip={tooltip} />}
    </div>
  );
}

type ChartTooltipProps = {
  readonly tooltip: TooltipState;
};

function ChartTooltip(props: ChartTooltipProps) {
  const { tooltip } = props;
  const { point } = tooltip;
  const offsetX = 16;
  const offsetY = 16;
  return (
    <div
      role="tooltip"
      style={{ left: tooltip.x + offsetX, top: tooltip.y + offsetY }}
      className="border-border bg-bg text-fg pointer-events-none absolute z-10 flex min-w-[180px] flex-col gap-1 rounded-lg border p-3 text-xs shadow-sm"
    >
      <span className="text-fg-muted font-medium uppercase tracking-wide">{dateFormatter.formatShort(point.date)}</span>
      <span className="font-mono text-sm font-semibold">{currencyFormatter.format(point.portfolioValue)}</span>
      <span className="text-fg-muted font-mono text-[11px]">Índice {point.portfolioIndex.toFixed(2)}</span>
      <span className="text-fg-muted font-mono text-[11px]">
        Retorno diario {percentFormatter.format(point.dailyReturn)}
      </span>
    </div>
  );
}
