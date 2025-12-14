import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Cache for 60 seconds (ISR)
export const revalidate = 60;

export async function GET() {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const dealDigests = await prisma.dealDigest.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        ticker: true,
        companyName: true,
        sector: true,
        industry: true,
        marketCap: true,
        riskScore: true,
        publishedAt: true,
      },
      // Limit results for performance
      take: 100,
    });

    const response = NextResponse.json(dealDigests);
    
    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error: unknown) {
    console.error("DealDigest list error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

