import { type DocumentData, type DocumentSnapshot, Timestamp } from 'firebase/firestore';

import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';

type RawPoint = {
  readonly date: unknown;
  readonly portfolioValue: unknown;
  readonly portfolioIndex: unknown;
  readonly dailyReturn: unknown;
  readonly contributions: unknown;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}

function isRawPoint(value: unknown): value is RawPoint {
  return typeof value === 'object' && value !== null;
}

function toInvestmentPoint(raw: unknown): InvestmentPoint | null {
  if (!isRawPoint(raw)) {
    return null;
  }

  const { date, portfolioValue, portfolioIndex, dailyReturn, contributions } = raw;

  if (!isTimestamp(date)) {
    return null;
  }
  if (
    !isFiniteNumber(portfolioValue) ||
    !isFiniteNumber(portfolioIndex) ||
    !isFiniteNumber(dailyReturn) ||
    !isFiniteNumber(contributions)
  ) {
    return null;
  }

  return {
    date: date.toDate(),
    portfolioValue,
    portfolioIndex,
    dailyReturn,
    contributions,
  };
}

export class FirestoreInvestmentPointMapper {
  public static fromSnapshot(snapshot: DocumentSnapshot): readonly InvestmentPoint[] {
    return FirestoreInvestmentPointMapper.fromDocument(snapshot.data());
  }

  private static fromDocument(raw: DocumentData | undefined): readonly InvestmentPoint[] {
    if (raw === undefined) {
      return [];
    }

    const rawArray: unknown = raw.array;
    if (!Array.isArray(rawArray)) {
      return [];
    }

    const points: InvestmentPoint[] = [];
    for (const entry of rawArray) {
      const point = toInvestmentPoint(entry);
      if (point !== null) {
        points.push(point);
      }
    }

    points.sort((a, b) => a.date.getTime() - b.date.getTime());
    return points;
  }
}
