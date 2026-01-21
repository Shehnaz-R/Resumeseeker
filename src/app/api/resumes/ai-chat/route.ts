import { NextResponse } from 'next/server';
import { generateInteractiveFeedback } from '@/ai/flows/interactive-feedback-openrouter';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeId, analysisResult, userQuestion } = body;

    if (!resumeId || !analysisResult || !userQuestion) {
      return NextResponse.json(
        { error: 'Resume ID, analysis result, and user question are required' },
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

    let chatResult;
    try {
      // Generate AI response using OpenRouter
      chatResult = await generateInteractiveFeedback({
        resumeText: analysisResult.experience || analysisResult.name || 'Resume content not fully extracted',
        skills: analysisResult.skills || [],
        education: analysisResult.education || 'Education details not extracted',
        projects: analysisResult.projects || [],
        userQuestion: userQuestion,
      });
    } catch (error: any) {
      console.warn("AI Chat failed, using fallback:", error.message);
      // Provide fallback response if AI fails
      chatResult = {
        response: `I understand you're asking about "${userQuestion}". Based on your resume, I can see you have skills in ${analysisResult.skills?.slice(0, 3).join(', ') || 'various areas'}. Due to current API limitations, I can provide general advice: Focus on highlighting your key skills, quantifying your achievements, and tailoring your resume to the specific role you're targeting.`,
        suggestions: [
          'Quantify your achievements with specific numbers and metrics',
          'Use action verbs to describe your responsibilities',
          'Tailor your resume to match job requirements by including relevant keywords',
          'Include relevant keywords from job postings you\'re interested in'
        ],
        followUpQuestions: [
          'What specific role or industry are you targeting?',
          'Are there particular skills you want to highlight?',
          'Do you need help with formatting or structure?'
        ]
      };
    }

    // Save chat interaction to database (optional)
    try {
      await db.appUsageStats.create({
        data: {
          userId: resume.userId,
          eventType: 'ai_chat_interaction',
          eventData: {
            question: userQuestion,
            response: chatResult.response,
            resumeId: resumeId
          },
          userAgent: 'ResumeSeeker AI Chat',
          ipAddress: '127.0.0.1',
          timestamp: new Date(),
        },
      });
    } catch (dbError) {
      console.warn("Failed to save chat interaction to database:", dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      chatResponse: chatResult,
    });
  } catch (error) {
    console.error('Error in AI chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process AI chat request' },
      { status: 500 }
    );
  }
}
