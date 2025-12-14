import { NextResponse } from "next/server";
// Authentication check removed - allowing access without login
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check removed - allowing access without login
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userId = session.user.id;

    const microResearch = await prisma.microResearch.findUnique({
      where: { id: params.id },
    });

    if (!microResearch) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Skip recording view when not authenticated
    // await prisma.microResearchView.upsert({
    //   where: {
    //     userId_microResearchId: {
    //       userId,
    //       microResearchId: params.id,
    //     },
    //   },
    //   create: {
    //     userId,
    //     microResearchId: params.id,
    //   },
    //   update: {
    //     viewedAt: new Date(),
    //   },
    // });

    return NextResponse.json(microResearch);
  } catch (error: unknown) {
    console.error("Micro Research detail error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
