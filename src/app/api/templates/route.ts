import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock templates data for when database is not available
const mockTemplates = [
    {
        id: '1',
        name: 'Professional',
        description: 'A clean, professional template suitable for corporate environments',
        previewImageUrl: '/templates/professional-preview.png',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Creative',
        description: 'A colorful template for creative industries',
        previewImageUrl: '/templates/creative-preview.png',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        name: 'Academic',
        description: 'Formal template for academic and research positions',
        previewImageUrl: '/templates/academic-preview.png',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export async function GET() {
    try {
        // Test database connection first
        await prisma.$connect();
        
        const templates = await prisma.resumeTemplate.findMany({
            orderBy: {
                isDefault: 'desc',
            },
        });

        // If no templates found, return mock data
        if (!templates || templates.length === 0) {
            console.log('No templates found in database, returning mock data');
            return NextResponse.json(mockTemplates);
        }

        return NextResponse.json(templates);
    } catch (error) {
        console.error('Database connection failed, returning mock data:', error.message);
        
        // Return mock data when database is not available
        return NextResponse.json(mockTemplates);
    } finally {
        try {
            await prisma.$disconnect();
        } catch (disconnectError) {
            // Ignore disconnect errors
        }
    }
}