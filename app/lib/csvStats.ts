export type SummaryStats = {
  sampleCount: number;
  meanReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  priceColumn: string | null;
};

function normaliseKey(key: string): string {
  return key.trim().toLowerCase();
}

const PRICE_CANDIDATES = [
  "close",
  "close price",
  "closing price",
  "price",
  "equity",
  "balance",
  "portfolio value",
];

function coerceToNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.replace(/[^0-9+\-\.eE]/g, "");
    if (!trimmed) return null;
    const asNumber = Number(trimmed);
    return Number.isFinite(asNumber) ? asNumber : null;
  }
  return null;
}

export function computeSummaryStats(
  rows: Array<Record<string, unknown>>,
  riskFreeRate = 0,
): SummaryStats {
  const sampleCount = rows.length;
  if (sampleCount === 0) {
    return { sampleCount, meanReturn: 0, sharpeRatio: 0, maxDrawdown: 0, priceColumn: null };
  }

  const firstRow = rows.find((row) => Object.keys(row).length > 0) ?? {};
  const keyLookup = Object.keys(firstRow).reduce<Record<string, string>>((acc, key) => {
    acc[normaliseKey(key)] = key;
    return acc;
  }, {});

  const matchingKey = PRICE_CANDIDATES.find((candidate) => keyLookup[normaliseKey(candidate)]);
  const priceColumn = matchingKey ? keyLookup[normaliseKey(matchingKey)] : null;

  if (!priceColumn) {
    return { sampleCount, meanReturn: 0, sharpeRatio: 0, maxDrawdown: 0, priceColumn: null };
  }

  const prices = rows
    .map((row) => coerceToNumber(row[priceColumn]))
    .filter((value): value is number => value !== null);

  if (prices.length < 2) {
    return { sampleCount, meanReturn: 0, sharpeRatio: 0, maxDrawdown: 0, priceColumn };
  }

  const returns: number[] = [];
  for (let index = 1; index < prices.length; index += 1) {
    const previous = prices[index - 1];
    const current = prices[index];
    if (previous === 0) {
      continue;
    }
    returns.push(current / previous - 1);
  }

  const meanReturn = returns.reduce((sum, value) => sum + value, 0) / (returns.length || 1);
  let variance = 0;
  if (returns.length > 1) {
    variance =
      returns.reduce((sum, value) => sum + (value - meanReturn) ** 2, 0) /
      (returns.length - 1);
  }
  const standardDeviation = variance > 0 ? Math.sqrt(variance) : 0;
  const sharpeRatio = standardDeviation === 0 ? 0 : (meanReturn - riskFreeRate) / standardDeviation;

  let peak = prices[0];
  let maxDrawdown = 0;
  for (const price of prices) {
    if (price > peak) {
      peak = price;
    }
    if (peak === 0) {
      continue;
    }
    const drawdown = (price - peak) / peak;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return { sampleCount, meanReturn, sharpeRatio, maxDrawdown, priceColumn };
}
