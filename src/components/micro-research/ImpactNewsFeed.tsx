"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { impactNews, economicEvents, type NewsEvent, type EconomicEvent } from "@/data/mock-macro-data";

export function ImpactNewsFeed() {
  const getImpactBadge = (impact: NewsEvent["impact"]) => {
    switch (impact) {
      case "POSITIVE":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/50">
            <TrendingUp className="h-3 w-3 mr-1" />
            TÁC ĐỘNG: TÍCH CỰC
          </Badge>
        );
      case "NEGATIVE":
        return (
          <Badge className="bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50">
            <TrendingDown className="h-3 w-3 mr-1" />
            TÁC ĐỘNG: TIÊU CỰC
          </Badge>
        );
      case "NEUTRAL":
        return (
          <Badge className="bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50">
            <Minus className="h-3 w-3 mr-1" />
            TÁC ĐỘNG: TRUNG LẬP
          </Badge>
        );
    }
  };

  const getImportanceBadge = (importance: EconomicEvent["importance"]) => {
    switch (importance) {
      case "HIGH":
        return (
          <Badge variant="destructive" className="text-xs">
            Quan trọng
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="outline" className="text-xs">
            Trung bình
          </Badge>
        );
      case "LOW":
        return (
          <Badge variant="secondary" className="text-xs">
            Thấp
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
  };

  return (
    <div className="space-y-6">
      {/* Economic Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lịch Kinh tế
          </CardTitle>
          <CardDescription>Sự kiện kinh tế sắp tới</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {economicEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {formatDate(event.date).split(" ")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.date).split(" ")[1]}</p>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm">{event.title}</p>
                    {getImportanceBadge(event.importance)}
                  </div>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact News Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Tin tức Tác động</CardTitle>
          <CardDescription>Tin tức ảnh hưởng đến thị trường</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactNews.map((news) => (
              <div key={news.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{news.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{news.description}</p>
                  </div>
                  {getImpactBadge(news.impact)}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(news.date)}</span>
                  <span>•</span>
                  <span>{news.category}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

