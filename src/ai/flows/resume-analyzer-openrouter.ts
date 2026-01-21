import { openrouter } from '../openrouter';
import { z } from 'zod';
import { aiCache } from '@/lib/ai-cache';
import { parseResumeManually } from '@/lib/resume-parser';

// Input schema for resume analysis
export const AnalyzeResumeInputSchema = z.object({
  resumeText: z.string().describe('The extracted text content of the resume'),
});

// Output schema for resume analysis
export const AnalyzeResumeOutputSchema = z.object({
  name: z.string().describe('Full name extracted from resume'),
  contactDetails: z.string().describe('Contact information including email, phone, address'),
  skills: z.array(z.string()).describe('List of skills mentioned in the resume'),
  experience: z.string().describe('Work experience summary'),
  education: z.string().describe('Education background'),
  projects: z.array(z.string()).describe('Projects mentioned in the resume'),
  language: z.string().describe('Primary language of the resume'),
});

export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

// Resume analysis function using OpenRouter
export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  try {
    // Check cache first
    const cacheKey = aiCache.generateResumeKey(input.resumeText, 'resume_analysis');
    const cachedResult = aiCache.get(cacheKey);
    
    if (cachedResult) {
      console.log("Using cached resume analysis result");
      return cachedResult;
    }

    console.log("Starting resume analysis with OpenRouter...");
    
    const prompt = `
    Analyze the following resume text and extract key information. Be thorough and extract as much information as possible from the resume content.

    Resume Text: ${input.resumeText}

    Please extract and return the following information in JSON format:
    - name: Full name of the person (look at the very top of the resume, usually the first line or immediately after basic headers like "RESUME" or "CURRICULUM VITAE")
    - contactDetails: Email, phone number, and address as a single formatted string (e.g., "john@email.com | (555) 123-4567 | 123 Main St, City, State"). Look for email patterns, phone numbers, and addresses throughout the resume.
    - skills: Array of ALL technical and soft skills mentioned in the resume. Include programming languages, frameworks, tools, soft skills, and any other competencies listed. Extract from skills sections, experience descriptions, and anywhere else they appear.
    - experience: Complete summary of work experience as a detailed string. Include job titles, companies, dates, and key responsibilities. Look for sections like "Experience", "Employment", "Work History", "Professional Experience". Include all job positions with their descriptions.
    - education: Complete educational background as a detailed string. Include degrees, institutions, graduation dates, GPA if mentioned. Look for sections like "Education", "Academic Background", "Qualifications". Include all educational achievements.
    - projects: Array of ALL projects mentioned in the resume, including personal projects, work projects, academic projects. Include project names and brief descriptions if available. Look for project sections and project mentions in experience.
    - language: Primary language of the resume (usually English, but detect if it's in another language)

    IMPORTANT: Extract information even if it's not perfectly formatted. Look throughout the entire resume text for relevant information. If a section is missing, try to infer it from context or other parts of the resume. Be comprehensive and don't miss any details.

    Return only valid JSON without any additional text or formatting.
    `;

    console.log("Sending prompt to OpenRouter...");
    const response = await openrouter.generateStructuredResponse(
      prompt,
      AnalyzeResumeOutputSchema,
      2000
    );

    console.log("OpenRouter analysis response:", response);

    // Check if response is empty or contains only fallback messages
    const isEmptyResponse = !response ||
      (response.name === 'Name not available' &&
       response.contactDetails === 'Contact information not available' &&
       response.experience === 'Experience not available' &&
       response.education === 'Education not available');

    if (isEmptyResponse) {
      console.log("Empty response detected, falling back to manual parsing");
      throw new Error("Empty AI response");
    }

    // Additional check: if most fields are empty or default, also fall back to manual parsing
    const hasMinimalContent = response.name && response.name !== 'Name not available' &&
                             (response.contactDetails && response.contactDetails !== 'Contact information not available') ||
                             (response.skills && response.skills.length > 0) ||
                             (response.experience && response.experience !== 'Experience not available') ||
                             (response.education && response.education !== 'Education not available') ||
                             (response.projects && response.projects.length > 0);

    if (!hasMinimalContent) {
      console.log("Response has minimal content, falling back to manual parsing for better results");
      throw new Error("Minimal AI response content");
    }

    // Post-process the response to ensure correct data types
    const processedResponse = {
      name: typeof response.name === 'string' ? response.name : 'Name not available',
      contactDetails: typeof response.contactDetails === 'string'
        ? response.contactDetails
        : typeof response.contactDetails === 'object'
          ? `${response.contactDetails.email || ''} | ${response.contactDetails.phone || ''} | ${response.contactDetails.address || ''}`.trim()
          : 'Contact information not available',
      skills: Array.isArray(response.skills) ? response.skills : [],
      experience: typeof response.experience === 'string'
        ? response.experience
        : Array.isArray(response.experience)
          ? response.experience.map((exp: any) => typeof exp === 'object' ? `${exp.title || exp.position || ''} at ${exp.company || ''} (${exp.date || exp.dates || ''})` : exp).join('; ')
          : 'Experience not available',
      education: typeof response.education === 'string'
        ? response.education
        : Array.isArray(response.education)
          ? response.education.map((edu: any) => typeof edu === 'object' ? `${edu.degree || ''} from ${edu.institution || edu.school || ''} (${edu.graduationDate || edu.graduation || ''})` : edu).join('; ')
          : 'Education not available',
      projects: Array.isArray(response.projects) ? response.projects : [],
      language: typeof response.language === 'string' ? response.language : 'English'
    };
    
    console.log("Processed analysis response:", processedResponse);
    
    // Cache the result
    aiCache.set(cacheKey, processedResponse);
    
    return processedResponse;
  } catch (error) {
    console.error('Resume analysis error:', error);

    // Try manual parsing as fallback
    console.log('Falling back to manual resume parsing...');
    try {
      const cacheKey = aiCache.generateResumeKey(input.resumeText, 'resume_analysis');
      const manualResult = parseResumeManually(input.resumeText);
      console.log('Manual parsing result:', manualResult);

      // Cache the manual result
      aiCache.set(cacheKey, manualResult);

      return manualResult;
    } catch (manualError) {
      console.error('Manual parsing also failed:', manualError);

      // Return fallback data only if both AI and manual parsing fail
      return {
        name: "Name not available",
        contactDetails: "Contact information not available",
        skills: ["Analysis temporarily unavailable"],
        experience: "Please try again in a few hours",
        education: "Service temporarily limited due to API quota",
        projects: ["Analysis temporarily unavailable"],
        language: "English"
      };
    }
  }
}
