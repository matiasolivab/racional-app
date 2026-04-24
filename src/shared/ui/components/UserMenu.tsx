'use client';

import Link from 'next/link';
import { type Ref, useEffect, useRef } from 'react';

type UserMenuProps = {
  readonly ref?: Ref<HTMLDivElement>;
  readonly userName: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export function UserMenu(props: UserMenuProps) {
  const { ref, userName, isOpen, onClose } = props;
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isOpen) {
      linkRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Opciones de sesión"
      className="border-border bg-bg text-fg fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border p-4 shadow-lg md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-full md:mt-2 md:w-64 md:rounded-xl md:p-2"
    >
      <div className="px-2 pb-2 md:px-3 md:pt-2">
        <p className="text-sm font-semibold">{userName}</p>
        <p className="text-fg-muted text-xs">Sesión demo</p>
      </div>
      <div className="bg-border my-1 h-px" aria-hidden="true" />
      <Link
        ref={linkRef}
        href="/"
        role="menuitem"
        onClick={onClose}
        className="text-fg hover:bg-border/50 focus-visible:bg-border/50 block rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none"
      >
        Cerrar sesión
      </Link>
    </div>
  );
}
