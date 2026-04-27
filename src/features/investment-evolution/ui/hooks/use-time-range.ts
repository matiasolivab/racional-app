'use client';

import { useCallback, useState } from 'react';

import type { TimeRange } from '@investment-evolution/domain/TimeRange';

type UseTimeRangeResult = {
  readonly range: TimeRange;
  readonly setRange: (next: TimeRange) => void;
};

export function useTimeRange(initial: TimeRange = 'MAX'): UseTimeRangeResult {
  const [range, setRangeState] = useState<TimeRange>(initial);

  const setRange = useCallback((next: TimeRange) => {
    setRangeState(next);
  }, []);

  return { range, setRange };
}
