import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await request.json();

    if (!tier || !["PLUS", "PRO"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const priceId =
      tier === "PLUS"
        ? process.env.STRIPE_PLUS_PRICE_ID
        : process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID not configured" },
        { status: 500 }
      );
    }

    // TODO: Create or get Stripe customer
    // For now, return a placeholder
    return NextResponse.json({
      url: "/dashboard/subscription?success=true",
      message: "Stripe integration pending",
    });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

