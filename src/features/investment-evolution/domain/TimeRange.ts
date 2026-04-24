export const TIME_RANGES = ['1M', '3M', '6M', '1A', 'MAX'] as const;

export type TimeRange = (typeof TIME_RANGES)[number];
