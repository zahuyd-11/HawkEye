/**
 * Seed script for Community Posts
 * Run with: npx ts-node prisma/seed-community.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding community posts...");

  // Create or get users for the posts
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "minhtuan@hawkeye.local" },
      update: {},
      create: {
        email: "minhtuan@hawkeye.local",
        name: "Minh Tuấn (Pro Investor)",
      },
    }),
    prisma.user.upsert({
      where: { email: "namnguyen@hawkeye.local" },
      update: {},
      create: {
        email: "namnguyen@hawkeye.local",
        name: "Nam Nguyễn",
      },
    }),
    prisma.user.upsert({
      where: { email: "huongly@hawkeye.local" },
      update: {},
      create: {
        email: "huongly@hawkeye.local",
        name: "Hương Ly",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@hawkeye.local" },
      update: {},
      create: {
        email: "admin@hawkeye.local",
        name: "Admin HawkEye",
        role: "ADMIN",
      },
    }),
  ]);

  // Create posts with likes
  const posts = [
    {
      title: "Góc nhìn HPG: Tại sao Dung Quất 2 là game changer?",
      content: "Mình vừa xem DealDigest, định giá HPG đang rẻ 20%. Với tiến độ Dung Quất 2 đạt 80%, mình tin rằng Q3/2025 lợi nhuận sẽ bùng nổ. Anh em nghĩ sao?",
      authorId: users[0].id,
      status: "APPROVED" as const,
      likes: 45,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      title: "Tỷ giá USD tăng ghê quá, có nên bán hết cổ phiếu không?",
      content: "Xem bên MicroResearch thấy báo động đỏ tỷ giá. Mình đang cầm full cổ phiếu, lo quá. Có ai hạ tỷ trọng chưa?",
      authorId: users[1].id,
      status: "APPROVED" as const,
      likes: 12,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      title: "Vừa test TradePlan, ra profile 'Cân bằng'. Chuẩn phết!",
      content: "Trước giờ cứ mua bán loạn xạ. Nay HawkEye bảo chỉ nên dành 50% cho cổ phiếu thôi. Kỷ luật lại mới được.",
      authorId: users[2].id,
      status: "APPROVED" as const,
      likes: 28,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      title: "Ngân hàng nhà nước hút tín phiếu phiên thứ 3 liên tiếp",
      content: "Anh em cẩn thận củi lửa, dòng tiền đang bị rút bớt. Nhóm chứng khoán, bất động sản khả năng sẽ chỉnh.",
      authorId: users[3].id,
      status: "APPROVED" as const,
      likes: 156,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  ];

  // Create posts and likes
  for (const postData of posts) {
    const { likes, ...postCreateData } = postData;
    
    // Check if post already exists
    const existingPost = await prisma.post.findFirst({
      where: {
        title: postData.title,
        authorId: postData.authorId,
      },
    });

    if (existingPost) {
      console.log(`⏭️  Post "${postData.title}" already exists, skipping...`);
      continue;
    }

    const post = await prisma.post.create({
      data: postCreateData,
    });

    // Create likes (using guest users)
    for (let i = 0; i < likes; i++) {
      const guestUser = await prisma.user.upsert({
        where: { email: `guest-like-${post.id}-${i}@hawkeye.local` },
        update: {},
        create: {
          email: `guest-like-${post.id}-${i}@hawkeye.local`,
          name: `Guest ${i + 1}`,
        },
      });

      await prisma.like.upsert({
        where: {
          postId_userId: {
            postId: post.id,
            userId: guestUser.id,
          },
        },
        update: {},
        create: {
          postId: post.id,
          userId: guestUser.id,
        },
      });
    }

    console.log(`✅ Created post: "${post.title}" with ${likes} likes`);
  }

  console.log("✨ Community seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding community:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

