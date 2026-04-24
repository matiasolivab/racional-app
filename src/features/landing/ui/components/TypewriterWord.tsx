'use client';

import { useEffect, useState } from 'react';

type TypewriterPhase = 'typing' | 'holding' | 'erasing' | 'pausing';

type TypewriterWordProps = {
  readonly words: readonly string[];
  readonly typingMs?: number;
  readonly holdingMs?: number;
  readonly erasingMs?: number;
  readonly pauseMs?: number;
};

export function TypewriterWord(props: TypewriterWordProps) {
  const { words, typingMs = 90, holdingMs = 2000, erasingMs = 45, pauseMs = 250 } = props;

  const [wordIndex, setWordIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  // `.at()` avoids the `security/detect-object-injection` false positive on `words[wordIndex]`.
  // Also `string | undefined` under noUncheckedIndexedAccess, hence `?? ''`.
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

    // phase === 'pausing'
    const id = globalThis.setTimeout(() => {
      setWordIndex((index) => (index + 1) % words.length);
      setPhase('typing');
    }, pauseMs);
    return () => globalThis.clearTimeout(id);
  }, [phase, visibleChars, currentWord, words, typingMs, holdingMs, erasingMs, pauseMs]);

  if (words.length === 0) return null;

  const visibleText = currentWord.slice(0, visibleChars);
  // Announce the full word once it is fully typed, avoids streaming each char to SR.
  const announced = phase === 'holding' ? currentWord : '';

  return (
    <span className="inline-flex items-baseline">
      <span aria-hidden="true">{visibleText}</span>
      <span
        aria-hidden="true"
        className="text-accent-mint ml-1 inline-block font-light"
        style={{ animation: 'typewriter-cursor-blink 1.2s steps(1) infinite' }}
      >
        |
      </span>
      <span className="sr-only" aria-live="polite">
        {announced}
      </span>
    </span>
  );
}
