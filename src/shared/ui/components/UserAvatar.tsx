'use client';

import type { Ref } from 'react';

import { UserInitials } from '@/shared/ui/identity/UserInitials';

type UserAvatarProps = {
  readonly ref?: Ref<HTMLButtonElement>;
  readonly name: string;
  readonly isMenuOpen: boolean;
  readonly onActivate: () => void;
};

export function UserAvatar(props: UserAvatarProps) {
  const { ref, name, isMenuOpen, onActivate } = props;
  const initials = UserInitials.fromName(name);

  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="menu"
      aria-expanded={isMenuOpen}
      aria-label="Menú de usuario"
      onClick={onActivate}
      className="bg-primary text-primary-fg focus-visible:outline-primary inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-xs font-semibold uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 md:size-9 md:text-sm"
    >
      <span aria-hidden="true">{initials}</span>
    </button>
  );
}
