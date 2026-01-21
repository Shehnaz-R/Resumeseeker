import { openrouter } from '../openrouter';
import { z } from 'zod';

// Input schema for interactive feedback
export const InteractiveFeedbackInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume'),
  skills: z.array(z.string()).describe('Skills mentioned in the resume'),
  education: z.string().describe('Education background'),
  projects: z.array(z.string()).describe('Projects mentioned in the resume'),
  userQuestion: z.string().describe('The user\'s question about their resume'),
});

// Output schema for interactive feedback
export const InteractiveFeedbackOutputSchema = z.object({
  response: z.string().describe('AI response to the user\'s question'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improvement'),
  followUpQuestions: z.array(z.string()).describe('Suggested follow-up questions'),
});

export type InteractiveFeedbackInput = z.infer<typeof InteractiveFeedbackInputSchema>;
export type InteractiveFeedbackOutput = z.infer<typeof InteractiveFeedbackOutputSchema>;

// Interactive feedback function using OpenRouter
export async function generateInteractiveFeedback(input: InteractiveFeedbackInput): Promise<InteractiveFeedbackOutput> {
  try {
    const prompt = `
    You are a professional resume advisor. A user has asked a question about their resume.

    Resume Information:
    - Text: ${input.resumeText}
    - Skills: ${input.skills.join(', ')}
    - Education: ${input.education}
    - Projects: ${input.projects.join(', ')}

    User Question: ${input.userQuestion}

    Please provide:
    1. A helpful, detailed response to their question based on the resume information provided
    2. Specific, actionable suggestions for improvement related to their question
    3. 2-3 follow-up questions they might consider

    IMPORTANT: Make your response comprehensive and directly address their specific question using the resume data provided. Don't give generic advice - tailor it to their actual resume content.

    Return only valid JSON in this format:
    {
      "response": "string",
      "suggestions": ["string", "string"],
      "followUpQuestions": ["string", "string"]
    }
    `;

    const response = await openrouter.generateStructuredResponse(
      prompt,
      InteractiveFeedbackOutputSchema,
      1500
    );

    return response;
  } catch (error) {
    console.error('Interactive feedback error:', error);
    
    // Return fallback response
    return {
      response: `I understand you're asking about "${input.userQuestion}". Due to current API limitations, I can provide general advice: Focus on highlighting your key skills (${input.skills.slice(0, 3).join(', ') || 'your skills'}), quantifying your achievements, and tailoring your resume to the specific role you're targeting.`,
      suggestions: [
        'Quantify your achievements with specific numbers',
        'Use action verbs to describe your responsibilities',
        'Tailor your resume to match job requirements',
        'Include relevant keywords from job postings'
      ],
      followUpQuestions: [
        'Would you like help with a specific section?',
        'What type of role are you targeting?',
        'Do you need help with formatting?'
      ]
    };
  }
}
