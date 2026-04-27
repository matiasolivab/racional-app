export class DateFormatter {
  private readonly shortFormatter: Intl.DateTimeFormat;

  public constructor(options: { locale: string }) {
    this.shortFormatter = new Intl.DateTimeFormat(options.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  public formatShort(date: Date): string {
    return this.shortFormatter.format(date);
  }
}
