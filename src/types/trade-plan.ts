export type TradePlanStatus = "draft" | "active" | "closed";
export type TradePlanRiskLevel = "low" | "medium" | "high" | null;

export interface TradePlanSummary {
  id: string;
  userId: string;
  name: string;
  ticker?: string | null;
  strategy?: string | null;
  strategyType?: string | null;
  market?: string | null;
  riskLevel?: TradePlanRiskLevel;
  entryPrice?: number | null;
  exitPrice?: number | null;
  targetPrice?: number | null;
  stopLoss?: number | null;
  positionSize?: number | null;
  riskRewardRatio?: number | null;
  thesis?: string | null;
  notes?: string | null;
  status: TradePlanStatus;
  flagged?: boolean;
  flaggedReason?: string | null;
  flaggedAt?: string | null;
  flaggedById?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

