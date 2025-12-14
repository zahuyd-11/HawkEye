import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";
import { TradePlanForm } from "@/components/trade-plans/trade-plan-form";

export default function NewTradePlanPage() {
  return (
    <>
      <main className="container max-w-3xl px-4 py-8">
        <Link href="/dashboard/trade-plan">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trade Plans
          </Button>
        </Link>
        <TradePlanForm mode="create" />
      </main>
      <Footer />
    </>
  );
}
