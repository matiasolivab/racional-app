import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';
import type { TimeRange } from '@investment-evolution/domain/TimeRange';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function daysForRange(range: Exclude<TimeRange, 'MAX'>): number {
  switch (range) {
    case '1M': {
      return 30;
    }
    case '3M': {
      return 90;
    }
    case '6M': {
      return 180;
    }
    case '1A': {
      return 365;
    }
  }
}

export class TimeRangeFilter {
  public static filter(points: readonly InvestmentPoint[], range: TimeRange): readonly InvestmentPoint[] {
    if (points.length === 0) {
      return [];
    }

    if (range === 'MAX') {
      return [...points];
    }

    const latest = points.at(-1);
    if (latest === undefined) {
      return [];
    }

    const days = daysForRange(range);
    const cutoff = latest.date.getTime() - days * MILLISECONDS_PER_DAY;
    return points.filter((point) => point.date.getTime() >= cutoff);
  }
}
