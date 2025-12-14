"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { macroStats, formatMacroValue, formatMacroPercent } from "@/data/mock-macro-data";

export function MacroTicker() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {macroStats.map((stat) => {
          const isPositive = stat.changePercent > 0;
          const isNegative = stat.changePercent < 0;
          const isNeutral = stat.changePercent === 0;

          // Special handling for USD - red if UP (negative for stock market)
          const showWarning = stat.id === "usd" && isPositive;

          return (
            <Tooltip key={stat.id}>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-md transition-shadow cursor-help">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-muted-foreground">{stat.name}</p>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </div>
                      {isPositive && !showWarning && (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      )}
                      {isNegative && (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      {isNeutral && <Minus className="h-4 w-4 text-gray-500" />}
                      {showWarning && (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-bold mb-1">
                        {formatMacroValue(stat.value, stat.id === "vnindex" ? 1 : stat.id === "usd" ? 0 : 1)}{" "}
                        <span className="text-sm text-muted-foreground">{stat.unit}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            showWarning
                              ? "text-red-600 dark:text-red-400"
                              : isPositive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isNegative
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {formatMacroPercent(stat.changePercent)}
                        </span>
                        {stat.change !== 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({stat.change > 0 ? "+" : ""}
                            {formatMacroValue(stat.change, stat.id === "usd" ? 0 : 1)})
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{stat.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

