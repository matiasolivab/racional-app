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

  public formatCompact(value: number): string {
    const raw = this.compactFormatter.format(value);
    return raw.replaceAll(/\s+/gu, '').replace(/([km])$/iu, (match) => match.toUpperCase());
  }
}
