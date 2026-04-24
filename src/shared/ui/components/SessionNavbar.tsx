'use client';

import Link from 'next/link';

import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { UserMenu } from '@/shared/ui/components/UserMenu';
import { useUserMenu } from '@/shared/ui/hooks/use-user-menu';

type SessionNavbarProps = {
  readonly userName: string;
};

export function SessionNavbar(props: SessionNavbarProps) {
  const { userName } = props;
  const { isOpen, toggle, close, triggerRef, menuRef } = useUserMenu();

  return (
    <header className="border-border bg-bg sticky top-0 z-40 border-b">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6"
      >
        <Link href="/portfolio" className="text-fg text-base font-semibold tracking-tight md:text-lg">
          Racional
        </Link>

        <div className="relative">
          <UserAvatar ref={triggerRef} name={userName} isMenuOpen={isOpen} onActivate={toggle} />
          <UserMenu ref={menuRef} userName={userName} isOpen={isOpen} onClose={close} />
        </div>
      </nav>
    </header>
  );
}
