"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { pricingFeatures, tierNames, type Tier } from "@/data/pricing-data";

export function PricingComparison() {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatFeatureValue = (value: string | boolean): { display: string; isAvailable: boolean } => {
    if (typeof value === "boolean") {
      return {
        display: value ? "Có" : "Không",
        isAvailable: value,
      };
    }
    return {
      display: value,
      isAvailable: value !== false && value !== "Không" && !value.includes("❌"),
    };
  };

  const tiers: Tier[] = ["FREE", "MINI", "PLUS", "PRO"];

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>So sánh Tính năng</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Mở rộng
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-sm">Tính năng</th>
                  {tiers.map((tier) => (
                    <th
                      key={tier}
                      className={`text-center p-4 font-semibold text-sm ${
                        tier === "PLUS" ? "bg-primary/10" : ""
                      }`}
                    >
                      {tierNames[tier]}
                      {tier === "PLUS" && (
                        <span className="block text-xs text-primary font-normal mt-1">Phổ biến</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingFeatures.map((row, index) => (
                  <tr
                    key={row.feature.id}
                    className={`border-b border-border ${index % 2 === 0 ? "bg-muted/30" : ""}`}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-sm">{row.feature.name}</p>
                        {row.feature.description && (
                          <p className="text-xs text-muted-foreground mt-1">{row.feature.description}</p>
                        )}
                      </div>
                    </td>
                    {tiers.map((tier) => {
                      const tierData = row.tiers[tier];
                      const { display, isAvailable } = formatFeatureValue(tierData.value);
                      const isHighlighted = tier === "PLUS";

                      return (
                        <td
                          key={tier}
                          className={`text-center p-4 ${isHighlighted ? "bg-primary/5" : ""}`}
                        >
                          {typeof tierData.value === "boolean" ? (
                            <div className="flex justify-center">
                              {isAvailable ? (
                                <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`text-sm font-medium ${
                                  tierData.highlight ? "text-primary font-semibold" : ""
                                }`}
                              >
                                {display}
                              </span>
                              {tierData.highlight && (
                                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

