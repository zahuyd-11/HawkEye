import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userId = session.user.id;

    // Return FREE tier when not authenticated
    // const subscription = await prisma.subscription.findUnique({
    //   where: { userId },
    // });

    // if (!subscription) {
    return NextResponse.json({ tier: "FREE", status: "active" });
    // }

    return NextResponse.json({
      tier: subscription.tier,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error: unknown) {
    console.error("Subscription get error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

