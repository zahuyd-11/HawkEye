"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Check, CreditCard } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";

interface Subscription {
  tier: string;
  status: string;
  currentPeriodEnd: string | null;
}

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const selectedTier = searchParams.get("tier");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscription")
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSubscribe = async (tier: "PLUS" | "PRO") => {
    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and billing
          </p>
        </div>

        {subscription && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {SUBSCRIPTION_TIERS[subscription.tier as keyof typeof SUBSCRIPTION_TIERS]?.name || subscription.tier}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Status: {subscription.status}
                  </p>
                  {subscription.currentPeriodEnd && (
                    <p className="text-sm text-muted-foreground">
                      Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button variant="outline">Manage Billing</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className={selectedTier === "PLUS" ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Plus</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">249,000₫</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Object.entries(SUBSCRIPTION_TIERS.PLUS).slice(1).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() => handleSubscribe("PLUS")}
                disabled={subscription?.tier === "PLUS"}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {subscription?.tier === "PLUS" ? "Current Plan" : "Upgrade to Plus"}
              </Button>
            </CardContent>
          </Card>

          <Card className={selectedTier === "PRO" ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">499,000₫</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {Object.entries(SUBSCRIPTION_TIERS.PRO).slice(1).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() => handleSubscribe("PRO")}
                disabled={subscription?.tier === "PRO"}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {subscription?.tier === "PRO" ? "Current Plan" : "Upgrade to Pro"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}

