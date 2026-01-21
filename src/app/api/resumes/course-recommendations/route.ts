import { NextResponse } from 'next/server';
import { getCourseRecommendations } from '@/ai/flows/course-recommender-flow';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeId, analysisResult, targetRole } = body;

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

    const effectiveTargetRole = targetRole || analysisResult.experience?.split('\n')[0]?.split(' at ')[0] || 'Software Developer';

    let courseResult;
    try {
      // Get course recommendations using AI
      courseResult = await getCourseRecommendations({
        currentSkills: analysisResult.skills || [],
        targetRole: effectiveTargetRole,
        skillGaps: [], // Could be derived from other analyses
        areasForImprovement: [], // Could be derived from other analyses
      });
    } catch (error: any) {
      console.warn("Course recommendations failed, using fallback:", error.message);
      // Provide fallback course recommendations if AI fails
      courseResult = {
        recommendations: [
          {
            title: 'Professional Development Course',
            provider: 'Coursera',
            duration: '4-6 weeks',
            difficulty: 'Intermediate',
            description: 'Enhance your professional skills and stay current with industry trends',
            url: 'https://coursera.org',
            skillsCovered: analysisResult.skills?.slice(0, 3) || ['Communication', 'Leadership', 'Project Management'],
            rating: 4.5,
            cost: 'Free with audit option'
          },
          {
            title: 'Technical Skills Bootcamp',
            provider: 'Udemy',
            duration: '8-12 weeks',
            difficulty: 'Beginner to Intermediate',
            description: 'Comprehensive technical skills training for your target role',
            url: 'https://udemy.com',
            skillsCovered: ['Programming', 'Data Analysis', 'Problem Solving'],
            rating: 4.3,
            cost: '$49.99'
          }
        ],
        targetRole: effectiveTargetRole,
        skillGaps: ['Advanced Technical Skills', 'Industry Certifications', 'Leadership Training'],
        totalRecommendations: 2
      };
    }

    // Save course recommendations to database
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
            courseRecommendations: courseResult.recommendations,
            skillGaps: courseResult.skillGaps,
          }
        },
        create: {
          userId: resume.userId,
          resumeId,
          extractedData: {
            courseRecommendations: courseResult.recommendations,
            skillGaps: courseResult.skillGaps,
          },
          skills: analysisResult.skills || [],
          experience: analysisResult.experience ? [analysisResult.experience] : [],
          education: analysisResult.education ? [analysisResult.education] : [],
          missingElements: [],
        },
      });
    } catch (dbError) {
      console.warn("Failed to save course recommendations to database:", dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      courseRecommendations: courseResult,
    });
  } catch (error) {
    console.error('Error in course recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to generate course recommendations' },
      { status: 500 }
    );
  }
}
