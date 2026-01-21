const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Default User
  const userId = "fdb29651-d898-4321-9d27-a3c918a53c9b"; // User ID from console output
  const defaultUser = {
    id: userId,
    email: "test@example.com",
    name: "Test User",
    password: "$2a$10$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUV0123456789", // Placeholder for a hashed password
  };

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    await prisma.user.create({ data: defaultUser });
    console.log(`Created default user with ID: ${userId}`);
  } else {
    console.log(`Default user with ID: ${userId} already exists.`);
  }

  // 2️⃣ ResumeTemplate
  const templates = [
    { name: 'Professional', description: 'A clean, professional template', previewImageUrl: '/templates/professional.png', isDefault: true },
    { name: 'Creative', description: 'Colorful template for creative industries', previewImageUrl: '/templates/creative.png', isDefault: false },
    { name: 'Academic', description: 'Formal template for research positions', previewImageUrl: '/templates/academic.png', isDefault: false },
  ];
  for (const template of templates) {
    const existingTemplate = await prisma.resumeTemplate.findUnique({ where: { name: template.name } });
    if (!existingTemplate) await prisma.resumeTemplate.create({ data: template });
  }

  console.log('Database seeded with essential data successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
