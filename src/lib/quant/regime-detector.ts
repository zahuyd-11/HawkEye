export type MarketRegime = 'RISK_ON' | 'RISK_OFF' | 'PANIC' | 'EUPHORIA';

export interface MarketSignals {
  vnimav_20_deviation: number; // Deviation of VN-Index from its MA20 (e.g. 0.05 for +5%)
  sbv_net_injection_30d: number; // SBV's net money injection/extraction over last 30 days (in VND)
  fx_usdvnd_ytd_change: number; // USD/VND exchange rate growth YTD (e.g. 0.03 for +3%)
  vix_vn: number; // Volatility index or historical standard deviation of VN-Index in last 20 days
}

export function detectMarketRegime(signals: MarketSignals): MarketRegime {
  const { vnimav_20_deviation, sbv_net_injection_30d, fx_usdvnd_ytd_change, vix_vn } = signals;

  // 1. Panic State (Liquidity crisis, extreme volatility and standard deviation deviation < -8%)
  if (vix_vn > 35 && vnimav_20_deviation < -0.08) {
    return 'PANIC';
  }

  // 2. Risk-Off State (Tightening monetary policy, extreme USD/VND rise, large SBV money extraction)
  if (sbv_net_injection_30d < -50000000000000 || fx_usdvnd_ytd_change > 0.04) {
    return 'RISK_OFF';
  }

  // 3. Euphoria State (FOMO, extremely low volatility and deviation > +10% above MA20)
  if (vix_vn < 12 && vnimav_20_deviation > 0.10) {
    return 'EUPHORIA';
  }

  // 4. Baseline Risk-On expansion state
  return 'RISK_ON';
}
