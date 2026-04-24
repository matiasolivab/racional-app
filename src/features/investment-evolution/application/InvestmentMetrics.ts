import type { InvestmentPoint } from '../domain/InvestmentPoint';

export class InvestmentMetrics {
  public static currentValue(points: readonly InvestmentPoint[]): number | null {
    const last = points.at(-1);
    return last?.portfolioValue ?? null;
  }

  public static variationAbsolute(points: readonly InvestmentPoint[]): number | null {
    const first = points[0];
    const last = points.at(-1);
    if (first === undefined || last === undefined) {
      return null;
    }
    return last.portfolioValue - first.portfolioValue;
  }

  /**
   * Fractional variation between first and last point (e.g. `0.0912` =
   * `+9.12%`). Returns `null` when:
   *  - `points` is empty, or
   *  - the first point's `portfolioValue` is `0` (division would yield
   *    `Infinity` / `NaN`; the UI treats this as "not computable" rather than
   *    surfacing a misleading percent).
   */
  public static variationPercent(points: readonly InvestmentPoint[]): number | null {
    const first = points[0];
    const last = points.at(-1);
    if (first === undefined || last === undefined) {
      return null;
    }
    if (first.portfolioValue === 0) {
      return null;
    }
    return (last.portfolioValue - first.portfolioValue) / first.portfolioValue;
  }

  public static contributions(points: readonly InvestmentPoint[]): number | null {
    const last = points.at(-1);
    return last?.contributions ?? null;
  }

  public static lastUpdate(points: readonly InvestmentPoint[]): Date | null {
    const last = points.at(-1);
    return last?.date ?? null;
  }
}
