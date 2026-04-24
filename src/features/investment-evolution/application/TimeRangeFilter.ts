import type { InvestmentPoint } from '../domain/InvestmentPoint';
import type { TimeRange } from '../domain/TimeRange';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Day-count lookup for each bounded `TimeRange`. Values are calendar days,
 * resolved against the LAST point's date — the dataset is historical (2019 in
 * the demo), so filtering against `Date.now()` would always yield an empty
 * slice. Anchoring to the latest point matches user intent ("last N days of my
 * data").
 *
 * Uses an exhaustive `switch` (instead of a record-lookup) to keep the
 * type-narrowing tight and avoid `security/detect-object-injection` false
 * positives on dynamic-key access.
 */
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
