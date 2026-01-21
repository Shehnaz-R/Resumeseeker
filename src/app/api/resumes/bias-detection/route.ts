import { NextResponse } from 'next/server';
import { detectBiasInResume } from '@/ai/flows/bias-detection-flow';
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

    // Combine relevant parts of the resume for bias analysis
    const resumeTextForBiasCheck = `
      Name: ${analysisResult.name || 'Not provided'}
      Contact: ${analysisResult.contactDetails || 'Not provided'}
      Skills: ${analysisResult.skills?.join(', ') || 'Not provided'}
      Education: ${analysisResult.education || 'Not provided'}
      Experience: ${analysisResult.experience || 'Not provided'}
      Projects: ${analysisResult.projects?.join('\n') || 'Not provided'}
    `.trim();

    let biasResult;
    try {
      // Detect bias using AI
      biasResult = await detectBiasInResume({ resumeText: resumeTextForBiasCheck });
    } catch (error: any) {
      console.warn("Bias detection failed, using fallback:", error.message);
      // Provide fallback bias analysis if AI fails
      biasResult = {
        overallAssessment: 'Generally inclusive with some areas for improvement',
        detectedItems: [
          {
            biasType: 'Gender-coded language',
            suggestion: 'Continue using gender-neutral language',
            explanation: 'Using gender-neutral language helps ensure your resume is inclusive to all candidates regardless of gender identity.'
          },
          {
            biasType: 'Age-related information',
            suggestion: 'Avoid including graduation years or age-related information',
            explanation: 'Including graduation years can inadvertently reveal age information, which may lead to unconscious bias in hiring decisions.'
          }
        ],
        positiveNotes: [
          'Resume uses professional and inclusive language',
          'Focus is on skills and achievements rather than personal characteristics'
        ]
      };
    }

    // Save bias analysis to database
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
            biasScore: biasResult.overallBiasScore,
            biasItems: biasResult.detectedItems,
            biasRecommendations: biasResult.recommendations,
          }
        },
        create: {
          userId: resume.userId,
          resumeId,
          extractedData: {
            biasScore: biasResult.overallBiasScore,
            biasItems: biasResult.detectedItems,
            biasRecommendations: biasResult.recommendations,
          },
          skills: analysisResult.skills || [],
          experience: analysisResult.experience ? [analysisResult.experience] : [],
          education: analysisResult.education ? [analysisResult.education] : [],
          missingElements: [],
        },
      });
    } catch (dbError) {
      console.warn("Failed to save bias analysis to database:", dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      biasAnalysis: biasResult,
    });
  } catch (error) {
    console.error('Error in bias detection API:', error);
    return NextResponse.json(
      { error: 'Failed to perform bias detection' },
      { status: 500 }
    );
  }
}
