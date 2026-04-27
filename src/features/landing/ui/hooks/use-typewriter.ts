'use client';

import { useEffect, useState } from 'react';

type TypewriterPhase = 'typing' | 'holding' | 'erasing' | 'pausing';

type UseTypewriterOptions = {
  readonly words: readonly string[];
  readonly typingMs?: number;
  readonly holdingMs?: number;
  readonly erasingMs?: number;
  readonly pauseMs?: number;
};

type UseTypewriterResult = {
  readonly visibleText: string;
  readonly announced: string;
};

export function useTypewriter(options: UseTypewriterOptions): UseTypewriterResult {
  const { words, typingMs = 90, holdingMs = 2000, erasingMs = 45, pauseMs = 250 } = options;

  const [wordIndex, setWordIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  const currentWord = words.at(wordIndex) ?? '';

  useEffect(() => {
    if (words.length === 0) return;

    if (phase === 'typing') {
      if (visibleChars < currentWord.length) {
        const id = globalThis.setTimeout(() => setVisibleChars((n) => n + 1), typingMs);
        return () => globalThis.clearTimeout(id);
      }
      const id = globalThis.setTimeout(() => setPhase('holding'), 0);
      return () => globalThis.clearTimeout(id);
    }

    if (phase === 'holding') {
      const id = globalThis.setTimeout(() => setPhase('erasing'), holdingMs);
      return () => globalThis.clearTimeout(id);
    }

    if (phase === 'erasing') {
      if (visibleChars > 0) {
        const id = globalThis.setTimeout(() => setVisibleChars((n) => n - 1), erasingMs);
        return () => globalThis.clearTimeout(id);
      }
      const id = globalThis.setTimeout(() => setPhase('pausing'), 0);
      return () => globalThis.clearTimeout(id);
    }

    const id = globalThis.setTimeout(() => {
      setWordIndex((index) => (index + 1) % words.length);
      setPhase('typing');
    }, pauseMs);
    return () => globalThis.clearTimeout(id);
  }, [phase, visibleChars, currentWord, words, typingMs, holdingMs, erasingMs, pauseMs]);

  const visibleText = currentWord.slice(0, visibleChars);
  const announced = phase === 'holding' ? currentWord : '';

  return { visibleText, announced };
}
