/**
 * Manual resume parser as fallback when AI fails
 * Extracts basic information using regex patterns
 */

export interface ParsedResume {
  name: string;
  contactDetails: string;
  skills: string[];
  experience: string;
  education: string;
  projects: string[];
  language: string;
}

export function parseResumeManually(textContent: string): ParsedResume {
  // Extract name (usually at the top, before contact info)
  const name = extractName(textContent);

  // Extract contact details
  const contactDetails = extractContactDetails(textContent);

  // Extract skills
  const skills = extractSkills(textContent);

  // Extract experience
  const experience = extractExperience(textContent);

  // Extract education
  const education = extractEducation(textContent);

  // Extract projects
  const projects = extractProjects(textContent);

  // Detect language (basic detection)
  const language = detectLanguage(textContent);

  return {
    name,
    contactDetails,
    skills,
    experience,
    education,
    projects,
    language
  };
}

function extractName(text: string): string {
  // Look for name patterns at the beginning of the resume
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Common patterns: Name is usually the first line or after some headers
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    // Skip common headers
    if (line.toLowerCase().includes('resume') ||
        line.toLowerCase().includes('curriculum vitae') ||
        line.toLowerCase().includes('cv') ||
        line.toLowerCase().includes('contact') ||
        line.toLowerCase().includes('email') ||
        line.toLowerCase().includes('phone') ||
        line.toLowerCase().includes('address') ||
        line.toLowerCase().includes('linkedin') ||
        line.toLowerCase().includes('github') ||
        line.toLowerCase().includes('portfolio') ||
        line.toLowerCase().includes('summary') ||
        line.toLowerCase().includes('objective') ||
        line.toLowerCase().includes('profile')) {
      continue;
    }

    // Name should be 1-5 words, title case or all caps, no numbers
    const words = line.split(/\s+/);
    if (words.length >= 1 && words.length <= 5) {
      // Check if it looks like a name (contains letters, possibly with spaces/hyphens/apostrophes)
      if (/^[a-zA-Z\s\-']+$/.test(line) && !/\d/.test(line)) {
        // Additional check: should not be all lowercase or contain common non-name words
        const lowerLine = line.toLowerCase();
        if (!lowerLine.includes('software') && !lowerLine.includes('engineer') &&
            !lowerLine.includes('developer') && !lowerLine.includes('analyst') &&
            !lowerLine.includes('manager') && !lowerLine.includes('specialist') &&
            !lowerLine.includes('consultant') && !lowerLine.includes('architect')) {
          return line.trim();
        }
      }
    }
  }

  // Try to extract from the original text (not lowercased)
  const originalLines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  for (let i = 0; i < Math.min(15, originalLines.length); i++) {
    const line = originalLines[i];
    // Skip common headers
    if (line.toLowerCase().includes('resume') ||
        line.toLowerCase().includes('curriculum vitae') ||
        line.toLowerCase().includes('cv') ||
        line.toLowerCase().includes('contact') ||
        line.toLowerCase().includes('email') ||
        line.toLowerCase().includes('phone') ||
        line.toLowerCase().includes('address') ||
        line.toLowerCase().includes('linkedin') ||
        line.toLowerCase().includes('github') ||
        line.toLowerCase().includes('portfolio') ||
        line.toLowerCase().includes('summary') ||
        line.toLowerCase().includes('objective') ||
        line.toLowerCase().includes('profile')) {
      continue;
    }

    // Name should be 1-5 words, title case or all caps
    const words = line.split(/\s+/);
    if (words.length >= 1 && words.length <= 5) {
      // Check if it looks like a name (contains letters, possibly with spaces/hyphens)
      if (/^[a-zA-Z\s\-']+$/.test(line) && !/\d/.test(line)) {
        // Additional check: should not be all lowercase or contain common non-name words
        const lowerLine = line.toLowerCase();
        if (!lowerLine.includes('software') && !lowerLine.includes('engineer') &&
            !lowerLine.includes('developer') && !lowerLine.includes('analyst') &&
            !lowerLine.includes('manager') && !lowerLine.includes('specialist') &&
            !lowerLine.includes('consultant') && !lowerLine.includes('architect')) {
          return line.trim();
        }
      }
    }
  }

  return 'Name not extracted';
}

function extractContactDetails(text: string): string {
  const contacts: string[] = [];

  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailRegex);
  if (emails) {
    contacts.push(...emails);
  }

  // Phone regex (various formats)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = text.match(phoneRegex);
  if (phones) {
    contacts.push(...phones);
  }

  // LinkedIn, GitHub, etc.
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9\-_]+/gi;
  const githubRegex = /github\.com\/[a-zA-Z0-9\-_]+/gi;
  const linkedin = text.match(linkedinRegex);
  const github = text.match(githubRegex);

  if (linkedin) contacts.push(linkedin[0]);
  if (github) contacts.push(github[0]);

  return contacts.length > 0 ? contacts.join(' | ') : 'Contact details not extracted';
}

