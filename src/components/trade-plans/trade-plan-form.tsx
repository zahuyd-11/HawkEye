"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";

type TradePlanFormMode = "create" | "edit";

interface TradePlanFormProps {
  mode: TradePlanFormMode;
  planId?: string;
  initialValues?: Partial<FormValues>;
}

interface FormValues {
  name: string;
  ticker: string;
  strategy: string;
  strategyType: string;
  market: string;
  riskLevel: string;
  entryPrice: string;
  exitPrice: string;
  targetPrice: string;
  stopLoss: string;
  positionSize: string;
  thesis: string;
  notes: string;
  status: string;
}

const defaultValues: FormValues = {
  name: "",
  ticker: "",
  strategy: "",
  strategyType: "",
  market: "",
  riskLevel: "",
  entryPrice: "",
  exitPrice: "",
  targetPrice: "",
  stopLoss: "",
  positionSize: "",
  thesis: "",
  notes: "",
  status: "draft",
};

export function TradePlanForm({ mode, planId, initialValues }: TradePlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormValues>({ ...defaultValues, ...initialValues });
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const calculateRiskReward = (entry: string, target: string, stopLoss: string): number | null => {
    const entryNum = parseFloat(entry);
    const targetNum = parseFloat(target);
    const stopLossNum = parseFloat(stopLoss);

    if (entryNum && targetNum && stopLossNum) {
      const risk = Math.abs(entryNum - stopLossNum);
      const reward = Math.abs(targetNum - entryNum);
      if (risk > 0) {
        return parseFloat((reward / risk).toFixed(2));
      }
    }
    return null;
  };

  const riskRewardRatio = calculateRiskReward(formData.entryPrice, formData.targetPrice, formData.stopLoss);

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate risk-reward ratio if we have the required values
      const calculatedRiskReward = calculateRiskReward(formData.entryPrice, formData.targetPrice, formData.stopLoss);

      const payload = {
        ...formData,
        entryPrice: parseNumberOrNull(formData.entryPrice),
        exitPrice: parseNumberOrNull(formData.exitPrice),
        targetPrice: parseNumberOrNull(formData.targetPrice),
        stopLoss: parseNumberOrNull(formData.stopLoss),
        positionSize: parseNumberOrNull(formData.positionSize),
        riskRewardRatio: calculatedRiskReward,
      };

      const response = await fetch(mode === "create" ? "/api/trade-plan" : `/api/trade-plan/${planId}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      toast({
        title: mode === "create" ? "Trade plan created" : "Trade plan updated",
        description: mode === "create" ? "Your new plan is ready." : "Changes saved successfully.",
      });

      if (mode === "create") {
        router.push("/trade-plan");
      } else {
        router.push(`/trade-plan/${planId}`);
      }
      router.refresh();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create New Trade Plan" : "Edit Trade Plan"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Plan your trade with structured risk management." : "Update fields and save changes."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name *</Label>
            <Input id="name" value={formData.name} onChange={(event) => handleChange("name", event.target.value)} required />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker</Label>
              <Input id="ticker" value={formData.ticker} onChange={(event) => handleChange("ticker", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="market">{t("tradePlans.filters.market")}</Label>
              <Input
                id="market"
                placeholder={t("tradePlans.form.marketPlaceholder")}
                value={formData.market}
                onChange={(event) => handleChange("market", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="strategy">{t("tradePlans.filters.strategy")}</Label>
              <Input
                id="strategy"
                placeholder={t("tradePlans.form.strategyPlaceholder")}
                value={formData.strategyType || formData.strategy}
                onChange={(event) => {
                  handleChange("strategy", event.target.value);
                  handleChange("strategyType", event.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="riskLevel">{t("tradePlans.form.riskLabel")}</Label>
              <Select value={formData.riskLevel} onValueChange={(value) => handleChange("riskLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">—</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price (VND)</Label>
              <Input
                id="entryPrice"
                type="number"
                value={formData.entryPrice}
                onChange={(event) => handleChange("entryPrice", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price (VND)</Label>
              <Input
                id="targetPrice"
                type="number"
                value={formData.targetPrice}
                onChange={(event) => handleChange("targetPrice", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price (VND)</Label>
              <Input id="exitPrice" type="number" value={formData.exitPrice} onChange={(event) => handleChange("exitPrice", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss (VND)</Label>
              <Input id="stopLoss" type="number" value={formData.stopLoss} onChange={(event) => handleChange("stopLoss", event.target.value)} />
            </div>
          </div>

          {/* Auto-calculated Risk:Reward Ratio */}
          {riskRewardRatio !== null && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Risk:Reward Ratio (Tự động tính)</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dựa trên Entry, Target và Stop Loss
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{riskRewardRatio}:1</p>
                  <p className={`text-xs mt-1 ${
                    riskRewardRatio >= 2 ? "text-emerald-600 dark:text-emerald-400" : 
                    riskRewardRatio >= 1 ? "text-yellow-600 dark:text-yellow-400" : 
                    "text-red-600 dark:text-red-400"
                  }`}>
                    {riskRewardRatio >= 2 ? "Tốt" : riskRewardRatio >= 1 ? "Trung bình" : "Rủi ro cao"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="positionSize">Position Size</Label>
            <Input
              id="positionSize"
              type="number"
              value={formData.positionSize}
              onChange={(event) => handleChange("positionSize", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis">{t("tradePlans.form.thesisLabel")}</Label>
            <Textarea
              id="thesis"
              rows={4}
              value={formData.thesis}
              onChange={(event) => handleChange("thesis", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("tradePlans.form.notesLabel")}</Label>
            <Textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
            />
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="status">{t("tradePlans.filters.status")}</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Plan" : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function parseNumberOrNull(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

