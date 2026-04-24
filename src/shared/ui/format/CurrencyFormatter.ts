export class CurrencyFormatter {
  private readonly fullFormatter: Intl.NumberFormat;
  private readonly compactFormatter: Intl.NumberFormat;

  public constructor(options: { locale: string; currency: string }) {
    this.fullFormatter = new Intl.NumberFormat(options.locale, {
      style: 'currency',
      currency: options.currency,
      maximumFractionDigits: 0,
    });
    this.compactFormatter = new Intl.NumberFormat(options.locale, {
      style: 'currency',
      currency: options.currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    });
  }

  public format(value: number): string {
    return this.fullFormatter.format(value);
  }

  /**
   * Compact CLP format: `3377856 → "$3,4M"`, `1500000 → "$1,5M"`, `500 → "$500"`.
   *
   * Normalizes the `Intl` output so the display is consistent across runtimes:
   *  - strips the non-breaking space between the number and the unit
   *  - upper-cases the unit (`k → K`, `m → M`)
   */
  public formatCompact(value: number): string {
    const raw = this.compactFormatter.format(value);
    return raw.replaceAll(/\s+/gu, '').replace(/([km])$/iu, (match) => match.toUpperCase());
  }
}
