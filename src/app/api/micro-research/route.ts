import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Cache for 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const microResearch = await prisma.microResearch.findMany({
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
        title: true,
        ticker: true,
        companyName: true,
        sector: true,
        industry: true,
        marketCap: true,
        content: true,
        tags: true,
        publishedAt: true,
      },
      // Limit results for performance
      take: 100,
    });

    // Create excerpt from content (optimize by doing it in the query if possible)
    const researchWithExcerpt = microResearch.map((item: {
      id: string;
      title: string;
      ticker: string | null;
      companyName: string | null;
      sector: string | null;
      industry: string | null;
      marketCap: string | null;
      content: string;
      tags: string[];
      publishedAt: Date | null;
    }) => ({
      ...item,
      excerpt: item.content.substring(0, 150) + (item.content.length > 150 ? "..." : ""),
      // Don't send full content in list view
      content: undefined as unknown as string,
    }));

    const response = NextResponse.json(researchWithExcerpt);
    
    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );

    return response;
  } catch (error: unknown) {
    console.error("Micro Research list error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

