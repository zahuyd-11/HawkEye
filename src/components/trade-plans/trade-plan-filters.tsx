"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/components/providers/language-provider";

export type DateSortOption = "created_desc" | "created_asc" | "updated_desc" | "updated_asc";

interface TradePlanFiltersProps {
  query: string;
  onQueryChange: (_value: string) => void;
  strategy: string;
  onStrategyChange: (_value: string) => void;
  status: string;
  onStatusChange: (_value: string) => void;
  market: string;
  onMarketChange: (_value: string) => void;
  riskLevel: string;
  onRiskLevelChange: (_value: string) => void;
  sort: DateSortOption;
  onSortChange: (_value: DateSortOption) => void;
}

const strategyOptions = ["Breakout", "Swing", "Trend Follow", "News-based"];
const marketOptions = ["stocks", "crypto", "etf", "forex"];
const riskOptions = ["low", "medium", "high"];
const statusOptions = ["draft", "active", "closed"];

export function TradePlanFilters({
  query,
  onQueryChange,
  strategy,
  onStrategyChange,
  status,
  onStatusChange,
  market,
  onMarketChange,
  riskLevel,
  onRiskLevelChange,
  sort,
  onSortChange,
}: TradePlanFiltersProps) {
  const { t } = useLanguage();
  const sentinel = "all";

  const withSentinel = (value: string) => (value ? value : sentinel);
  const normalize = (value: string) => (value === sentinel ? "" : value);

  return (
    <div className="grid gap-4 rounded-2xl border bg-card/60 p-4 shadow-sm md:grid-cols-2 lg:grid-cols-3">
      <Input
        placeholder={t("tradePlans.search.placeholder")}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Select value={withSentinel(strategy)} onValueChange={(value) => onStrategyChange(normalize(value))}>
        <SelectTrigger>
          <SelectValue placeholder={t("tradePlans.filters.strategy")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={sentinel}>All strategies</SelectItem>
          {strategyOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={withSentinel(status)} onValueChange={(value) => onStatusChange(normalize(value))}>
        <SelectTrigger>
          <SelectValue placeholder={t("tradePlans.filters.status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={sentinel}>All statuses</SelectItem>
          {statusOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={withSentinel(market)} onValueChange={(value) => onMarketChange(normalize(value))}>
        <SelectTrigger>
          <SelectValue placeholder={t("tradePlans.filters.market")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={sentinel}>All markets</SelectItem>
          {marketOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={withSentinel(riskLevel)} onValueChange={(value) => onRiskLevelChange(normalize(value))}>
        <SelectTrigger>
          <SelectValue placeholder={t("tradePlans.filters.risk")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={sentinel}>All risk levels</SelectItem>
          {riskOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={(value: DateSortOption) => onSortChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder={t("tradePlans.filters.updated")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated_desc">{t("tradePlans.filters.updated")} ↓</SelectItem>
          <SelectItem value="updated_asc">{t("tradePlans.filters.updated")} ↑</SelectItem>
          <SelectItem value="created_desc">{t("tradePlans.filters.created")} ↓</SelectItem>
          <SelectItem value="created_asc">{t("tradePlans.filters.created")} ↑</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

