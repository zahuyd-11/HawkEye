import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const plan = await prisma.tradePlan.findUnique({ where: { id: params.id } });
    if (!plan) {
      return NextResponse.json({ error: "Trade plan not found" }, { status: 404 });
    }

    const { flagged, reason } = (await request.json()) as { flagged?: boolean; reason?: string };
    if (typeof flagged !== "boolean") {
      return NextResponse.json({ error: "Flagged state is required" }, { status: 400 });
    }

    const updatedPlan = await prisma.tradePlan.update({
      where: { id: params.id },
      data: {
        flagged,
        flaggedReason: reason || null,
        flaggedById: flagged ? session.user.id : null,
        flaggedAt: flagged ? new Date() : null,
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error: unknown) {
    console.error("TradePlan flag error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

