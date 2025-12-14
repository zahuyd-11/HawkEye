"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calculator, TrendingUp, FileText } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { RiskSurvey } from "@/components/trade-plans/RiskSurvey";
import { StrategyDashboard } from "@/components/trade-plans/StrategyDashboard";
import { calculateStrategy } from "@/lib/strategy-logic";
import { calculateSurveyScore } from "@/data/risk-survey-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

interface TradePlan {
  id: string;
  name: string;
  ticker: string | null;
  strategy: string | null;
  strategyType?: string | null;
  market?: string | null;
  riskLevel?: string | null;
  entryPrice: number | null;
  exitPrice: number | null;
  targetPrice?: number | null;
  stopLoss: number | null;
  positionSize: number | null;
  riskRewardRatio: number | null;
  thesis?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

type SurveyState = "not_started" | "in_progress" | "completed";

export default function TradePlanPage() {
  // Survey state management
  const [surveyState, setSurveyState] = useState<SurveyState>("not_started");
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [surveyScore, setSurveyScore] = useState<number | null>(null);
  const [strategyProfile, setStrategyProfile] = useState<ReturnType<typeof calculateStrategy> | null>(null);

  const [tradePlans, setTradePlans] = useState<TradePlan[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcEntry, setCalcEntry] = useState("");
  const [calcExit, setCalcExit] = useState("");
  const [calcStopLoss, setCalcStopLoss] = useState("");
  const [calcCapital, setCalcCapital] = useState("");
  const [calcMaxLoss, setCalcMaxLoss] = useState("");

  // Load survey results from localStorage on mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem("hawkeye_survey_answers");
    const savedScore = localStorage.getItem("hawkeye_survey_score");

    if (savedAnswers && savedScore) {
      try {
        const answers = JSON.parse(savedAnswers);
        const score = parseInt(savedScore, 10);
        setSurveyAnswers(answers);
        setSurveyScore(score);
        setStrategyProfile(calculateStrategy(score));
        setSurveyState("completed");
      } catch (error) {
        console.error("Error loading survey data:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/trade-plan")
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setTradePlans(data);
        } else if (data?.error) {
          console.error("API Error:", data.error);
          setTradePlans([]); // Set empty array on error
        } else {
          setTradePlans([]); // Set empty array if data is not an array
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setTradePlans([]); // Set empty array on fetch error
      });
  }, []);

  // Survey handlers
  const handleSurveyComplete = (answers: Record<string, string>, score: number) => {
    setSurveyAnswers(answers);
    setSurveyScore(score);
    const profile = calculateStrategy(score);
    setStrategyProfile(profile);
    setSurveyState("completed");

    // Save to localStorage
    localStorage.setItem("hawkeye_survey_answers", JSON.stringify(answers));
    localStorage.setItem("hawkeye_survey_score", score.toString());
  };

  const handleStartSurvey = () => {
    setSurveyState("in_progress");
  };

  const handleRetakeSurvey = () => {
    setSurveyState("in_progress");
    setSurveyAnswers({});
    setSurveyScore(null);
    setStrategyProfile(null);
    localStorage.removeItem("hawkeye_survey_answers");
    localStorage.removeItem("hawkeye_survey_score");
  };

  const handleCancelSurvey = () => {
    setSurveyState("not_started");
  };

  const calculateRiskReward = () => {
    const entry = parseFloat(calcEntry);
    const exit = parseFloat(calcExit);
    const stopLoss = parseFloat(calcStopLoss);

    if (entry && exit && stopLoss) {
      const risk = Math.abs(entry - stopLoss);
      const reward = Math.abs(exit - entry);
      return risk > 0 ? (reward / risk).toFixed(2) : "0";
    }
    return "0";
  };

  const calculatePositionSize = () => {
    const capital = parseFloat(calcCapital);
    const maxLoss = parseFloat(calcMaxLoss);
    const entry = parseFloat(calcEntry);
    const stopLoss = parseFloat(calcStopLoss);

    if (capital && maxLoss && entry && stopLoss) {
      const riskPerShare = Math.abs(entry - stopLoss);
      const maxLossAmount = (capital * maxLoss) / 100;
      return riskPerShare > 0 ? Math.floor(maxLossAmount / riskPerShare) : 0;
    }
    return 0;
  };

  const calculateRequiredGain = () => {
    const maxLoss = parseFloat(calcMaxLoss);
    if (maxLoss) {
      return ((maxLoss / (100 - maxLoss)) * 100).toFixed(2);
    }
    return "0";
  };

  // Show survey if not completed
  if (surveyState === "in_progress") {
    return (
      <>
        <main className="container px-4 py-8">
          <RiskSurvey onComplete={handleSurveyComplete} onCancel={handleCancelSurvey} />
        </main>
        <Footer />
      </>
    );
  }

  // Show strategy dashboard if survey completed
  if (surveyState === "completed" && strategyProfile && surveyScore !== null) {
    return (
      <>
        <main className="container px-4 py-8">
          <Tabs defaultValue="stocks-etf" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="stocks-etf">Cổ phiếu & ETF</TabsTrigger>
              <TabsTrigger value="derivatives" disabled>
                <Lock className="mr-2 h-4 w-4" />
                Phái sinh (Derivatives)
              </TabsTrigger>
              <TabsTrigger value="forex-crypto" disabled>
                <Lock className="mr-2 h-4 w-4" />
                Ngoại hối & Crypto
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stocks-etf" className="mt-0">
              <StrategyDashboard profile={strategyProfile} score={surveyScore} onRetakeSurvey={handleRetakeSurvey} />
            </TabsContent>
            <TabsContent value="derivatives" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    Tính năng đang phát triển
                  </CardTitle>
                  <CardDescription>
                    Phái sinh (Derivatives) - Hedging danh mục và Quyền chọn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tính năng Hedging danh mục và Quyền chọn đang được phát triển. 
                    Chúng tôi sẽ thông báo khi tính năng này sẵn sàng.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="forex-crypto" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    Tính năng đang phát triển
                  </CardTitle>
                  <CardDescription>
                    Ngoại hối & Crypto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tính năng Ngoại hối và Crypto đang được phát triển. 
                    Chúng tôi sẽ thông báo khi tính năng này sẵn sàng.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </>
    );
  }

  // Show main trade plan page with option to start survey
  return (
    <>
      <main className="container px-4 py-8">
        {/* Survey Prompt Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle>Khám phá Hồ sơ Đầu tư của Bạn</CardTitle>
            <CardDescription>
              Hoàn thành khảo sát khẩu vị rủi ro để nhận chiến lược đầu tư được cá nhân hóa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={handleStartSurvey}>
              <TrendingUp className="mr-2 h-5 w-5" />
              Bắt đầu Khảo sát
            </Button>
          </CardContent>
        </Card>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">TradePlan Builder</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your trading plans
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCalculator(!showCalculator)}>
              <Calculator className="mr-2 h-4 w-4" />
              Risk Calculator
            </Button>
            <Link href="/dashboard/trade-plan/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Plan
              </Button>
            </Link>
          </div>
        </div>

        {showCalculator && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Risk-Reward Calculator</CardTitle>
              <CardDescription>
                Calculate position sizing and risk metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Total Capital (VND)</Label>
                    <Input
                      type="number"
                      placeholder="100000000"
                      value={calcCapital}
                      onChange={(e) => setCalcCapital(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Max Loss %</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={calcMaxLoss}
                      onChange={(e) => setCalcMaxLoss(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Entry Price</Label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={calcEntry}
                      onChange={(e) => setCalcEntry(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Stop Loss</Label>
                    <Input
                      type="number"
                      placeholder="95000"
                      value={calcStopLoss}
                      onChange={(e) => setCalcStopLoss(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Exit Price</Label>
                    <Input
                      type="number"
                      placeholder="110000"
                      value={calcExit}
                      onChange={(e) => setCalcExit(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Risk-Reward Ratio</p>
                        <p className="text-2xl font-bold">{calculateRiskReward()}:1</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Position Size (shares)</p>
                        <p className="text-2xl font-bold">{calculatePositionSize()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Required Gain to Recover</p>
                        <p className="text-2xl font-bold">{calculateRequiredGain()}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trading Journal Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trading Journal</CardTitle>
            <CardDescription>Overview of all your trading plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Tên / Mã CK</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Chiến lược</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Entry</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Target</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Stop Loss</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">R:R</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Trạng thái</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold">Cập nhật</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(tradePlans) && tradePlans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">{plan.ticker ?? "—"}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{plan.strategyType || plan.strategy || "—"}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-mono">
                          {plan.entryPrice ? `${plan.entryPrice.toLocaleString()}₫` : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                          {plan.targetPrice ? `${plan.targetPrice.toLocaleString()}₫` : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-mono text-red-600 dark:text-red-400">
                          {plan.stopLoss ? `${plan.stopLoss.toLocaleString()}₫` : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-mono font-semibold">
                          {plan.riskRewardRatio ? `${plan.riskRewardRatio}:1` : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            plan.status === "active"
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : plan.status === "closed"
                              ? "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                              : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {plan.status === "active" ? "Hoạt động" : plan.status === "closed" ? "Đóng" : "Nháp"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs text-muted-foreground">
                          {new Date(plan.updatedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link href={`/trade-plan/${plan.id}`}>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Array.isArray(tradePlans) && tradePlans.length === 0 && (
                <div className="py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Chưa có kế hoạch giao dịch nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {Array.isArray(tradePlans) && tradePlans.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No trade plans yet</p>
              <Link href="/dashboard/trade-plan/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}

