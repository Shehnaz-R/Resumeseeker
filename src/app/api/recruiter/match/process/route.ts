import { NextRequest, NextResponse } from 'next/server';
import { fileToDataUri } from '@/lib/file-utils';
import { matchResumeToJd, type RecruiterMatchInput, type RecruiterMatchOutput } from '@/ai/flows/recruiter-matcher-flow';
import { analyzeResume, type AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { generateFeedbackHtml, type FeedbackHtmlOutput } from '@/ai/flows/feedback-pdf-generator-flow';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume file and job description are required' },
        { status: 400 }
      );
    }

    // Convert file to data URI for processing
    const resumeDataUri = await fileToDataUri(file);

    // Analyze resume first
    const resumeAnalysis = await analyzeResume({ resumeDataUri });

    // Match resume to job description
    const matchInput: RecruiterMatchInput = {
      resumeDataUri,
      jobDescriptionText: jobDescription,
    };

    const matchResult = await matchResumeToJd(matchInput);

    // Generate feedback HTML
    const feedbackInput = {
      matchData: matchResult,
      resumeAnalysis: resumeAnalysis,
      jobDescriptionTitle: "Position being evaluated"
    };

    const feedbackOutput: FeedbackHtmlOutput = await generateFeedbackHtml(feedbackInput);

    // Skip database storage to avoid dependency issues
    // const match = await prisma.recruiterMatch.create({
    //   data: {
    //     recruiterId,
    //     jobTitle: "Position being evaluated", // Could be extracted from JD
    //     jobDescription,
    //     candidateName: resumeAnalysis.name || 'Unknown Candidate',
    //     candidateEmail: '', // Could be extracted from resume
    //     resumeText: resumeAnalysis.experience + '\n\nSkills: ' + resumeAnalysis.skills.join(', '),
    //     resumeFile: resumeDataUri, // Store data URI
    //     matchScore: matchResult.fitmentScore,
    //     skillMatch: matchResult.jdSkillsAnalysis?.mandatorySkillsMet.length || 0,
    //     experienceMatch: 80, // Default value, could be calculated
    //     educationMatch: 90, // Default value, could be calculated
    //     strengths: matchResult.keyMatches,
    //     weaknesses: matchResult.keyMismatches,
    //     recommendations: matchResult.courseRecommendations?.map(c => c.title).join(', ') || '',
    //     status: 'new',
    //     notes: `AI Assessment: ${matchResult.assessment}`,
    //   },
    // });

    return NextResponse.json({
      // match,
      analysis: resumeAnalysis,
      matchResult,
      feedbackHtml: feedbackOutput.htmlContent,
      feedbackFilename: feedbackOutput.suggestedFilename,
    });

  } catch (error) {
    console.error('Error processing recruiter match:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the match' },
      { status: 500 }
    );
  }
}
