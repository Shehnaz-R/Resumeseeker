import { NextResponse } from 'next/server';
import { generateResumeSummary } from '@/ai/flows/resume-summary-flow';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeId, analysisResult } = body;

    if (!resumeId || !analysisResult) {
      return NextResponse.json(
        { error: 'Resume ID and analysis result are required' },
        { status: 400 }
      );
    }

    // Check if resume exists
    const resume = await db.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    let summaryResult;
    try {
      // Generate summary using AI
      summaryResult = await generateResumeSummary({
        resumeText: analysisResult.experience || '',
        skills: analysisResult.skills || [],
        education: analysisResult.education || '',
        projects: analysisResult.projects || [],
      });
    } catch (error: any) {
      console.warn("Resume summary generation failed, using fallback:", error.message);
      // Provide fallback summary if AI fails
      summaryResult = {
        summary: `Professional with experience in ${analysisResult.skills?.join(', ') || 'various skills'}. ${analysisResult.experience ? 'Has relevant work experience.' : 'Looking to gain experience in the field.'}`,
        keyHighlights: analysisResult.skills?.slice(0, 3) || ['Adaptable', 'Motivated', 'Eager to learn'],
        strengths: ['Strong technical skills', 'Good communication', 'Team player'],
        areasForImprovement: ['Add more quantifiable achievements', 'Include specific project details', 'Highlight leadership experience']
      };
    }

    // Save summary to database
    try {
      await db.resumeAnalysis.upsert({
        where: { 
          userId_resumeId: {
            userId: resume.userId,
            resumeId: resumeId
          }
        },
        update: {
          extractedData: {
            summary: summaryResult.summary,
            keyHighlights: summaryResult.keyHighlights,
            strengths: summaryResult.strengths,
            areasForImprovement: summaryResult.areasForImprovement,
          }
        },
        create: {
          userId: resume.userId,
          resumeId,
          extractedData: {
            summary: summaryResult.summary,
            keyHighlights: summaryResult.keyHighlights,
            strengths: summaryResult.strengths,
            areasForImprovement: summaryResult.areasForImprovement,
          },
          skills: analysisResult.skills || [],
          experience: analysisResult.experience ? [analysisResult.experience] : [],
          education: analysisResult.education ? [analysisResult.education] : [],
          missingElements: [],
        },
      });
    } catch (dbError) {
      console.warn("Failed to save summary to database:", dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      summary: summaryResult,
    });
  } catch (error) {
    console.error('Error in resume summary API:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume summary' },
      { status: 500 }
    );
  }
}
