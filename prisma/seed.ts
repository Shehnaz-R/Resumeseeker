import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create a default user if no users exist
    const existingUser = await prisma.user.findUnique({
        where: { id: "fdb29651-d898-4321-9d27-a3c918a53c9b" },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                id: "fdb29651-d898-4321-9d27-a3c918a53c9b",
                email: "test@example.com",
                name: "Test User",
                password: "$2a$10$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUV0123456789", // Placeholder for a hashed password
            },
        });
        console.log("Created default user with ID: fdb29651-d898-4321-9d27-a3c918a53c9b");
    } else {
        console.log("Default user already exists.");
    }

    // Create sample resume templates
    const templates = [
        {
            name: 'Professional',
            description: 'A clean, professional template suitable for corporate environments',
            previewImageUrl: '/templates/professional-preview.png',
            isDefault: true,
        },
        {
            name: 'Creative',
            description: 'A colorful template for creative industries',
            previewImageUrl: '/templates/creative-preview.png',
            isDefault: false,
        },
        {
            name: 'Academic',
            description: 'Formal template for academic and research positions',
            previewImageUrl: '/templates/academic-preview.png',
            isDefault: false,
        },
    ];

    for (const template of templates) {
        await prisma.resumeTemplate.upsert({
            where: { name: template.name },
            update: template,
            create: template,
        });
    }

    console.log('Database has been seeded with initial data');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });