import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@hawkeye.com" },
    update: {},
    create: {
      email: "admin@hawkeye.com",
      name: "Admin User",
      password: "$2a$10$rOzJqRqJqRqJqRqJqRqJqO", // password: admin123 (hash này cần được generate đúng)
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create sample subscription
  await prisma.subscription.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      tier: "PRO",
      status: "active",
    },
  });

  console.log("✅ Created admin subscription");

  // Create sample DealDigest
  const dealDigest = await prisma.dealDigest.create({
    data: {
      ticker: "VCB",
      companyName: "Vietcombank",
      sector: "Financial Services",
      industry: "Banking",
      marketCap: "Large Cap",
      riskScore: 6,
      businessOverview: "Vietcombank is one of the largest banks in Vietnam...",
      financialHealth: "Strong financial position with good capital adequacy...",
      growthCatalysts: "Digital transformation, expanding customer base...",
      riskFactors: "Regulatory changes, economic downturn...",
      publishedAt: new Date(),
    },
  });

  console.log("✅ Created sample DealDigest:", dealDigest.ticker);

  // Create sample Micro Research
  await prisma.microResearch.create({
    data: {
      title: "Vietcombank Q4 2024 Analysis",
      ticker: "VCB",
      companyName: "Vietcombank",
      sector: "Financial Services",
      industry: "Banking",
      marketCap: "Large Cap",
      content: "Vietcombank continues to show strong performance...",
      tags: "banking, finance, vietnam", // SQLite: Store as comma-separated string
      publishedAt: new Date(),
    },
  });

  console.log("✅ Created sample Micro Research");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

