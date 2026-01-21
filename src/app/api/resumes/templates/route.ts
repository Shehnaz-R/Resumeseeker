import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters for pagination if needed
    const url = new URL(req.url);
    const offsetParam = url.searchParams.get('offset');
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    // Run the query to get ResumeTemplates ordered by isDefault descending
    // This executes the equivalent of: SELECT * FROM "ResumeTemplate" WHERE 1=1 ORDER BY "isDefault" DESC OFFSET $offset
    const templates = await prisma.resumeTemplate.findMany({
      orderBy: {
        isDefault: 'desc',
      },
      skip: offset,
    });

    // Store the data in PostgreSQL (this is already handled by Prisma)
    // The data is retrieved from PostgreSQL and can be used as needed

    return NextResponse.json({
      templates,
      message: 'Resume templates fetched successfully from PostgreSQL'
    });
  } catch (error) {
    console.error('Error fetching resume templates:', error);
    return NextResponse.json({
      error: 'Failed to fetch resume templates from PostgreSQL'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
