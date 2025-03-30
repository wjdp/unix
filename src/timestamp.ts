export const PRECISIONS = {
  seconds: 0,
  milliseconds: 12,
  microseconds: 15,
  nanoseconds: 17,
} as const;

export type Precision = keyof typeof PRECISIONS;

export function getTimestampPrecision(timestamp: number): Precision {
  // log10n + 1
  const length = Math.floor(Math.log10(timestamp)) + 1;
  console.log("length", length);
  if (length >= PRECISIONS.nanoseconds) {
    return "nanoseconds";
  } else if (length >= PRECISIONS.microseconds) {
    return "microseconds";
  } else if (length >= PRECISIONS.milliseconds) {
    return "milliseconds";
  }
  return "seconds";
}

const PRECISION_MULTIPLIER: Record<Precision, number> = {
  seconds: 1000,
  milliseconds: 1,
  microseconds: 0.001,
  nanoseconds: 0.000001,
} as const;

export function convertTimestampToDate(
  timestamp: number,
  precision: Precision,
): Date {
  const multiplier = PRECISION_MULTIPLIER[precision];
  return new Date(timestamp * multiplier);
}
