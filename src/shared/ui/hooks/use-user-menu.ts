'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type UseUserMenuResult = {
  readonly isOpen: boolean;
  readonly close: () => void;
  readonly toggle: () => void;
  readonly triggerRef: React.RefObject<HTMLButtonElement | null>;
  readonly menuRef: React.RefObject<HTMLDivElement | null>;
};

export function useUserMenu(): UseUserMenuResult {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((previous) => !previous);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      const insideMenu = menuRef.current?.contains(target) ?? false;
      const insideTrigger = triggerRef.current?.contains(target) ?? false;
      if (!insideMenu && !insideTrigger) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  return { isOpen, close, toggle, triggerRef, menuRef };
}
