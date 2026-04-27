export type InvestmentPoint = {
  readonly date: Date;
  readonly portfolioValue: number;
  readonly portfolioIndex: number;
  readonly dailyReturn: number;
  readonly contributions: number;
};
