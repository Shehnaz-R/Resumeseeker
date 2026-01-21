import { NextResponse } from 'next/server';
import { analyzeResume } from '@/ai/flows/resume-analyzer';
import { analyzeResumeAndScore } from '@/ai/flows/resume-score';

// Helper to convert base64 content to Data URI with validation
function base64ToDataUri(base64: string, mimeType: string): string {
  // Validate base64 content
  if (!base64 || typeof base64 !== 'string' || base64.trim() === '') {
    throw new Error('Invalid or empty base64 content provided');
  }

  // Validate MIME type
  const validMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'text/plain'
  ];

  if (!validMimeTypes.includes(mimeType)) {
    throw new Error(`Unsupported MIME type: ${mimeType}`);
  }

  return `data:${mimeType};base64,${base64}`;
}

// Helper to validate base64 string
function isValidBase64(str: string): boolean {
  try {
    // Check if it's a valid base64 string
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(str)) {
      return false;
    }

    // Try to decode to ensure it's valid
    atob(str);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { content, fileType } = body;

    // Comprehensive input validation
    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      );
    }

    if (!fileType) {
      return NextResponse.json(
        { error: 'Missing required field: fileType' },
        { status: 400 }
      );
    }

    // Validate content is a non-empty string
    if (typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!isValidBase64(content)) {
      return NextResponse.json(
        { error: 'Content must be valid base64 encoded data' },
        { status: 400 }
      );
    }

    // Convert base64 content to Data URI with validation
    let resumeDataUri: string;
    try {
      resumeDataUri = base64ToDataUri(content, fileType);
    } catch (error) {
      console.error('Error creating data URI:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid content or file type' },
        { status: 400 }
      );
    }

    // Call the actual AI analysis flow with error handling
    let analysisResult;
    try {
      analysisResult = await analyzeResume({ resumeDataUri });
    } catch (error) {
      console.error('Error during resume analysis:', error);

      // Provide more specific error messages based on the error
      let errorMessage = 'Failed to analyze resume';
      if (error instanceof Error) {
        if (error.message.includes('document has no pages')) {
          errorMessage = 'The document appears to be empty or corrupted. Please ensure the file contains readable content.';
        } else if (error.message.includes('400 Bad Request')) {
          errorMessage = 'The AI service rejected the document. Please check the file format and try again.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error occurred while analyzing the resume. Please check your internet connection and try again.';
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
        },
        { status: 500 }
      );
    }

    // Get the resume text for scoring
    let resumeText = '';
    if (analysisResult.experience) resumeText += analysisResult.experience + ' ';
    if (analysisResult.skills) resumeText += analysisResult.skills.join(', ') + ' ';
    if (analysisResult.education) resumeText += analysisResult.education + ' ';
    if (analysisResult.projects) resumeText += analysisResult.projects.join(', ') + ' ';

    // Get the actual score from the AI scoring flow
    let scoreData = { score: 0, feedback: "Analysis complete." };
    try {
      if (resumeText.trim()) {
        scoreData = await analyzeResumeAndScore({ resumeText });
      }
    } catch (error) {
      console.error('Error during resume scoring:', error);
      // Keep default score if scoring fails
    }

    // Return analysis result with actual score
    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      scoreData: scoreData,
      jobRecs: [],
    });
  } catch (error) {
    console.error('Unexpected error in resume analysis:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while processing the resume',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
      },
      { status: 500 }
    );
  }
}
