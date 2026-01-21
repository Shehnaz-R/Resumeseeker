// scripts/seed-user.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.userSignupData.create({
      data: {
        location: "Mumbai",
        skills: ["React", "Node.js"],
        preferredJobTypes: ["full_time", "remote"],
        preferredLocations: ["Pune", "Mumbai"],
        remotePreference: "hybrid",
      },
    });
    console.log("✅ User created:", user);
  } catch (error) {
    console.error("❌ Error inserting user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
