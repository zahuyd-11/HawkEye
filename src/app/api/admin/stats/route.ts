import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalUsers, activeSubscriptions, dealDigests, microResearch] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: {
          status: "active",
          tier: {
            in: ["PLUS", "PRO"],
          },
        },
      }),
      prisma.dealDigest.count(),
      prisma.microResearch.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      activeSubscriptions,
      dealDigests,
      microResearch,
    });
  } catch (error: unknown) {
    console.error("Admin stats error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

