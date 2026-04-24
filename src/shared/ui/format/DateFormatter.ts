/**
 * Date granularity hint for `DateFormatter.formatRangeAware`.
 *
 * Declared locally so `shared/` stays decoupled from any feature — the consumer
 * (e.g. the `investment-evolution` feature) translates its own `TimeRange` into
 * this neutral enum at the call site.
 */
export type DateGranularity = 'day' | 'short' | 'month';

export class DateFormatter {
  private readonly shortFormatter: Intl.DateTimeFormat;
  private readonly dayFormatter: Intl.DateTimeFormat;
  private readonly monthFormatter: Intl.DateTimeFormat;

  public constructor(options: { locale: string }) {
    this.shortFormatter = new Intl.DateTimeFormat(options.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    this.dayFormatter = new Intl.DateTimeFormat(options.locale, {
      day: '2-digit',
      month: 'short',
    });
    this.monthFormatter = new Intl.DateTimeFormat(options.locale, {
      month: 'short',
      year: 'numeric',
    });
  }

  public formatShort(date: Date): string {
    return this.shortFormatter.format(date);
  }

  public formatDay(date: Date): string {
    return this.dayFormatter.format(date);
  }

  public formatMonth(date: Date): string {
    return this.monthFormatter.format(date);
  }

  public formatRangeAware(date: Date, granularity: DateGranularity): string {
    switch (granularity) {
      case 'day': {
        return this.formatDay(date);
      }
      case 'month': {
        return this.formatMonth(date);
      }
      case 'short': {
        return this.formatShort(date);
      }
    }
  }
}
