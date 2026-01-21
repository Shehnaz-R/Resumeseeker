// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import fs from 'fs';
// import path from 'path';

// // GET a specific resume by ID
// export async function GET(
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const resumeId = params.id;

//         const resume = await db.resume.findUnique({
//             where: { id: resumeId },
//             include: {
//                 user: true,
//                 jobMatches: true,
//             },
//         });

//         if (!resume) {
//             return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
//         }

//         return NextResponse.json(resume);
//     } catch (error) {
//         console.error('Error fetching resume:', error);
//         return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
//     }
// }

// // UPDATE a resume
// export async function PUT(
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const resumeId = params.id;
//         const body = await req.json();
//         const { title, content, optionSelected } = body;

//         // Validate input
//         if (!title && !content && !optionSelected) {
//             return NextResponse.json(
//                 { error: 'No data provided for update' },
//                 { status: 400 }
//             );
//         }

//         // Get the existing resume to check if it exists
//         const existingResume = await db.resume.findUnique({
//             where: { id: resumeId },
//             include: { user: true },
//         });

//         if (!existingResume) {
//             return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
//         }

//         // Update the resume in the database
//         const updatedResume = await db.resume.update({
//             where: { id: resumeId },
//             data: {
//                 ...(title && { title }),
//                 ...(content && { content }),
//                 ...(optionSelected && { optionSelected }),
//             },
//             include: { user: true },
//         });

//         // Save resume to file system organized by name
//         if (content && existingResume.user) {
//             const userName = existingResume.user.name || 'unknown_user';
//             const resumeName = title || existingResume.title;
//             const sanitizedUserName = userName.replace(/[^a-zA-Z0-9]/g, '_');
//             const sanitizedResumeName = resumeName.replace(/[^a-zA-Z0-9]/g, '_');

//             // Create directory structure
//             const userDir = path.join(process.cwd(), 'data', 'resumes', sanitizedUserName);

//             try {
//                 // Ensure the directory exists
//                 fs.mkdirSync(userDir, { recursive: true });

//                 // Write the resume content to a file
//                 fs.writeFileSync(
//                     path.join(userDir, `${sanitizedResumeName}.json`),
//                     JSON.stringify(content, null, 2)
//                 );
//             } catch (fsError) {
//                 console.error('Error saving resume to file system:', fsError);
//                 // Continue with the response even if file saving fails
//             }
//         }

//         return NextResponse.json(updatedResume);
//     } catch (error) {
//         console.error('Error updating resume:', error);
//         return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
//     }
// }

// // DELETE a resume
// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const resumeId = params.id;

//         // Get the resume to check if it exists and to get user info
//         const existingResume = await db.resume.findUnique({
//             where: { id: resumeId },
//             include: { user: true },
//         });

//         if (!existingResume) {
//             return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
//         }

//         // Delete the resume
//         await db.resume.delete({
//             where: { id: resumeId },
//         });

//         // Try to delete the file if it exists
//         if (existingResume.user) {
//             const userName = existingResume.user.name || 'unknown_user';
//             const resumeName = existingResume.title;
//             const sanitizedUserName = userName.replace(/[^a-zA-Z0-9]/g, '_');
//             const sanitizedResumeName = resumeName.replace(/[^a-zA-Z0-9]/g, '_');

//             const filePath = path.join(
//                 process.cwd(),
//                 'data',
//                 'resumes',
//                 sanitizedUserName,
//                 `${sanitizedResumeName}.json`
//             );

//             try {
//                 if (fs.existsSync(filePath)) {
//                     fs.unlinkSync(filePath);
//                 }
//             } catch (fsError) {
//                 console.error('Error deleting resume file:', fsError);
//                 // Continue with the response even if file deletion fails
//             }
//         }

//         return NextResponse.json({ message: 'Resume deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting resume:', error);
//         return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyzeResume } from '@/ai/flows/resume-analyzer';
import fs from 'fs';
import path from 'path';

// Helper to convert base64 content to Data URI
function base64ToDataUri(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

// POST: Upload + Analyze + Store resume
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, fileType, title, userId, optionSelected } = body;

    if (!content || !fileType) {
      return NextResponse.json(
        { error: 'Missing required field: content or fileType' },
        { status: 400 }
      );
    }

    // Convert base64 content to Data URI
    const resumeDataUri = base64ToDataUri(content, fileType);

    // Call the actual AI analysis flow
    const analysisResult = await analyzeResume({ resumeDataUri });

    // Store resume in DB
    const newResume = await db.resume.create({
      data: {
        title: title || 'Untitled Resume',
        content,
        optionSelected: optionSelected || null,
        user: userId ? { connect: { id: userId } } : undefined,
      },
      include: { user: true },
    });

    // (Optional) Save resume JSON into file system
    if (newResume.user) {
      const userName = newResume.user.name || 'unknown_user';
      const sanitizedUserName = userName.replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedResumeName = (title || 'resume').replace(/[^a-zA-Z0-9]/g, '_');

      const userDir = path.join(process.cwd(), 'data', 'resumes', sanitizedUserName);
      fs.mkdirSync(userDir, { recursive: true });
      fs.writeFileSync(
        path.join(userDir, `${sanitizedResumeName}.json`),
        JSON.stringify({ content, analysisResult }, null, 2)
      );
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      resume: newResume,
      scoreData: { score: 0, feedback: 'Analysis complete.' },
      jobRecs: [],
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to process and store resume' },
      { status: 500 }
    );
  }
}
