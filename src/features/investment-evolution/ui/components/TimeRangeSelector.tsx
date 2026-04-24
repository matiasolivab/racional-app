'use client';

import { useCallback, useRef } from 'react';

import { TIME_RANGES, type TimeRange } from '../../domain/TimeRange';

type TimeRangeSelectorProps = {
  readonly value: TimeRange;
  readonly onChange: (next: TimeRange) => void;
};

/**
 * Human-facing label for each range. Exhaustive switch keeps the mapping
 * readable while sidestepping the eslint `security/detect-object-injection`
 * false-positive on dynamic record lookups (same pattern as P4's
 * `TimeRangeFilter`).
 */
function labelOf(range: TimeRange): string {
  switch (range) {
    case '1M': {
      return '1M';
    }
    case '3M': {
      return '3M';
    }
    case '6M': {
      return '6M';
    }
    case '1A': {
      return '1A';
    }
    case 'MAX': {
      return 'MAX';
    }
  }
}

export function TimeRangeSelector(props: TimeRangeSelectorProps) {
  const { value, onChange } = props;
  // Keyed by `TimeRange` (union of five string literals) rather than numeric
  // index so we avoid `array[dynamic-index]` writes that trip the
  // `security/detect-object-injection` rule without needing inline disables.
  const buttonRefs = useRef<Map<TimeRange, HTMLButtonElement>>(new Map());

  const focusRange = useCallback((range: TimeRange) => {
    const node = buttonRefs.current.get(range);
    node?.focus();
  }, []);

  const selectByDelta = useCallback(
    (currentIndex: number, delta: number): { readonly range: TimeRange; readonly index: number } | null => {
      const total = TIME_RANGES.length;
      const nextIndex = (((currentIndex + delta) % total) + total) % total;
      const next = TIME_RANGES.at(nextIndex);
      if (next === undefined) {
        return null;
      }
      return { range: next, index: nextIndex };
    },
    [],
  );

  const handleKeyDown = useCallback(
    (currentIndex: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          event.preventDefault();
          const next = selectByDelta(currentIndex, 1);
          if (next !== null) {
            onChange(next.range);
            focusRange(next.range);
          }
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          event.preventDefault();
          const previous = selectByDelta(currentIndex, -1);
          if (previous !== null) {
            onChange(previous.range);
            focusRange(previous.range);
          }
          break;
        }
        case 'Home': {
          event.preventDefault();
          const first = TIME_RANGES.at(0);
          if (first !== undefined) {
            onChange(first);
            focusRange(first);
          }
          break;
        }
        case 'End': {
          event.preventDefault();
          const last = TIME_RANGES.at(-1);
          if (last !== undefined) {
            onChange(last);
            focusRange(last);
          }
          break;
        }
        default: {
          break;
        }
      }
    },
    [onChange, focusRange, selectByDelta],
  );

  const registerButton = (range: TimeRange) => (node: HTMLButtonElement | null) => {
    if (node === null) {
      buttonRefs.current.delete(range);
    } else {
      buttonRefs.current.set(range, node);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Rango de tiempo"
      className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {TIME_RANGES.map((range, index) => {
        const isSelected = range === value;
        const baseClasses =
          'shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
        const stateClasses = isSelected ? 'bg-primary text-primary-fg' : 'text-fg-muted hover:bg-fg/5 hover:text-fg';
        return (
          <button
            key={range}
            ref={registerButton(range)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => {
              onChange(range);
            }}
            onKeyDown={handleKeyDown(index)}
            className={`${baseClasses} ${stateClasses}`}
          >
            {labelOf(range)}
          </button>
        );
      })}
    </div>
  );
}
