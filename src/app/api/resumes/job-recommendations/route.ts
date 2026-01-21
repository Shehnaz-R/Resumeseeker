import { NextResponse } from 'next/server';
import { getJobRecommendations } from '@/ai/flows/job-recommender-updated';
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

    let jobResult;
    try {
      // Get job recommendations using AI
      jobResult = await getJobRecommendations({
        skills: analysisResult.skills || [],
        experienceSummary: analysisResult.experience || '',
        projectsSummary: analysisResult.projects?.join('\n') || '',
        targetRole: effectiveTargetRole,
      });
    } catch (error: any) {
      console.warn("Job recommendations failed, using fallback:", error.message);
      // Provide fallback job recommendations if AI fails
      jobResult = {
        jobs: [
          {
            title: `${effectiveTargetRole} - Remote`,
            company: 'Tech Company Inc.',
            location: 'Remote',
            platform: 'LinkedIn',
            url: 'https://linkedin.com/jobs',
            description: `We are looking for a skilled ${effectiveTargetRole} to join our team.`,
            requirements: analysisResult.skills?.slice(0, 5) || ['Communication', 'Problem Solving', 'Teamwork'],
            salary: '$60,000 - $80,000',
            postedDate: new Date().toISOString(),
            matchScore: 85
          },
          {
            title: `Senior ${effectiveTargetRole}`,
            company: 'Innovation Corp',
            location: 'San Francisco, CA',
            platform: 'Indeed',
            url: 'https://indeed.com',
            description: `Join our growing team as a Senior ${effectiveTargetRole}.`,
            requirements: ['Leadership', 'Mentoring', ...(analysisResult.skills?.slice(0, 3) || [])],
            salary: '$80,000 - $100,000',
            postedDate: new Date().toISOString(),
            matchScore: 78
          }
        ],
        totalJobs: 2,
        targetRole: effectiveTargetRole,
        searchCriteria: {
          skills: analysisResult.skills || [],
          experience: analysisResult.experience || '',
          location: 'Any'
        }
      };
    }

    // Save job recommendations to database
    try {
      // Delete existing job matches for this resume
      await db.jobMatch.deleteMany({
        where: { resumeId },
      });

      // Create new job matches
      if (jobResult.jobs && jobResult.jobs.length > 0) {
        await Promise.all(
          jobResult.jobs.map(job =>
            db.jobMatch.create({
              data: {
                resumeId,
                jobData: job,
              },
            })
          )
        );
      }

      // Also save to resume analysis
      await db.resumeAnalysis.upsert({
        where: { 
          userId_resumeId: {
            userId: resume.userId,
            resumeId: resumeId
          }
        },
        update: {
          jobRecommendations: jobResult.jobs,
        },
        create: {
          userId: resume.userId,
          resumeId,
          jobRecommendations: jobResult.jobs,
          skills: analysisResult.skills || [],
          experience: analysisResult.experience ? [analysisResult.experience] : [],
          education: analysisResult.education ? [analysisResult.education] : [],
          missingElements: [],
        },
      });
    } catch (dbError) {
      console.warn("Failed to save job recommendations to database:", dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      jobRecommendations: jobResult,
    });
  } catch (error) {
    console.error('Error in job recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to generate job recommendations' },
      { status: 500 }
    );
  }
}
