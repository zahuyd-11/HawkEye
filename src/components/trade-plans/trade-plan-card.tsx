"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Flame, LineChart } from "lucide-react";
import { TradePlanSummary } from "@/types/trade-plan";
import { format } from "date-fns";
import { useMemo } from "react";

interface Props {
  plan: TradePlanSummary;
  condensed?: boolean;
  showOwner?: boolean;
}

const RISK_COLORS: Record<string, string> = {
  low: "text-green-600 bg-green-50",
  medium: "text-amber-700 bg-amber-50",
  high: "text-red-600 bg-red-50",
};

export function TradePlanCard({ plan, condensed = false, showOwner = false }: Props) {
  const updatedDate = useMemo(() => format(new Date(plan.updatedAt), "dd MMM yyyy"), [plan.updatedAt]);

  return (
    <Card className={condensed ? "h-full" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="text-sm">
              {plan.ticker ? plan.ticker.toUpperCase() : "—"} · {plan.strategyType || plan.strategy || "Uncategorized"}
            </CardDescription>
          </div>
          <StatusBadge status={plan.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{plan.market ? plan.market.toUpperCase() : "N/A"}</span>
          <span>•</span>
          <span>{updatedDate}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Entry:</span> {formatPrice(plan.entryPrice)}
            </p>
            <p>
              <span className="text-muted-foreground">Target:</span> {formatPrice(plan.targetPrice ?? plan.exitPrice)}
            </p>
            <p>
              <span className="text-muted-foreground">Stop-loss:</span> {formatPrice(plan.stopLoss)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <MiniSparkline plan={plan} />
            {plan.riskLevel && (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${RISK_COLORS[plan.riskLevel] ?? ""}`}>
                {plan.riskLevel?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        {showOwner && plan.user && (
          <p className="text-xs text-muted-foreground">Owner: {plan.user.name || plan.user.email}</p>
        )}
        {!condensed && plan.thesis && (
          <p className="text-sm text-muted-foreground line-clamp-2">{plan.thesis}</p>
        )}
        <Button asChild variant={condensed ? "outline" : "secondary"} className="w-full">
          <Link href={`/trade-plan/${plan.id}`}>View Plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase();
  if (normalized === "active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <BadgeCheck className="h-3 w-3" /> Active
      </span>
    );
  }

  if (normalized === "closed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        <LineChart className="h-3 w-3" /> Closed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      <Flame className="h-3 w-3" /> Draft
    </span>
  );
}

export function MiniSparkline({ plan }: { plan: TradePlanSummary }) {
  const points = useMemo(() => {
    const values = [plan.stopLoss, plan.entryPrice, plan.targetPrice ?? plan.exitPrice].filter(
      (value): value is number => typeof value === "number"
    );

    if (values.length < 2) {
      return null;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const prepared = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / span) * 100;
      return `${x},${y}`;
    });

    return prepared.join(" ");
  }, [plan.entryPrice, plan.exitPrice, plan.stopLoss, plan.targetPrice]);

  if (!points) {
    return (
      <div className="flex h-8 w-20 items-center justify-center rounded-md border text-muted-foreground">
        <LineChart className="h-4 w-4" />
      </div>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-24 text-primary">
      <polyline fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function formatPrice(value?: number | null) {
  if (typeof value !== "number") {
    return "—";
  }
  return `${value.toLocaleString("vi-VN")} ₫`;
}

