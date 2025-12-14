import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TradePlanExplorer } from "@/components/trade-plans/trade-plan-explorer";

export default function TradePlanPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <TradePlanExplorer />
      <Footer />
    </div>
  );
}