function extractSkills(text: string): string[] {
  const skills: string[] = [];

  // Common skill sections - improved regex to capture more content
  const skillSections = [
    /(?:skills?|technical skills?|additional skills?|core competencies?|expertise|competencies):?\s*([\s\S]*?)(?=\n\s*(?:experience|employment|education|projects?|volunteering|languages?|awards?|certifications?|references?|$))/gi,
    /(?:a d dit i onal  s k ill s):?\s*([\s\S]*?)(?=\n\s*(?:experience|employment|education|projects?|volunteering|languages?|awards?|certifications?|references?|$))/gi
  ];

  for (const regex of skillSections) {
    const match = regex.exec(text);
    if (match && match[1]) {
      const skillText = match[1];
      // Split by common delimiters and clean up
      const extractedSkills = skillText
        .split(/[,;•·\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 1 && skill.length < 100)
        .filter(skill => !/\b(and|or|with|using|in|on|for|the|a|an|to|of|fluent|proficient)\b/i.test(skill))
        .map(skill => skill.replace(/^\s*[•\-*]\s*/, '')) // Remove bullet points
        .filter(skill => skill.length > 1);

      skills.push(...extractedSkills);
    }
  }

  // If no skills found from sections, look for common tech skills in the entire text
  if (skills.length === 0) {
    const commonSkills = [
      'javascript', 'python', 'java', 'c\\+\\+', 'c#', 'php', 'ruby', 'go', 'rust',
      'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
      'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
      'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
      'linux', 'windows', 'macos', 'agile', 'scrum', 'kanban',
      'ms office', 'word', 'excel', 'powerpoint', 'outlook', 'salesforce', 'tfs',
      'project management', 'english', 'spanish', 'french'
    ];

    for (const skill of commonSkills) {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        // Capitalize first letter of each word
        const capitalized = skill.split(' ').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        skills.push(capitalized);
      }
    }
  }

  return [...new Set(skills)]; // Remove duplicates
}

function extractExperience(text: string): string {
  // Look for experience section with various headers - capture more content including bullet points
  const experienceRegex = /(?:experience|employment|work history|professional experience|career history):?\s*([\s\S]*?)(?=\n\s*(?:education|skills?|technical|projects?|volunteering|languages?|awards?|certifications?|references?|$))/gi;
  const match = experienceRegex.exec(text);

  if (match && match[1]) {
    const experienceText = match[1].trim();
    if (experienceText.length > 10) { // Ensure we have substantial content
      return experienceText;
    }
  }

  // Look for standalone "EMPLOYMENT" header (common in resumes) - capture until next major section
  const employmentHeaderRegex = /employment\s*\n([\s\S]*?)(?=\n\s*(?:education|skills?|technical|projects?|volunteering|languages?|awards?|certifications?|references?|$))/gi;
  const employmentMatch = employmentHeaderRegex.exec(text);

  if (employmentMatch && employmentMatch[1]) {
    const experienceText = employmentMatch[1].trim();
    if (experienceText.length > 10) {
      return experienceText;
    }
  }

  // Look for technical experience section
  const technicalRegex = /technical experience:?\s*([\s\S]*?)(?=\n\s*(?:education|skills?|projects?|volunteering|languages?|awards?|certifications?|references?|$))/gi;
  const technicalMatch = technicalRegex.exec(text);

  if (technicalMatch && technicalMatch[1]) {
    const experienceText = technicalMatch[1].trim();
    if (experienceText.length > 10) {
      return experienceText;
    }
  }

  // Look for job titles and companies as fallback
  const jobPatterns = [
    /(?:software|senior|junior|lead|principal|staff) (?:engineer|developer|architect|analyst|manager)/gi,
    /(?:full.?stack|front.?end|back.?end|web|mobile|data|machine learning|ai) (?:engineer|developer|specialist)/gi,
    /(?:product|project|program) manager/gi,
    /(?:data|business|systems) analyst/gi,
    /intern/gi,
    /engineer/gi,
    /developer/gi
  ];

  const foundJobs: string[] = [];
  for (const pattern of jobPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      foundJobs.push(...matches);
    }
  }

  if (foundJobs.length > 0) {
    return `Found positions: ${foundJobs.slice(0, 3).join(', ')}${foundJobs.length > 3 ? '...' : ''}`;
  }

  return 'Experience details not extracted';
}

