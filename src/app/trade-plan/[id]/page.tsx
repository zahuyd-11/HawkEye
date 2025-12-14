import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TradePlanDetail } from "@/components/trade-plans/trade-plan-detail";
import { prisma } from "@/lib/db";
// Authentication check removed - allowing access without login
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { TradePlanSummary } from "@/types/trade-plan";

export default async function TradePlanDetailPage({ params }: { params: { id: string } }) {
  // Authentication check removed - allowing access without login
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.id) {
  //   redirect(`/auth/signin?callbackUrl=/trade-plan/${params.id}`);
  // }

  const plan = await prisma.tradePlan.findUnique({
    where: { id: params.id },
  });

  if (!plan) {
    notFound();
  }

  // Authentication check removed - allowing access without login
  // const { id: userId, role } = session.user;

  // if (plan.userId !== userId && role !== "ADMIN") {
  //   notFound();
  // }

  const serializedPlan: TradePlanSummary = {
    ...plan,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    flaggedAt: plan.flaggedAt ? plan.flaggedAt.toISOString() : null,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/40">
        <section className="container px-4 py-16">
          <TradePlanDetail plan={serializedPlan} isAdmin={false} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

