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
    const valueDelta = last.portfolioValue - first.portfolioValue;
    const contributionsDelta = last.contributions - first.contributions;
    return valueDelta - contributionsDelta;
  }

  public static variationPercent(points: readonly InvestmentPoint[]): number | null {
    const first = points[0];
    const last = points.at(-1);
    if (first === undefined || last === undefined) {
      return null;
    }
    const gain = last.portfolioValue - first.portfolioValue - (last.contributions - first.contributions);
    const base = first.portfolioValue + (last.contributions - first.contributions);
    if (base === 0) {
      return null;
    }
    return gain / base;
  }

  public static contributions(points: readonly InvestmentPoint[]): number | null {
    const first = points[0];
    const last = points.at(-1);
    if (first === undefined || last === undefined) {
      return null;
    }
    return last.contributions - first.contributions;
  }

  public static lastUpdate(points: readonly InvestmentPoint[]): Date | null {
    const last = points.at(-1);
    return last?.date ?? null;
  }
}
