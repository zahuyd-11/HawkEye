import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/community/posts/[id]/comments
 * Create a comment on a post
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const postId = resolvedParams.id;
    const body = await request.json();
    const { content, authorId, authorName } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // For demo: Allow guest comments or use provided authorId
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

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
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
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

