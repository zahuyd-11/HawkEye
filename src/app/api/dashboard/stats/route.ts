import { NextResponse } from "next/server";
// Authentication check removed - allowing access without login
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userId = session.user.id;

    // Return empty stats when not authenticated
    const [watchlistCount, recentDealDigests, recentMicroResearch, riskAlerts] = await Promise.all([
      Promise.resolve(0), // watchlistCount
      Promise.resolve(0), // recentDealDigests
      Promise.resolve(0), // recentMicroResearch
      prisma.riskAlert.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return NextResponse.json({
      watchlistCount,
      recentDealDigests,
      recentMicroResearch,
      riskAlerts,
    });
  } catch (error: unknown) {
    console.error("Dashboard stats error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
