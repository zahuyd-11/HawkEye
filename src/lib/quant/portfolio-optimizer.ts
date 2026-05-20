import { MarketRegime } from './regime-detector';

export interface UserInput {
  totalCapital: number;       // Exact numerical capital (e.g. 500,000,000 VND)
  maxDrawdownAcceptable: number; // Maximum acceptable draw-down (%)
  sectorsOfInterest: string[];  // List of selected industry/asset sectors
}

export interface AssetMetrics {
  ticker: string;
  expectedReturn: number;
  volatility: number;
  sector: string;
}

export function computeSpecificAllocation(
  input: UserInput,
  regime: MarketRegime,
  availableAssets: AssetMetrics[]
) {
  // 1. Filter assets based on user's selected sector interests plus default defensive and cash assets
  const filteredAssets = availableAssets.filter(asset => 
    input.sectorsOfInterest.includes(asset.sector) || 
    asset.sector === 'DEFENSIVE' || 
    asset.sector === 'CASH'
  );

  let allocations: { [ticker: string]: number } = {};
  let totalWeight = 0;

  // 2. Adjust dynamic penalty/reward matrix depending on the Market Regime (CFA Portfolio Management guidelines)
  filteredAssets.forEach(asset => {
    let weightModifier = 1.0;

    switch (regime) {
      case 'PANIC':
        if (asset.sector === 'CASH' || asset.ticker === 'GOLD' || asset.ticker === 'E1VFVN30') {
          weightModifier = 2.5; // Absolute safety priority
        } else {
          weightModifier = 0.1; // Penalize cyclical/volatile assets down to near zero
        }
        break;
      case 'RISK_OFF':
        if (asset.sector === 'DEFENSIVE') weightModifier = 1.8;
        if (asset.sector === 'CYCLICAL') weightModifier = 0.4;
        break;
      case 'EUPHORIA':
        if (asset.sector === 'CYCLICAL') weightModifier = 2.0; // Ride high momentum
        if (asset.sector === 'CASH') weightModifier = 0.2;
        break;
      case 'RISK_ON':
      default:
        weightModifier = 1.0; // Standard baseline allocation
        break;
    }

    // Dynamic risk-aversion utility score ( Sharpe Ratio adapted to include personalized risk tolerance limit )
    const riskAversionFactor = 100 / input.maxDrawdownAcceptable;
    const utilityScore = (asset.expectedReturn * weightModifier) / (asset.volatility * riskAversionFactor);
    
    allocations[asset.ticker] = Math.max(0, utilityScore);
    totalWeight += allocations[asset.ticker];
  });

  // 3. Normalize to ensure total portfolio allocation always sums up to 100%
  const finalPortfolio: Array<{ ticker: string; weightPercentage: number; capitalAllocated: number }> = [];
  
  Object.keys(allocations).forEach(ticker => {
    const normalizedWeight = totalWeight > 0 ? (allocations[ticker] / totalWeight) : 0;
    
    if (normalizedWeight > 0.01) { // Filter out any allocation below 1% for clarity
      finalPortfolio.push({
        ticker,
        weightPercentage: parseFloat((normalizedWeight * 100).toFixed(2)),
        capitalAllocated: Math.round(normalizedWeight * input.totalCapital) // Exact numerical capital allocation
      });
    }
  });

  return {
    regimeDetected: regime,
    portfolio: finalPortfolio
  };
}
