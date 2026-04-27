import type {
  InvestmentEvolutionRepository,
  Unsubscribe,
} from '@investment-evolution/application/InvestmentEvolutionRepository';
import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';


const NOOP_ERROR_HANDLER = (): void => {
  /* no-op */
};

export class InvestmentEvolutionService {
  public constructor(private readonly repository: InvestmentEvolutionRepository) {}

  public subscribe(
    userId: string,
    onUpdate: (points: readonly InvestmentPoint[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const errorHandler = onError ?? NOOP_ERROR_HANDLER;
    return this.repository.subscribe(userId, onUpdate, errorHandler);
  }
}
