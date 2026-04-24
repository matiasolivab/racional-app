'use client';

import { useEffect, useState } from 'react';

import { InvestmentEvolutionService } from '@/features/investment-evolution/application/InvestmentEvolutionService';
import { FirestoreInvestmentEvolutionRepository } from '@/features/investment-evolution/infrastructure/FirestoreInvestmentEvolutionRepository';
import { FirebaseClient } from '@/shared/infrastructure/firebase/FirebaseClient';

import type { InvestmentPoint } from '../../domain/InvestmentPoint';

type Status = 'loading' | 'ready' | 'error';

export type UseInvestmentEvolutionResult = {
  readonly points: readonly InvestmentPoint[];
  readonly status: Status;
  readonly error: Error | null;
  /**
   * Wall-clock timestamp of the most recent snapshot (or `null` while loading).
   *
   * Distinct from `new Date()` inside the render body because it's stored in
   * state — consumers (e.g. `LiveIndicator`) can diff it across renders to
   * detect fresh snapshots even when the `points` reference happens to stay
   * equal (unlikely in practice, but cheaper and more explicit than a ref-eq
   * check on `points`).
   */
  readonly lastSnapshotAt: Date | null;
};

/**
 * Retry protocol: the hook deliberately does NOT expose a `retry` function.
 * Per design §"Error Handling Flow", the consumer (`PortfolioPage`) triggers
 * a retry by bumping a `key` prop, which remounts this hook from scratch.
 */
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
