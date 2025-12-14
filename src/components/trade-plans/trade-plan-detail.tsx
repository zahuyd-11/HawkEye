"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TradePlanSummary } from "@/types/trade-plan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MiniSparkline } from "./trade-plan-card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  plan: TradePlanSummary;
  isAdmin?: boolean;
}

export function TradePlanDetail({ plan: initialPlan, isAdmin = false }: Props) {
  const [plan, setPlan] = useState(initialPlan);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isDuplicating, startDuplicateTransition] = useTransition();
  const [isUpdating, startUpdateTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const updatedDate = format(new Date(plan.updatedAt), "dd MMM yyyy");
  const createdDate = format(new Date(plan.createdAt), "dd MMM yyyy");

  const updatePlan = async (payload: Partial<TradePlanSummary>) => {
    const response = await fetch(`/api/trade-plan/${plan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update plan");
    }

    const updated = (await response.json()) as TradePlanSummary;
    setPlan(updated);
    router.refresh();
  };

  const handleMarkClosed = () => {
    startUpdateTransition(async () => {
      try {
        await updatePlan({ status: "closed" });
        toast({ title: "Plan closed", description: "Status updated to Closed." });
      } catch {
        toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
      }
    });
  };

  const handleDuplicate = () => {
    startDuplicateTransition(async () => {
      try {
        const response = await fetch(`/api/trade-plan/${plan.id}/duplicate`, { method: "POST" });
        if (!response.ok) {
          throw new Error("Unable to duplicate");
        }
        const duplicate = (await response.json()) as TradePlanSummary;
        toast({ title: "Plan duplicated", description: `${duplicate.name} created.` });
        router.push(`/trade-plan/${duplicate.id}`);
      } catch {
        toast({ title: "Duplicate failed", description: "Please try again.", variant: "destructive" });
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      try {
        const response = await fetch(`/api/trade-plan/${plan.id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Failed to delete");
        }
        toast({ title: "Plan deleted" });
        router.push("/trade-plan");
      } catch {
        toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" });
      }
    });
  };

  const handleFlagToggle = () => {
    if (!isAdmin) return;

    const nextState = !plan.flagged;
    const reason = nextState ? window.prompt("Flag reason", plan.flaggedReason ?? "") ?? undefined : undefined;

    startUpdateTransition(async () => {
      try {
        const response = await fetch(`/api/trade-plan/${plan.id}/flag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flagged: nextState, reason }),
        });
        if (!response.ok) {
          throw new Error("Failed to flag");
        }
        const updated = (await response.json()) as TradePlanSummary;
        setPlan(updated);
        toast({
          title: nextState ? "Plan flagged" : "Flag cleared",
          description: nextState ? "Visible to the owner as flagged." : "Flag removed.",
        });
      } catch {
        toast({ title: "Action failed", description: "Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">TradePlan Detail</p>
          <h1 className="mt-2 text-4xl font-bold">{plan.name}</h1>
          <p className="text-muted-foreground mt-3">
            {plan.strategyType || plan.strategy || "Uncategorized"} · {plan.market?.toUpperCase() || "N/A"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>{plan.ticker ? plan.ticker.toUpperCase() : "—"}</span>
            <span>•</span>
            <span>
              {t("tradePlans.detail.updated")}: {updatedDate}
            </span>
            <span>•</span>
            <span>Created: {createdDate}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href={`/dashboard/trade-plan/${plan.id}/edit`}>{t("tradePlans.detail.edit")}</Link>
          </Button>
          <Button variant="outline" onClick={handleDuplicate} disabled={isDuplicating}>
            {isDuplicating ? "Duplicating..." : t("tradePlans.detail.duplicate")}
          </Button>
          <Button variant="outline" onClick={handleMarkClosed} disabled={isUpdating || plan.status === "closed"}>
            {isUpdating ? "Updating..." : t("tradePlans.detail.markClosed")}
          </Button>
          {isAdmin && (
            <Button variant={plan.flagged ? "secondary" : "outline"} onClick={handleFlagToggle} disabled={isUpdating}>
              {plan.flagged ? "Remove flag" : "Flag plan"}
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : t("tradePlans.detail.delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("tradePlans.detail.meta")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric label={t("tradePlans.detail.entry")} value={plan.entryPrice} />
              <Metric label={t("tradePlans.detail.target")} value={plan.targetPrice ?? plan.exitPrice} />
              <Metric label={t("tradePlans.detail.stop")} value={plan.stopLoss} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric label="Position Size" value={plan.positionSize} suffix="units" />
              <Metric label="Risk/Reward" value={plan.riskRewardRatio} suffix=" : 1" precision={2} />
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">{t("tradePlans.detail.status")}</p>
                <p className="text-lg font-semibold capitalize">{plan.status}</p>
              </div>
            </div>
            <div className="rounded-2xl border p-4">
              <MiniSparkline plan={plan} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label={t("tradePlans.filters.risk")} value={plan.riskLevel?.toUpperCase() || "N/A"} />
            <DetailRow label="Strategy" value={plan.strategyType || plan.strategy || "N/A"} />
            <DetailRow label={t("tradePlans.filters.market")} value={plan.market?.toUpperCase() || "N/A"} />
            {plan.flagged && (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold">Flagged by Admin</p>
                <p>{plan.flaggedReason || "Policy review pending."}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("tradePlans.detail.thesis")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">{plan.thesis || "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("tradePlans.detail.notes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground whitespace-pre-wrap">{plan.notes || "—"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, suffix, precision = 0 }: { label: string; value?: number | null; suffix?: string; precision?: number }) {
  if (typeof value !== "number") {
    return (
      <div className="rounded-2xl border p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">—</p>
      </div>
    );
  }

  const formatted = precision
    ? `${value.toFixed(precision)}${suffix ?? ""}`
    : `${value.toLocaleString("vi-VN")} ${suffix ?? "₫"}`;

  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{formatted}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

