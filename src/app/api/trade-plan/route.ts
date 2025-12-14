import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userId = session.user.id;
    // const role = session.user.role;
    // const isAdmin = role === "ADMIN";
    const userId = null; // No user ID when not authenticated
    const isAdmin = false; // No admin access when not authenticated
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get("scope");
    const query = searchParams.get("query");
    const strategyType = searchParams.get("strategyType") || searchParams.get("strategy");
    const status = searchParams.get("status");
    const market = searchParams.get("market");
    const riskLevel = searchParams.get("riskLevel");
    const createdFrom = searchParams.get("createdFrom");
    const createdTo = searchParams.get("createdTo");
    const updatedFrom = searchParams.get("updatedFrom");
    const updatedTo = searchParams.get("updatedTo");
    const limit = parseInt(searchParams.get("limit") || "0", 10);
    const sort = searchParams.get("sort") || "updated_desc";

    const where: Prisma.TradePlanWhereInput = {};
    const andConditions: Prisma.TradePlanWhereInput[] = [];
    const orConditions: Prisma.TradePlanWhereInput[] = [];

    // Show all trade plans when not authenticated
    // if (!(isAdmin && scope === "all")) {
    //   where.userId = userId;
    // }

    if (query) {
      orConditions.push(
        { name: { contains: query, mode: "insensitive" } },
        { ticker: { contains: query, mode: "insensitive" } },
        { notes: { contains: query, mode: "insensitive" } }
      );
    }

    if (strategyType) {
      andConditions.push({
        OR: [
          { strategy: { equals: strategyType, mode: "insensitive" } },
          { strategyType: { equals: strategyType, mode: "insensitive" } },
        ],
      });
    }

    if (status) {
      andConditions.push({
        status: { equals: status.toLowerCase() },
      });
    }

    if (market) {
      andConditions.push({
        market: { equals: market.toLowerCase() },
      });
    }

    if (riskLevel) {
      andConditions.push({
        riskLevel: { equals: riskLevel.toLowerCase() },
      });
    }

    if (createdFrom || createdTo) {
      andConditions.push({
        createdAt: {
          ...(createdFrom ? { gte: new Date(createdFrom) } : {}),
          ...(createdTo ? { lte: new Date(createdTo) } : {}),
        },
      });
    }

    if (updatedFrom || updatedTo) {
      andConditions.push({
        updatedAt: {
          ...(updatedFrom ? { gte: new Date(updatedFrom) } : {}),
          ...(updatedTo ? { lte: new Date(updatedTo) } : {}),
        },
      });
    }

    if (orConditions.length) {
      where.OR = orConditions;
    }

    if (andConditions.length) {
      where.AND = andConditions;
    }

    let orderBy: Prisma.TradePlanOrderByWithRelationInput = { updatedAt: "desc" };
    if (sort === "updated_asc") {
      orderBy = { updatedAt: "asc" };
    } else if (sort === "created_desc") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "created_asc") {
      orderBy = { createdAt: "asc" };
    }

    const tradePlans = await prisma.tradePlan.findMany({
      where,
      orderBy,
      take: limit > 0 ? limit : undefined,
      include: isAdmin && scope === "all" ? { user: { select: { id: true, name: true, email: true } } } : undefined,
    });

    return NextResponse.json(tradePlans);
  } catch (error: unknown) {
    console.error("TradePlan list error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userId = session.user.id;
    // For POST requests, we need a userId. Using a placeholder or returning error
    // Since we can't create without a user, we'll return an error
    return NextResponse.json({ error: "User authentication required to create trade plans" }, { status: 401 });
    const data = (await request.json()) as {
      name: string;
      ticker?: string;
      strategy?: string;
      strategyType?: string;
      market?: string;
      riskLevel?: string;
      entryPrice?: number | string | null;
      exitPrice?: number | string | null;
      stopLoss?: number | string | null;
      targetPrice?: number | string | null;
      positionSize?: number | string | null;
      thesis?: string;
      notes?: string;
      status?: string;
    };

    const entryPrice = toNumberOrNull(data.entryPrice);
    const exitPrice = toNumberOrNull(data.exitPrice);
    const stopLoss = toNumberOrNull(data.stopLoss);
    const targetPrice = toNumberOrNull(data.targetPrice) ?? exitPrice;
    const positionSize = toNumberOrNull(data.positionSize);

    const tradePlan = await prisma.tradePlan.create({
      data: {
        userId,
        name: data.name,
        ticker: data.ticker || null,
        strategy: data.strategy || null,
        strategyType: data.strategyType || data.strategy || null,
        market: data.market ? data.market.toLowerCase() : null,
        riskLevel: data.riskLevel ? data.riskLevel.toLowerCase() : null,
        entryPrice,
        exitPrice,
        targetPrice,
        stopLoss,
        positionSize,
        riskRewardRatio: calculateRiskRewardRatio(entryPrice, exitPrice, stopLoss),
        thesis: data.thesis || null,
        notes: data.notes || null,
        status: data.status ? data.status.toLowerCase() : "draft",
      },
    });

    return NextResponse.json(tradePlan, { status: 201 });
  } catch (error: unknown) {
    console.error("TradePlan create error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

function calculateRiskRewardRatio(entry?: number | null, exit?: number | null, stopLoss?: number | null) {
  if (!entry || !exit || !stopLoss) {
    return null;
  }

  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(exit - entry);
  return risk > 0 ? reward / risk : null;
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

