"use client";

import { EquityChart } from "../../../components/equity-chart";

type Props = {
  equityCurve: Array<{ timestamp: string; value: number }>;
  drawdown: Array<{ timestamp: string; value: number }>;
};

export function StrategyEquity({ equityCurve, drawdown }: Props) {
  if (!equityCurve.length) {
    return null;
  }

  return <EquityChart equityCurve={equityCurve} drawdown={drawdown} />;
}
