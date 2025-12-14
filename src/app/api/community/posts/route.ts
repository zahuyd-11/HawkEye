import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/community/posts
 * Get all approved posts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "APPROVED"; // Default to approved only

    const posts = await prisma.post.findMany({
      where: {
        status: status as "PENDING" | "APPROVED" | "REJECTED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return empty array if no posts (graceful handling)
    return NextResponse.json(posts || []);
  } catch (error) {
    console.error("Error fetching posts:", error);
    // Return empty array on error instead of error message for graceful degradation
    return NextResponse.json([]);
  }
}

/**
 * POST /api/community/posts
 * Create a new post (status = APPROVED for demo purposes)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, authorId, authorName } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // For demo: Allow guest posts or use provided authorId
    let userId = authorId;
    if (!userId) {
      // Create or find a guest user
      const guestUser = await prisma.user.upsert({
        where: { email: `guest-${Date.now()}@hawkeye.local` },
        update: {},
        create: {
          email: `guest-${Date.now()}@hawkeye.local`,
          name: authorName || "Guest User",
        },
      });
      userId = guestUser.id;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
        status: "APPROVED", // For demo: Auto-approve posts
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

