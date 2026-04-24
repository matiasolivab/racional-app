export class UserInitials {
  public static fromName(name: string): string {
    const tokens = name.trim().split(/\s+/u).filter(Boolean);

    if (tokens.length === 0) {
      return '?';
    }

    const first = tokens[0];
    if (tokens.length === 1) {
      const letter = first?.charAt(0) ?? '';
      return letter.length === 0 ? '?' : letter.toUpperCase();
    }

    const second = tokens[1];
    const firstLetter = first?.charAt(0) ?? '';
    const secondLetter = second?.charAt(0) ?? '';
    const initials = `${firstLetter}${secondLetter}`;
    return initials.length === 0 ? '?' : initials.toUpperCase();
  }
}
