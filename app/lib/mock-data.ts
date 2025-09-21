export type BacktestRun = {
  id: string;
  name: string;
  strategy: string;
  symbols: string[];
  timeframe: string;
  createdAt: string;
  status: "complete" | "processing" | "queued";
  metrics: {
    netProfit: number;
    cagr: number;
    maxDrawdown: number;
    sharpe: number;
    winRate: number;
    totalTrades: number;
  };
  tags: string[];
  equityCurve: Array<{ timestamp: string; value: number }>;
  drawdown: Array<{ timestamp: string; value: number }>;
  tradesTable: Array<Record<string, unknown>>;
  notes?: string;
};

const baselineEquity = [
  { timestamp: "2023-01-01", value: 100000 },
  { timestamp: "2023-03-01", value: 108000 },
  { timestamp: "2023-06-01", value: 118500 },
  { timestamp: "2023-09-01", value: 126400 },
  { timestamp: "2023-12-01", value: 134200 },
];

const baselineDrawdown = [
  { timestamp: "2023-01-01", value: 0 },
  { timestamp: "2023-03-01", value: -0.02 },
  { timestamp: "2023-06-01", value: -0.04 },
  { timestamp: "2023-09-01", value: -0.01 },
  { timestamp: "2023-12-01", value: -0.03 },
];

const baseTrades: Array<Record<string, unknown>> = [
  {
    tradeId: "TV-001",
    symbol: "AAPL",
    direction: "Long",
    opened_at: "2023-01-03T14:30:00Z",
    closed_at: "2023-01-10T15:45:00Z",
    pnl: 1450.24,
    bars_held: 8,
  },
  {
    tradeId: "TV-002",
    symbol: "MSFT",
    direction: "Short",
    opened_at: "2023-02-14T09:30:00Z",
    closed_at: "2023-02-20T16:00:00Z",
    pnl: -320.5,
    bars_held: 5,
  },
  {
    tradeId: "TV-003",
    symbol: "NVDA",
    direction: "Long",
    opened_at: "2023-04-01T09:30:00Z",
    closed_at: "2023-04-12T14:00:00Z",
    pnl: 2350.9,
    bars_held: 9,
  },
];

export const mockBacktests: BacktestRun[] = [
  {
    id: "alpha-tech",
    name: "Alpha Momentum Tech",
    strategy: "TV Momentum Stack",
    symbols: ["AAPL", "MSFT", "NVDA", "AMD", "GOOGL"],
    timeframe: "Daily",
    createdAt: "2024-04-10T08:15:00Z",
    status: "complete",
    metrics: {
      netProfit: 34250,
      cagr: 18.4,
      maxDrawdown: -9.7,
      sharpe: 1.21,
      winRate: 54,
      totalTrades: 126,
    },
    tags: ["Stocks", "Momentum", "Equal weight"],
    equityCurve: baselineEquity,
    drawdown: baselineDrawdown,
    tradesTable: baseTrades,
    notes: "Outperforms benchmark when volatility is moderate; monitor Nvidia weighting.",
  },
  {
    id: "fx-carry",
    name: "SteadyFX Carry",
    strategy: "FX Carry Overlay",
    symbols: ["EURUSD", "USDJPY", "AUDUSD", "GBPUSD"],
    timeframe: "4H",
    createdAt: "2024-03-21T12:05:00Z",
    status: "complete",
    metrics: {
      netProfit: 18780,
      cagr: 12.9,
      maxDrawdown: -6.2,
      sharpe: 1.08,
      winRate: 62,
      totalTrades: 214,
    },
    tags: ["Forex", "Carry", "Low volatility"],
    equityCurve: [
      { timestamp: "2023-01-01", value: 100000 },
      { timestamp: "2023-03-01", value: 103200 },
      { timestamp: "2023-06-01", value: 109000 },
      { timestamp: "2023-09-01", value: 112400 },
      { timestamp: "2023-12-01", value: 118780 },
    ],
    drawdown: [
      { timestamp: "2023-01-01", value: 0 },
      { timestamp: "2023-03-01", value: -0.015 },
      { timestamp: "2023-06-01", value: -0.03 },
      { timestamp: "2023-09-01", value: -0.012 },
      { timestamp: "2023-12-01", value: -0.02 },
    ],
    tradesTable: baseTrades.map((trade, index) => ({ ...trade, tradeId: `FX-${index + 1}` })),
    notes: "Stable carry basket; add risk overlay before going live with higher leverage.",
  },
  {
    id: "multi-strat",
    name: "Adaptive Multi-Strat",
    strategy: "Composite Portfolio",
    symbols: ["AAPL", "TSLA", "BTCUSD", "ETHUSD", "GLD"],
    timeframe: "Daily",
    createdAt: "2024-02-18T17:45:00Z",
    status: "processing",
    metrics: {
      netProfit: 0,
      cagr: 0,
      maxDrawdown: 0,
      sharpe: 0,
      winRate: 0,
      totalTrades: 0,
    },
    tags: ["Hybrid", "Crypto", "Equities"],
    equityCurve: [],
    drawdown: [],
    tradesTable: [],
    notes: "Combines long momentum equities with crypto mean reversion—currently running.",
  },
];
