import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiService } from "@/lib/ai";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, contentType } = body;

    if (!content || !contentType) {
      return NextResponse.json(
        { error: "Content and contentType are required" },
        { status: 400 }
      );
    }

    // Get user preferences from database (you can extend this)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    // Get user's subscription tier for personalization
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { tier: true },
    });

    // Personalize content
    const personalizedContent = await aiService.personalizeContent({
      userId: session.user.id,
      context: content,
      contentType: contentType as "deal-digest" | "micro-research" | "trade-plan" | "general",
      userPreferences: {
        // You can add user preferences to the User model
        riskTolerance: "medium", // Default, can be customized
        investmentStyle: "balanced",
      },
    });

    return NextResponse.json({
      originalContent: content,
      personalizedContent,
      tier: subscription?.tier || "FREE",
    });
  } catch (error: unknown) {
    console.error("AI personalization error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

