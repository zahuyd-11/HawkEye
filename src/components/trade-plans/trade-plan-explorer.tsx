"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TradePlanSummary } from "@/types/trade-plan";
import { TradePlanCard } from "./trade-plan-card";
import { TradePlanFilters, DateSortOption } from "./trade-plan-filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";
import { ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";

export function TradePlanExplorer() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<TradePlanSummary[]>([]);
  const [query, setQuery] = useState("");
  const [strategy, setStrategy] = useState("");
  const [status, setStatus] = useState("");
  const [market, setMarket] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [sort, setSort] = useState<DateSortOption>("updated_desc");
  const [isLoading, setIsLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("query", query);
    if (strategy) searchParams.set("strategyType", strategy);
    if (status) searchParams.set("status", status);
    if (market) searchParams.set("market", market);
    if (riskLevel) searchParams.set("riskLevel", riskLevel);
    if (sort) searchParams.set("sort", sort);
    if (isAdmin) searchParams.set("scope", "all");
    return searchParams.toString();
  }, [isAdmin, market, query, riskLevel, sort, status, strategy]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setNeedsAuth(false);

    const timeout = setTimeout(() => {
      fetch(`/api/trade-plan?${params}`, { signal: controller.signal })
        .then(async (response) => {
          if (response.status === 401) {
            setNeedsAuth(true);
            setPlans([]);
            return;
          }
          const data = await response.json();
          setPlans(data);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error(error);
          }
        })
        .finally(() => setIsLoading(false));
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [params]);

  if (needsAuth) {
    return (
      <section className="container px-4 py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border bg-card/80 p-12 text-center shadow-lg">
          <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="text-3xl font-semibold mb-2">Please sign in to see your Trade Plans</h2>
          <p className="text-muted-foreground mb-8">
            Access filters, analytics, and detailed notes by authenticating your account.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/auth/signin">Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Create account</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 bg-muted/40">
      <div className="container px-4 py-16 space-y-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">TradePlan</p>
          <h1 className="text-4xl font-bold tracking-tight mt-3">{t("tradePlans.list.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("tradePlans.list.caption")}</p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TradePlanFilters
            query={query}
            onQueryChange={setQuery}
            strategy={strategy}
            onStrategyChange={setStrategy}
            status={status}
            onStatusChange={setStatus}
            market={market}
            onMarketChange={setMarket}
            riskLevel={riskLevel}
            onRiskLevelChange={setRiskLevel}
            sort={sort}
            onSortChange={setSort}
          />
          <Button asChild size="lg" className="self-end lg:self-auto">
            <Link href="/dashboard/trade-plan/new">+ New Trade Plan</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : plans.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <TradePlanCard key={plan.id} plan={plan} showOwner={Boolean(isAdmin)} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-background/60 p-12 text-center">
            <p className="text-lg font-medium mb-2">{t("tradePlans.preview.empty")}</p>
            <p className="text-muted-foreground mb-6">
              Try adjusting the filters or create a new Trade Plan to populate this list.
            </p>
            <Button asChild>
              <Link href="/dashboard/trade-plan/new">Create Trade Plan</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

