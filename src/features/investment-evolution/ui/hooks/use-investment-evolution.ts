'use client';

import { useEffect, useState } from 'react';

import { InvestmentEvolutionService } from '@investment-evolution/application/InvestmentEvolutionService';
import type { InvestmentPoint } from '@investment-evolution/domain/InvestmentPoint';
import { FirestoreInvestmentEvolutionRepository } from '@investment-evolution/infrastructure/FirestoreInvestmentEvolutionRepository';
import { FirebaseClient } from '@shared/infrastructure/firebase/FirebaseClient';

type Status = 'loading' | 'ready' | 'error';

type UseInvestmentEvolutionResult = {
  readonly points: readonly InvestmentPoint[];
  readonly status: Status;
  readonly error: Error | null;
  readonly lastSnapshotAt: Date | null;
};

export function useInvestmentEvolution(userId: string): UseInvestmentEvolutionResult {
  const [points, setPoints] = useState<readonly InvestmentPoint[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [lastSnapshotAt, setLastSnapshotAt] = useState<Date | null>(null);

  useEffect(() => {
    const firestore = FirebaseClient.getInstance().getFirestore();
    const repository = new FirestoreInvestmentEvolutionRepository(firestore);
    const service = new InvestmentEvolutionService(repository);

    const unsubscribe = service.subscribe(
      userId,
      (next) => {
        setPoints(next);
        setStatus('ready');
        setError(null);
        setLastSnapshotAt(new Date());
      },
      (subscriptionError) => {
        setError(subscriptionError);
        setStatus('error');
      },
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return { points, status, error, lastSnapshotAt };
}
