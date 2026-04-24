'use client';

import { useEffect, useRef, useState } from 'react';

type LiveIndicatorProps = {
  readonly lastSnapshotAt: Date | null;
};

const PULSE_DURATION_MS = 600;

export function LiveIndicator(props: LiveIndicatorProps) {
  const { lastSnapshotAt } = props;
  const [isPulsing, setIsPulsing] = useState(false);
  const previousTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastSnapshotAt === null) {
      return;
    }
    const timestamp = lastSnapshotAt.getTime();
    if (previousTimestampRef.current === timestamp) {
      return;
    }
    const isFirstSnapshot = previousTimestampRef.current === null;
    previousTimestampRef.current = timestamp;

    // Skip the pulse on the very first snapshot — the page is already
    // transitioning from skeleton to ready, no need to double-signal.
    if (isFirstSnapshot) {
      return;
    }

    setIsPulsing(true);
    const timer = globalThis.setTimeout(() => {
      setIsPulsing(false);
    }, PULSE_DURATION_MS);

    return () => {
      globalThis.clearTimeout(timer);
    };
  }, [lastSnapshotAt]);

  return (
    <span
      role="status"
      aria-live="polite"
      className="text-fg-muted inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide"
    >
      <span className="sr-only">Actualizado en vivo</span>
      <span
        aria-hidden="true"
        className={`bg-success inline-block size-2 rounded-full transition-transform duration-300 ${
          isPulsing ? 'scale-150 opacity-80' : 'scale-100 opacity-100'
        }`}
      />
      <span aria-hidden="true">live</span>
    </span>
  );
}
