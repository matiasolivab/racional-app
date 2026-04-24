export class PercentFormatter {
  private readonly formatter: Intl.NumberFormat;

  public constructor(options: { locale: string; maximumFractionDigits?: number }) {
    this.formatter = new Intl.NumberFormat(options.locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: options.maximumFractionDigits ?? 2,
      signDisplay: 'exceptZero',
    });
  }

  public format(fraction: number): string {
    return this.formatter.format(fraction);
  }
}
