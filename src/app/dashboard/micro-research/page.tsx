"use client";

import { Footer } from "@/components/layout/footer";
import { MacroTicker } from "@/components/micro-research/MacroTicker";
import { MacroChart } from "@/components/micro-research/MacroChart";
import { ImpactNewsFeed } from "@/components/micro-research/ImpactNewsFeed";

export default function MicroResearchPage() {
  return (
    <>
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Macro Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi các chỉ số vĩ mô và tin tức tác động đến thị trường
          </p>
        </div>

        {/* Zone 1: Macro Ticker (Top Bar) */}
        <MacroTicker />

        {/* Zone 2 & 3: Chart and News Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
          {/* Zone 2: Correlation Chart (Left Column - 65% Width) */}
          <MacroChart />

          {/* Zone 3: Smart News & Calendar (Right Column - 35% Width) */}
          <ImpactNewsFeed />
        </div>
      </main>
      <Footer />
    </>
  );
}
