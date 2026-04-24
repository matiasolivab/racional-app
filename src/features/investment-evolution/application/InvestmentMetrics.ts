import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';

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