function extractEducation(text: string): string {
  // Look for education section with improved regex to capture more content
  const educationRegex = /(?:education|e d u c a t i o n):?\s*([\s\S]*?)(?=\n\s*(?:experience|employment|skills?|technical|projects?|volunteering|languages?|awards?|certifications?|references?|$))/gi;
  const match = educationRegex.exec(text);

  if (match && match[1]) {
    const educationText = match[1].trim();
    if (educationText.length > 10) { // Ensure we have substantial content
      return educationText;
    }
  }

  // Look for academic background
  const academicRegex = /academic (?:background|qualification):?\s*([^.!?\n]*(?:\n(?!\n)[^.!?\n]*)*)/gi;
  const academicMatch = academicRegex.exec(text);

  if (academicMatch && academicMatch[1]) {
    return academicMatch[1].trim();
  }

  // Look for degrees and universities
  const degreePatterns = [
    /(?:bachelor|master|phd|doctorate|associate)'?s?\s+(?:degree|of)\s+(?:science|arts|engineering|business|computer science|information technology)/gi,
    /(?:b\.?s\.?|m\.?s\.?|ph\.?d\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a\.?)\s+(?:in)?/gi,
    /(?:university|college|institute|school)\s+of/gi
  ];

  const foundEducation: string[] = [];
  for (const pattern of degreePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      foundEducation.push(...matches);
    }
  }

  // Look for specific universities
  const universities = [
    'stanford', 'harvard', 'mit', 'berkeley', 'carnegie mellon', 'university of', 'college of',
    'indian institute of technology', 'bits pilani', 'delhi university', 'jawaharlal nehru university',
    'louisiana state university', 'baton rouge'
  ];

  for (const uni of universities) {
    if (text.toLowerCase().includes(uni.toLowerCase())) {
      foundEducation.push(uni.charAt(0).toUpperCase() + uni.slice(1));
    }
  }

  if (foundEducation.length > 0) {
    return `Found education: ${foundEducation.slice(0, 2).join(', ')}${foundEducation.length > 2 ? '...' : ''}`;
  }

  return 'Education details not extracted';
}

function extractProjects(text: string): string[] {
  const projects: string[] = [];

  // Look for projects section
  const projectRegex = /projects?:?\s*([^.!?\n]*(?:\n(?!\n)[^.!?\n]*)*)/gi;
  const match = projectRegex.exec(text);

  if (match && match[1]) {
    const projectText = match[1];
    // Split by common project delimiters
    const extractedProjects = projectText
      .split(/•|\n\s*\n|^\s*\d+\./gm)
      .map(project => project.trim())
      .filter(project => project.length > 10 && project.length < 200)
      .filter(project => !/\b(and|or|with|using|in|on|for|the|a|an|to|of)\b/i.test(project));

    projects.push(...extractedProjects);
  }

  return projects;
}

function detectLanguage(text: string): string {
  // Simple language detection based on common words
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const spanishWords = ['el', 'la', 'los', 'las', 'y', 'o', 'pero', 'en', 'sobre', 'a', 'para', 'de', 'con', 'por'];
  const frenchWords = ['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'sur', 'à', 'pour', 'de', 'avec', 'par'];

  const textLower = text.toLowerCase();
  let englishCount = 0, spanishCount = 0, frenchCount = 0;

  englishWords.forEach(word => {
    if (textLower.includes(word)) englishCount++;
  });
  spanishWords.forEach(word => {
    if (textLower.includes(word)) spanishCount++;
  });
  frenchWords.forEach(word => {
    if (textLower.includes(word)) frenchCount++;
  });

  if (englishCount > spanishCount && englishCount > frenchCount) return 'English';
  if (spanishCount > englishCount && spanishCount > frenchCount) return 'Spanish';
  if (frenchCount > englishCount && frenchCount > spanishCount) return 'French';

  return 'English'; // Default
}
