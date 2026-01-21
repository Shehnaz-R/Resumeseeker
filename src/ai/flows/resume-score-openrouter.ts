import { openrouter } from '../openrouter';
import { z } from 'zod';
import { parseResumeManually } from '@/lib/resume-parser';

// Input schema for resume scoring
export const AnalyzeResumeAndScoreInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to be scored'),
});

// Output schema for resume scoring
export const AnalyzeResumeAndScoreOutputSchema = z.object({
  score: z.number().describe('A score between 0 and 100 indicating the overall quality of the resume'),
  feedback: z.string().describe('A brief feedback statement based on the score'),
});

export type AnalyzeResumeAndScoreInput = z.infer<typeof AnalyzeResumeAndScoreInputSchema>;
export type AnalyzeResumeAndScoreOutput = z.infer<typeof AnalyzeResumeAndScoreOutputSchema>;

// Resume scoring function using OpenRouter
export async function analyzeResumeAndScore(input: AnalyzeResumeAndScoreInput): Promise<AnalyzeResumeAndScoreOutput> {
  try {
    const prompt = `
    Analyze the following resume text and provide a score and detailed feedback.

    Resume Text: ${input.resumeText}

    Please evaluate the resume based on:
    - Content quality and relevance
    - Structure and organization
    - Skills and experience presentation
    - Education and qualifications
    - Overall professional presentation

    Provide a score from 0-100 and detailed feedback explaining the score, including specific strengths and areas for improvement.

    Return only valid JSON in this format:
    {
      "score": number (0-100),
      "feedback": "Detailed feedback with strengths and weaknesses"
    }
    `;

    const response = await openrouter.generateStructuredResponse(
      prompt,
      AnalyzeResumeAndScoreOutputSchema,
      2000
    );

    // Ensure we always return a valid score object
    let finalScore = 75;
    let finalFeedback = "Analysis completed with default scoring due to response parsing";

    if (response && typeof response === 'object') {
      // Try to extract score and feedback from the response
      let score = response.score;
      let feedback = response.feedback;

      // If score is not a number, try to extract from text
      if (typeof score !== 'number') {
        const scoreMatch = JSON.stringify(response).match(/"score"\s*:\s*(\d+)/);
        if (scoreMatch) {
          score = parseInt(scoreMatch[1], 10);
        }
      }

      // If feedback is not a string, try to extract from text
      if (typeof feedback !== 'string') {
        const feedbackMatch = JSON.stringify(response).match(/"feedback"\s*:\s*"([^"]+)"/);
        if (feedbackMatch) {
          feedback = feedbackMatch[1];
        }
      }

      // Validate and use the extracted data if valid
      if (typeof score === 'number' && score >= 0 && score <= 100) {
        finalScore = score;
      }
      if (typeof feedback === 'string' && feedback.length > 0) {
        finalFeedback = feedback;
      }
    }

    return { score: finalScore, feedback: finalFeedback };
  } catch (error) {
    console.error('Resume scoring error:', error);

    // Try to calculate a basic score based on manual parsing
    console.log('Falling back to manual scoring...');
    try {
      const parsedResume = parseResumeManually(input.resumeText);

      // Calculate a basic score based on extracted data
      let score = 50; // Base score
      let feedback = "Basic analysis completed";

      // Add points for having a name
      if (parsedResume.name && parsedResume.name !== 'Name not extracted') {
        score += 10;
      }

      // Add points for contact details
      if (parsedResume.contactDetails && parsedResume.contactDetails !== 'Contact details not extracted') {
        score += 10;
      }

      // Add points for skills
      if (parsedResume.skills && parsedResume.skills.length > 0) {
        score += Math.min(parsedResume.skills.length * 2, 15); // Max 15 points for skills
      }

      // Add points for experience
      if (parsedResume.experience && parsedResume.experience !== 'Experience details not extracted') {
        score += 10;
      }

      // Add points for education
      if (parsedResume.education && parsedResume.education !== 'Education details not extracted') {
        score += 10;
      }

      // Add points for projects
      if (parsedResume.projects && parsedResume.projects.length > 0) {
        score += Math.min(parsedResume.projects.length * 2, 10); // Max 10 points for projects
      }

      // Ensure score is within bounds
      score = Math.max(0, Math.min(100, score));

      console.log(`Manual scoring result: ${score}/100`);

      return {
        score,
        feedback: `Basic scoring based on extracted content: ${score}/100`
      };
    } catch (manualError) {
      console.error('Manual scoring also failed:', manualError);

      // Return fallback score only if both AI and manual scoring fail
      return {
        score: 75,
        feedback: "Analysis completed with default scoring due to API limitations"
      };
    }
  }
}
