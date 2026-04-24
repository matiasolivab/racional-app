import type { InvestmentPoint } from '../domain/InvestmentPoint';

export type Unsubscribe = () => void;

export type RepositoryStatus = 'loading' | 'ready' | 'error';

export interface InvestmentEvolutionRepository {
  subscribe(
    userId: string,
    onUpdate: (points: readonly InvestmentPoint[]) => void,
    onError: (error: Error) => void,
  ): Unsubscribe;
}
