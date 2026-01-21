import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'data', 'resumes');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const userId = formData.get('userId') as string;
    const optionSelected = formData.get('optionSelected') as string | null;
    const title = formData.get('title') as string || 'Uploaded Resume';
    const resumeFile = formData.get('resume') as File;

    if (!userId) {
      console.error("Validation Error: User ID is missing.");
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!resumeFile) {
      console.error("Validation Error: Resume file is missing.");
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }
    console.log("Attempting to process resume file.");
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const fileType = resumeFile.type || 'application/octet-stream'; // Get file type from the file object

    // Save resume record in DB
    console.log("Attempting to save resume record in DB.");
    const resume = await db.resume.create({
      data: {
        userId,
        title,
        content: fileBuffer,
        fileType,
        optionSelected,
      },
    });
    console.log("Resume record saved to DB.");

    // Save file to organized folder by user
    console.log("Attempting to save file to disk.");
    const userDir = path.join(uploadDir, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    const destPath = path.join(userDir, resumeFile.name || 'resume-uploaded');
    fs.writeFileSync(destPath, fileBuffer);
    console.log("File saved to disk.");

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
  }
}
