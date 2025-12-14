import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await prisma.tradePlan.findUnique({ where: { id: params.id } });
    if (!plan) {
      return NextResponse.json({ error: "Trade plan not found" }, { status: 404 });
    }

    const { id: userId, role } = session.user;

    if (plan.userId !== userId && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const duplicate = await prisma.tradePlan.create({
      data: {
        userId: plan.userId,
        name: `${plan.name} (Copy)`,
        ticker: plan.ticker,
        strategy: plan.strategy,
        strategyType: plan.strategyType,
        market: plan.market,
        riskLevel: plan.riskLevel,
        entryPrice: plan.entryPrice,
        exitPrice: plan.exitPrice,
        targetPrice: plan.targetPrice,
        stopLoss: plan.stopLoss,
        positionSize: plan.positionSize,
        riskRewardRatio: plan.riskRewardRatio,
        thesis: plan.thesis,
        notes: plan.notes,
        status: "draft",
      },
    });

    return NextResponse.json(duplicate, { status: 201 });
  } catch (error: unknown) {
    console.error("TradePlan duplicate error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

