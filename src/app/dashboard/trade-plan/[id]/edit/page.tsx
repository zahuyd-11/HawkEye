import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";
import { TradePlanForm } from "@/components/trade-plans/trade-plan-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export default async function EditTradePlanPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const plan = await prisma.tradePlan.findUnique({
    where: { id: params.id },
  });

  if (!plan) {
    notFound();
  }

  const { id: userId, role } = session.user;

  if (plan.userId !== userId && role !== "ADMIN") {
    notFound();
  }

  const initialValues = {
    name: plan.name,
    ticker: plan.ticker ?? "",
    strategy: plan.strategy ?? "",
    strategyType: plan.strategyType ?? "",
    market: plan.market ?? "",
    riskLevel: plan.riskLevel ?? "",
    entryPrice: stringify(plan.entryPrice),
    exitPrice: stringify(plan.exitPrice),
    targetPrice: stringify(plan.targetPrice),
    stopLoss: stringify(plan.stopLoss),
    positionSize: stringify(plan.positionSize),
    thesis: plan.thesis ?? "",
    notes: plan.notes ?? "",
    status: plan.status,
  };

  return (
    <>
      <main className="container max-w-3xl px-4 py-8">
        <Link href={`/trade-plan/${plan.id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to plan detail
          </Button>
        </Link>
        <TradePlanForm mode="edit" planId={plan.id} initialValues={initialValues} />
      </main>
      <Footer />
    </>
  );
}

function stringify(value?: number | null) {
  return typeof value === "number" ? value.toString() : "";
}

