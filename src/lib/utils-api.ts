import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiRateLimit } from "./rate-limit";

/**
 * Wrapper for API routes with authentication and rate limiting
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!apiRateLimit.check(100, ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request, session.user.id);
  } catch (error) {
    console.error("API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Add cache headers to response
 */
export function addCacheHeaders(
  response: NextResponse,
  maxAge: number = 60,
  staleWhileRevalidate: number = 120
): NextResponse {
  response.headers.set(
    "Cache-Control",
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  );
  return response;
}

