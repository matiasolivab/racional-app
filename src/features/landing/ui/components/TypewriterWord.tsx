'use client';

import { useTypewriter } from '@landing/ui/hooks/use-typewriter';

type TypewriterWordProps = {
  readonly words: readonly string[];
  readonly typingMs?: number;
  readonly holdingMs?: number;
  readonly erasingMs?: number;
  readonly pauseMs?: number;
};

export function TypewriterWord(props: TypewriterWordProps) {
  const { words } = props;
  const { visibleText, announced } = useTypewriter(props);

  if (words.length === 0) return null;

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
