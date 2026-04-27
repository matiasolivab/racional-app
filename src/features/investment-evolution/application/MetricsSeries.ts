import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const BASELINE_INDEX = 100;

export class MetricsSeries {
  public static withBaseline(points: readonly InvestmentPoint[]): readonly InvestmentPoint[] {
    const first = points[0];
    if (first === undefined) {
      return points;
    }
    const baseline: InvestmentPoint = {
      date: new Date(first.date.getTime() - MILLISECONDS_PER_DAY),
      portfolioValue: 0,
      portfolioIndex: BASELINE_INDEX,
      dailyReturn: 0,
      contributions: 0,
    };
    return [baseline, ...points];
  }
}
