"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { TrendingUp, ArrowRight, Check } from "lucide-react";

type RiskAppetite = "safe" | "balanced" | "aggressive";
type CapitalRange = "<100tr" | "100tr-1ty" | ">1ty";
type Goal = "accumulate" | "swing" | "dividend";

interface OnboardingData {
  riskAppetite: RiskAppetite | null;
  capitalRange: CapitalRange | null;
  goal: Goal | null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    riskAppetite: null,
    capitalRange: null,
    goal: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Lỗi",
          description: "Vui lòng đăng nhập lại",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      // Update profile with onboarding data
      const { error } = await supabase
        .from("profiles")
        .update({
          risk_appetite: data.riskAppetite,
          capital_range: data.capitalRange,
          investment_goal: data.goal,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        toast({
          title: "Cảnh báo",
          description: "Không thể lưu thông tin onboarding. Bạn vẫn có thể tiếp tục.",
          variant: "destructive",
        });
        // Continue anyway - don't block user
      } else {
        console.log("Onboarding data saved successfully");
      }

      toast({
        title: "Hoàn tất!",
        description: "Chào mừng đến với HawkEye",
      });

      // Explicit redirect to deal-digest page
      router.push("/dashboard/deal-digest");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi. Bạn có thể bỏ qua bước này.",
        variant: "destructive",
      });
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const riskOptions = [
    { value: "safe" as RiskAppetite, label: "An toàn", description: "Bảo toàn vốn, lợi nhuận ổn định" },
    { value: "balanced" as RiskAppetite, label: "Cân bằng", description: "Cân bằng giữa rủi ro và lợi nhuận" },
    { value: "aggressive" as RiskAppetite, label: "Mạo hiểm", description: "Chấp nhận rủi ro cao để tối đa hóa lợi nhuận" },
  ];

  const capitalOptions = [
    { value: "<100tr" as CapitalRange, label: "Dưới 100 triệu", description: "Vốn đầu tư ban đầu nhỏ" },
    { value: "100tr-1ty" as CapitalRange, label: "100 triệu - 1 tỷ", description: "Vốn đầu tư trung bình" },
    { value: ">1ty" as CapitalRange, label: "Trên 1 tỷ", description: "Vốn đầu tư lớn" },
  ];

  const goalOptions = [
    { value: "accumulate" as Goal, label: "Tích sản", description: "Tích lũy tài sản dài hạn" },
    { value: "swing" as Goal, label: "Lướt sóng", description: "Giao dịch ngắn hạn, tận dụng biến động" },
    { value: "dividend" as Goal, label: "Cổ tức", description: "Đầu tư vào cổ phiếu trả cổ tức cao" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-primary/5 to-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Bước {step} / 3</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((step / 3) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <Card className="glass border-primary/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {step === 1 && "Khẩu vị rủi ro của bạn?"}
                    {step === 2 && "Vốn đầu tư dự kiến?"}
                    {step === 3 && "Mục tiêu đầu tư?"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && "Giúp chúng tôi hiểu mức độ rủi ro bạn sẵn sàng chấp nhận"}
                    {step === 2 && "Vốn đầu tư ban đầu bạn dự kiến sử dụng"}
                    {step === 3 && "Mục tiêu chính của bạn khi đầu tư"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Risk Appetite */}
              {step === 1 && (
                <div className="grid gap-4">
                  {riskOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, riskAppetite: option.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.riskAppetite === option.value
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{option.label}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {data.riskAppetite === option.value && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Capital Range */}
              {step === 2 && (
                <div className="grid gap-4">
                  {capitalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, capitalRange: option.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.capitalRange === option.value
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{option.label}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {data.capitalRange === option.value && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Goal */}
              {step === 3 && (
                <div className="grid gap-4">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, goal: option.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.goal === option.value
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{option.label}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {data.goal === option.value && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1 || isLoading}
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !data.riskAppetite) ||
                    (step === 2 && !data.capitalRange) ||
                    (step === 3 && !data.goal) ||
                    isLoading
                  }
                >
                  {step === 3 ? (
                    isLoading ? "Đang xử lý..." : "Hoàn tất"
                  ) : (
                    <>
                      Tiếp theo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

