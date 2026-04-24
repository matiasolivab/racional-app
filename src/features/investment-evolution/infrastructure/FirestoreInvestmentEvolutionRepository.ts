import { type Firestore, doc, onSnapshot } from 'firebase/firestore';

import type { InvestmentEvolutionRepository, Unsubscribe } from '../application/InvestmentEvolutionRepository';
import type { InvestmentPoint } from '../domain/InvestmentPoint';

import { FirestoreInvestmentPointMapper } from './FirestoreInvestmentPointMapper';

const COLLECTION_PATH = 'investmentEvolutions';

export class FirestoreInvestmentEvolutionRepository implements InvestmentEvolutionRepository {
  public constructor(
    private readonly firestore: Firestore,
    private readonly mapper: typeof FirestoreInvestmentPointMapper = FirestoreInvestmentPointMapper,
  ) {}

  public subscribe(
    userId: string,
    onUpdate: (points: readonly InvestmentPoint[]) => void,
    onError: (error: Error) => void,
  ): Unsubscribe {
    const reference = doc(this.firestore, COLLECTION_PATH, userId);

    return onSnapshot(
      reference,
      (snapshot) => {
        onUpdate(this.mapper.fromSnapshot(snapshot));
      },
      (error) => {
        onError(error);
      },
    );
  }
}
