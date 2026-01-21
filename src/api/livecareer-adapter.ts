// src/api/livecareer-adapter.ts
'use client';

import { LiveCareerResumeParseResponse, LiveCareerJobMatchResponse, OpenAiResumeParseResponse } from './livecareer-api';
import { AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { RecruiterMatchOutput } from '@/ai/flows/recruiter-matcher-flow';

/**
 * Converts LiveCareer resume parse response to the application's AnalyzeResumeOutput format
 * @param liveCareerResponse The response from LiveCareer API
 * @returns Formatted resume analysis data
 */
export function convertToResumeAnalysis(liveCareerResponse: LiveCareerResumeParseResponse): AnalyzeResumeOutput;

/**
 * Converts OpenAI resume parse response to the application's AnalyzeResumeOutput format
 * @param openAiResponse The response from OpenAI API
 * @returns Formatted resume analysis data
 */
export function convertToResumeAnalysis(openAiResponse: OpenAiResumeParseResponse): AnalyzeResumeOutput;

export function convertToResumeAnalysis(response: LiveCareerResumeParseResponse | OpenAiResumeParseResponse): AnalyzeResumeOutput {
    // Check if it's OpenAI response (has no 'id' field)
    if ('id' in response) {
        // LiveCareer response
        const liveCareerResponse = response as LiveCareerResumeParseResponse;
        // Extract education information
        const educationText = liveCareerResponse.education.map(edu =>
            `${edu.degree || ''} in ${edu.fieldOfStudy || ''} from ${edu.institution || ''} (${edu.startDate || ''} - ${edu.endDate || ''})`
        ).join('\n');

        // Extract experience information
        const experienceText = liveCareerResponse.experience.map(exp =>
            `${exp.title || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || ''})\n${exp.description || ''}`
        ).join('\n\n');

        return {
            name: liveCareerResponse.name || '',
            contactDetails: `Email: ${liveCareerResponse.email || ''}, Phone: ${liveCareerResponse.phone || ''}`,
            skills: liveCareerResponse.skills || [],
            education: educationText,
            experience: experienceText,
            projects: [], // LiveCareer might not provide projects directly in the parsed response
            language: 'English', // Default to English
        };
    } else {
        // OpenAI response
        const openAiResponse = response as OpenAiResumeParseResponse;
        // Extract education information
        const educationText = openAiResponse.education.map(edu =>
            `${edu.degree || ''} in ${edu.fieldOfStudy || ''} from ${edu.institution || ''} (${edu.startDate || ''} - ${edu.endDate || ''})`
        ).join('\n');

        // Extract experience information
        const experienceText = openAiResponse.experience.map(exp =>
            `${exp.title || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || ''})\n${exp.description || ''}`
        ).join('\n\n');

        return {
            name: openAiResponse.name || '',
            contactDetails: `Email: ${openAiResponse.email || ''}, Phone: ${openAiResponse.phone || ''}`,
            skills: openAiResponse.skills || [],
            education: educationText,
            experience: experienceText,
            projects: [], // OpenAI might not provide projects directly
            language: 'English', // Default to English
        };
    }
}

/**
 * Converts LiveCareer job match response to the application's RecruiterMatchOutput format
 * @param liveCareerResponse The response from LiveCareer API
 * @param resumeAnalysis The resume analysis data
 * @returns Formatted job match data
 */
export function convertToJobMatch(
    liveCareerResponse: LiveCareerJobMatchResponse,
    resumeAnalysis: AnalyzeResumeOutput
): RecruiterMatchOutput {
    const fitmentScore = liveCareerResponse.matchScore;

    let assessment: string;
    if (fitmentScore >= 80) assessment = 'Excellent Fit';
    else if (fitmentScore >= 60) assessment = 'Good Fit';
    else if (fitmentScore >= 40) assessment = 'Fair Match';
    else assessment = 'Needs Significant Improvement';

    // Simplified mapping for demonstration. In a real scenario, LiveCareer might provide more detailed match data.
    const keyMatches: string[] = [
        `Matched ${liveCareerResponse.matchDetails.skillsMatch.matched.length} key skills.`,
        `Experience match: ${liveCareerResponse.matchDetails.experienceMatch}%`,
    ];
    const keyMismatches: string[] = [
        `Missing ${liveCareerResponse.matchDetails.skillsMatch.missing.length} key skills.`,
    ];

    // Dummy JD skills analysis for LiveCareer. In a real integration, LiveCareer might provide this.
    const jdSkillsAnalysis = {
        identifiedSkillsInJd: resumeAnalysis.skills, // Using resume skills as a proxy
        mandatorySkillsMet: liveCareerResponse.matchDetails.skillsMatch.matched,
        optionalSkillsMet: [], // Not explicitly provided by mock
        missingMandatorySkills: liveCareerResponse.matchDetails.skillsMatch.missing,
        missingOptionalSkills: [], // Not explicitly provided by mock
        additionalSkillsInResume: [], // Not explicitly provided by mock
    };

    const courseRecommendations = liveCareerResponse.recommendations?.courses.map(course => ({
        title: course.title,
        platform: course.provider,
        description: `Improve your skills in ${course.title} by taking this course.`,
        url: course.url,
        focusArea: undefined,
    })) || [];

    return {
        fitmentScore,
        assessment,
        reasoning: `Overall fitment score is ${fitmentScore}%. The candidate has a strong match in skills and experience with the job description.`,
        keyMatches,
        keyMismatches,
        jdSkillsAnalysis,
        courseRecommendations,
    };
}