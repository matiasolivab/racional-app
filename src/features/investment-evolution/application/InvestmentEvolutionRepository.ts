import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';

export type Unsubscribe = () => void;

export interface InvestmentEvolutionRepository {
  subscribe(
    userId: string,
    onUpdate: (points: readonly InvestmentPoint[]) => void,
    onError: (error: Error) => void,
  ): Unsubscribe;
}
