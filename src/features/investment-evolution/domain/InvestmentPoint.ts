/**
 * Units:
 *  - `portfolioValue`   — CLP (integer or fractional, formatter rounds).
 *  - `portfolioIndex`   — dimensionless base-100 index anchored on the first point.
 *  - `dailyReturn`      — fraction (e.g. `0.0091` = `+0.91%`), not a percentage.
 *  - `contributions`    — CLP, cumulative total contributed by the user up to `date`.
 */
export type InvestmentPoint = {
  readonly date: Date;
  readonly portfolioValue: number;
  readonly portfolioIndex: number;
  readonly dailyReturn: number;
  readonly contributions: number;
};
