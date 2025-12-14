import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id } = await Promise.resolve(params);
    const plan = await prisma.tradePlan.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Trade plan not found" }, { status: 404 });
    }

    // Authentication check removed - allowing access without login
    // const { id: userId, role } = session.user;

    // if (plan.userId !== userId && role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    return NextResponse.json(plan);
  } catch (error: unknown) {
    console.error("TradePlan detail error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id } = await Promise.resolve(params);
    const plan = await prisma.tradePlan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: "Trade plan not found" }, { status: 404 });
    }

    // Authentication check removed - allowing access without login
    // const { id: userId, role } = session.user;

    // if (plan.userId !== userId && role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }
    const userId = null; // No user ID when not authenticated
    const role = null; // No role when not authenticated

    const body = (await request.json()) as {
      name?: string;
      ticker?: string | null;
      strategy?: string | null;
      strategyType?: string | null;
      market?: string | null;
      riskLevel?: string | null;
      entryPrice?: number | string | null;
      exitPrice?: number | string | null;
      stopLoss?: number | string | null;
      targetPrice?: number | string | null;
      positionSize?: number | string | null;
      thesis?: string | null;
      notes?: string | null;
      status?: string;
      flagged?: boolean;
      flaggedReason?: string | null;
    };
    const entryPrice = toNumberOrNull(body.entryPrice ?? plan.entryPrice);
    const exitPrice = toNumberOrNull(body.exitPrice ?? plan.exitPrice);
    const stopLoss = toNumberOrNull(body.stopLoss ?? plan.stopLoss);
    const targetPrice = toNumberOrNull(body.targetPrice ?? body.exitPrice ?? plan.targetPrice);
    const positionSize = toNumberOrNull(body.positionSize ?? plan.positionSize);

    const isAdmin = false; // No admin access when not authenticated

    const updatedPlan = await prisma.tradePlan.update({
      where: { id },
      data: {
        name: body.name ?? plan.name,
        ticker: body.ticker ?? plan.ticker,
        strategy: body.strategy ?? plan.strategy,
        strategyType: body.strategyType ?? body.strategy ?? plan.strategyType,
        market: body.market ? body.market.toLowerCase() : plan.market,
        riskLevel: body.riskLevel ? body.riskLevel.toLowerCase() : plan.riskLevel,
        entryPrice,
        exitPrice,
        targetPrice,
        stopLoss,
        positionSize,
        thesis: body.thesis ?? plan.thesis,
        notes: body.notes ?? plan.notes,
        status: body.status ? body.status.toLowerCase() : plan.status,
        riskRewardRatio: calculateRiskRewardRatio(entryPrice, exitPrice, stopLoss),
        ...(isAdmin
          ? {
              flagged: typeof body.flagged === "boolean" ? body.flagged : plan.flagged,
              flaggedReason: body.flaggedReason ?? plan.flaggedReason,
              flaggedAt:
                typeof body.flagged === "boolean"
                  ? body.flagged
                    ? new Date()
                    : null
                  : plan.flaggedAt,
              flaggedById: typeof body.flagged === "boolean" ? (body.flagged ? userId : null) : plan.flaggedById,
            }
          : {}),
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error: unknown) {
    console.error("TradePlan update error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id } = await Promise.resolve(params);
    const plan = await prisma.tradePlan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: "Trade plan not found" }, { status: 404 });
    }

    // Authentication check removed - allowing access without login
    // const { id: userId, role } = session.user;

    // if (plan.userId !== userId && role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    await prisma.tradePlan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("TradePlan delete error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateRiskRewardRatio(entry?: number | null, exit?: number | null, stopLoss?: number | null) {
  if (!entry || !exit || !stopLoss) {
    return null;
  }

  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(exit - entry);
  return risk > 0 ? reward / risk : null;
}

