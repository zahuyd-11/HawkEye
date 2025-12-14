"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TradePlanCard } from "./trade-plan-card";
import { TradePlanSummary } from "@/types/trade-plan";
import { useLanguage } from "@/components/providers/language-provider";

export function TradePlanPreview() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<TradePlanSummary[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/trade-plan?limit=3&sort=updated_desc")
      .then(async (response) => {
        if (response.status === 401) {
          return [];
        }

        if (!response.ok) {
          throw new Error("Failed to fetch trade plans");
        }
        return response.json();
      })
      .then((data) => {
        if (mounted) {
          setPlans(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (mounted) {
          setPlans([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPlans = useMemo(() => {
    if (!query) return plans;
    return plans.filter((plan) => {
      const target = `${plan.name} ${plan.ticker}`.toLowerCase();
      return target.includes(query.toLowerCase());
    });
  }, [plans, query]);

  return (
    <section className="container px-4 py-16">
      <Card className="rounded-3xl border bg-card/70 p-8 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">TradePlan</p>
            <h2 className="text-3xl font-bold mt-2">{t("tradePlans.preview.heading")}</h2>
            <p className="text-muted-foreground mt-2">{t("tradePlans.preview.description")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:w-72">
            <Input
              placeholder={t("tradePlans.search.placeholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="flex gap-3">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/trade-plan">{t("tradePlans.preview.viewAll")}</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard/trade-plan/new">+ New</Link>
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading plans...</p>
        ) : filteredPlans.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {filteredPlans.map((plan) => (
              <TradePlanCard key={plan.id} plan={plan} condensed />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
            {t("tradePlans.preview.empty")}
          </div>
        )}
      </Card>
    </section>
  );
}

