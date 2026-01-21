// src/ai/flows/career-roadmap-openrouter.ts
'use server';
/**
 * @fileOverview Generates a career roadmap in a graph format based on resume analysis and a target role.
 * The output is structured as nodes (skills, concepts, tools) and edges (dependencies),
 * suitable for rendering with graph libraries like react-flow.
 * It also integrates with roadmap.sh by instructing the LLM to consider its structure.
 *
 * - generateCareerRoadmap - A function that handles the career roadmap generation.
 * - CareerRoadmapInput - The input type for the function.
 * - CareerRoadmapOutput - The return type for the function.
 * - RoadmapNode - The type for a node in the career roadmap graph.
 * - RoadmapEdge - The type for an edge in the career roadmap graph.
 * - RoadmapResource - The type for a learning resource associated with a node.
 */

import { openrouter } from '../openrouter';
import { z } from 'zod';

// Assuming AnalyzeResumeOutput structure from resume-analyzer.ts
const ResumeAnalysisSchemaForRoadmap = z.object({
  name: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(), // Summary of experience
  education: z.string().optional(),
  projects: z.array(z.string()).optional(),
  language: z.string().optional(),
});

const CareerRoadmapInputSchema = z.object({
  resumeAnalysis: ResumeAnalysisSchemaForRoadmap.describe("The analyzed data from the user's resume."),
  currentRole: z.string().optional().describe("The user's current role, if any, extracted from the resume or explicitly stated."),
  targetRole: z.string().describe("The user's desired target role (e.g., 'Frontend Developer', 'DevOps Engineer')."),
  useRoadmapSHStructure: z.boolean().optional().default(true).describe("Whether to base the roadmap structure on common patterns found on roadmap.sh for the given role."),
});
export type CareerRoadmapInput = z.infer<typeof CareerRoadmapInputSchema>;

const RoadmapResourceSchema = z.object({
  name: z.string().describe("The name of the learning resource (e.g., 'MDN Web Docs', 'Egghead.io course'). This field is mandatory for each resource."),
  url: z.string().optional().describe("An optional direct URL to the learning resource. If provided, it must be a valid and functional hyperlink. Example: 'https://developer.mozilla.org/en-US/docs/Web/HTML'"),
});
export type RoadmapResource = z.infer<typeof RoadmapResourceSchema>;

const RoadmapNodeSchema = z.object({
  id: z.string().describe("A unique, slug-like identifier for the node (e.g., 'html', 'javascript_basics', 'cicd_pipelines')."),
  label: z.string().describe("The display name of the skill, concept, or tool (e.g., 'HTML', 'JavaScript Basics', 'CI/CD Pipelines')."),
  stage: z.enum(["Fundamentals", "Core Skills", "Advanced Topics", "Optional/Nice-to-Have"]).describe("The learning stage this node belongs to."),
  description: z.string().optional().describe("A brief description of what this node/skill entails, why it's important for the target role, and key learning objectives. This should be concise but informative."),
  resources: z.array(RoadmapResourceSchema).default([]).describe("A list of 1-2 specific learning resource suggestions. Each resource object MUST contain a 'name' and can optionally include a 'url'. Ensure resources are relevant and URLs are plausible."),
});
export type RoadmapNode = z.infer<typeof RoadmapNodeSchema>;

const RoadmapEdgeSchema = z.object({
  source: z.string().describe("The 'id' of the source/prerequisite node."),
  target: z.string().describe("The 'id' of the target/dependent node."),
  label: z.string().optional().describe("An optional short label for the edge describing the dependency (e.g., 'builds upon', 'requires understanding of')."),
});
export type RoadmapEdge = z.infer<typeof RoadmapEdgeSchema>;

const CareerRoadmapOutputSchema = z.object({
  introduction: z.string().describe("A brief introduction to the roadmap, acknowledging the user's aspiration for the target role."),
  nodes: z.array(RoadmapNodeSchema).describe("A list of 15-25 nodes representing skills, concepts, or tools, depending on role complexity. Each node must have an id, label, stage, and a resources array (possibly empty). Ensure nodes are ordered logically by stage."),
  edges: z.array(RoadmapEdgeSchema).describe("A list of directed edges showing learning dependencies between nodes. Each edge must have a source and target id."),
  potentialCertifications: z.array(z.string()).optional().describe("A list of 2-3 relevant certifications for the target role."),
  projectIdeas: z.array(z.string()).optional().describe("A list of 2-3 project ideas to build a portfolio relevant to the target role."),
  estimatedSalaryRange: z.string().optional().describe("An estimated general salary range for the target role (e.g., '$X - $Y per year')."),
  closingMotivation: z.string().describe("A brief motivational closing statement."),
});
export type CareerRoadmapOutput = z.infer<typeof CareerRoadmapOutputSchema>;

// Helper function to generate role-specific fallback content
function getRoleSpecificFallback(targetRole: string) {
  const role = targetRole.toLowerCase();

  if (role.includes('frontend') || role.includes('web developer')) {
    return {
      certifications: ["AWS Certified Cloud Practitioner", "Google Associate Cloud Engineer"],
      projects: ["Build a responsive portfolio website", "Create a React dashboard application", "Develop a mobile-first e-commerce site"],
      salary: "$70,000 - $120,000 per year"
    };
  } else if (role.includes('backend') || role.includes('fullstack')) {
    return {
      certifications: ["AWS Certified Developer", "Microsoft Azure Developer Associate"],
      projects: ["Build a RESTful API with Node.js", "Create a microservices architecture", "Develop a real-time chat application"],
      salary: "$80,000 - $130,000 per year"
    };
  } else if (role.includes('data') || role.includes('analyst')) {
    return {
      certifications: ["Google Data Analytics Professional Certificate", "Microsoft Certified: Azure AI Engineer Associate"],
      projects: ["Build a data visualization dashboard", "Create a predictive analytics model", "Develop an ETL pipeline"],
      salary: "$65,000 - $110,000 per year"
    };
  } else if (role.includes('devops') || role.includes('infrastructure')) {
    return {
      certifications: ["AWS Certified DevOps Engineer", "Kubernetes Certified Administrator"],
      projects: ["Set up CI/CD pipeline with Jenkins", "Deploy containerized applications", "Implement infrastructure as code"],
      salary: "$90,000 - $140,000 per year"
    };
  } else if (role.includes('product') || role.includes('manager')) {
    return {
      certifications: ["Certified Scrum Product Owner", "Pragmatic Institute Product Management"],
      projects: ["Conduct user research and create personas", "Develop a product roadmap", "Run A/B testing experiments"],
      salary: "$85,000 - $150,000 per year"
    };
  } else {
    // Generic fallback
    return {
      certifications: ["Professional certification in your field", "Industry-specific certification"],
      projects: ["Build a portfolio project", "Contribute to open source", "Create a personal project"],
      salary: "Salary range varies by location and experience"
    };
  }
}

export async function generateCareerRoadmap(input: CareerRoadmapInput): Promise<CareerRoadmapOutput> {
  try {
    console.log("Starting career roadmap generation with OpenRouter...");

    const prompt = `
You are an expert AI career coach and strategist. Your task is to generate a detailed career roadmap in a graph format for a user aspiring to the role of '${input.targetRole}', considering their current resume profile.

Resume Analysis Summary (for context):
Skills: ${input.resumeAnalysis.skills?.join(', ') || 'Not specified'}
Experience Summary: ${input.resumeAnalysis.experience || 'Not specified'}
${input.currentRole ? `Current Role (deduced or stated): ${input.currentRole}` : ''}

CRITICAL: You must respond ONLY with a valid JSON object that matches this exact schema. Do not include any explanatory text, markdown formatting, or anything else. Start your response with { and end with }.

The JSON must have these exact fields:
{
  "introduction": "A brief encouraging introduction",
  "nodes": [
    {
      "id": "unique_slug_identifier",
      "label": "Display Name",
      "stage": "Fundamentals",
      "description": "Brief description",
      "resources": [{"name": "Resource Name", "url": "https://example.com"}]
    }
  ],
  "edges": [
    {
      "source": "node_id_1",
      "target": "node_id_2",
      "label": "prerequisite for"
    }
  ],
  "potentialCertifications": ["Certification 1", "Certification 2"],
  "projectIdeas": ["Project idea 1", "Project idea 2"],
  "estimatedSalaryRange": "$X - $Y per year",
  "closingMotivation": "Motivational message"
}

Requirements:
- Generate 15-25 nodes ordered by stage: Fundamentals, Core Skills, Advanced Topics, Optional/Nice-to-Have
- Ensure all edge source/target IDs exist in nodes array
- Include 2-3 certifications and project ideas
- Make node IDs unique slug-like strings (e.g., 'html_basics', 'javascript_fundamentals')

Return ONLY the JSON object:`;

    console.log("Sending prompt to OpenRouter...");
    const response = await openrouter.generateStructuredResponse(
      prompt,
      CareerRoadmapOutputSchema,
      2000
    );

    console.log("OpenRouter roadmap response:", response);

    // Post-process the response to ensure correct data types and transform AI's node structure
    const rawNodes = response.nodes || response.Nodes || [];
    const transformedNodes = Array.isArray(rawNodes) ? rawNodes.map((node, index) => {
      let label, description, resources;

      if (node.data) {
        // Handle nested data structure from AI
        label = node.data.label || node.label || "Unnamed Skill";
        description = node.data.description || node.description || `Learn about ${label}.`;
        resources = Array.isArray(node.data.resources) ? node.data.resources.map((r: any) =>
          typeof r === 'string' ? { name: r, url: undefined } : { name: r.name || r, url: r.url || undefined }
        ) : [];
      } else {
        // Handle flat structure
        label = node.label || "Unnamed Skill";
        description = node.description || `Learn about ${label}.`;
        resources = Array.isArray(node.resources) ? node.resources.map((r: any) =>
          typeof r === 'string' ? { name: r, url: undefined } : { name: r.name || r, url: r.url || undefined }
        ) : [];
      }

      // Assign stage based on index (since AI may not provide it)
      let stage: "Fundamentals" | "Core Skills" | "Advanced Topics" | "Optional/Nice-to-Have";
      if (index < 5) stage = "Fundamentals";
      else if (index < 10) stage = "Core Skills";
      else if (index < 15) stage = "Advanced Topics";
      else stage = "Optional/Nice-to-Have";

      return {
        id: node.id || `node_${index}`,
        label,
        stage,
        description,
        resources
      };
    }) : [];

    const rawEdges = response.edges || response.Edges || [];
    const transformedEdges = Array.isArray(rawEdges) ? rawEdges.map(edge => ({
      source: edge.source || edge.from,
      target: edge.target || edge.to,
      label: edge.label || "prerequisite for"
    })) : [];

    // If no edges provided, create default edges connecting stages
    if (transformedEdges.length === 0 && transformedNodes.length > 1) {
      const stages = ["Fundamentals", "Core Skills", "Advanced Topics", "Optional/Nice-to-Have"];
      stages.forEach((stage, stageIndex) => {
        const stageNodes = transformedNodes.filter(n => n.stage === stage);
        if (stageNodes.length > 1) {
          // Connect nodes within the same stage
          for (let i = 0; i < stageNodes.length - 1; i++) {
            transformedEdges.push({
              source: stageNodes[i].id,
              target: stageNodes[i + 1].id,
              label: "leads to"
            });
          }
        }
        // Connect last node of previous stage to first of current stage
        if (stageIndex > 0) {
          const prevStageNodes = transformedNodes.filter(n => n.stage === stages[stageIndex - 1]);
          if (prevStageNodes.length > 0 && stageNodes.length > 0) {
            transformedEdges.push({
              source: prevStageNodes[prevStageNodes.length - 1].id,
              target: stageNodes[0].id,
              label: "prerequisite for"
            });
          }
        }
      });
    }

    const processedResponse = {
      introduction: response.introduction || response.Introduction || `Welcome to your journey towards becoming a ${input.targetRole}!`,
      nodes: transformedNodes,
      edges: transformedEdges,
      potentialCertifications: Array.isArray(response.potentialCertifications || response['Potential Certifications']) && (response.potentialCertifications || response['Potential Certifications']).length > 0 ? (response.potentialCertifications || response['Potential Certifications']) : ["AWS Certified Solutions Architect", "Google Cloud Professional Cloud Architect"],
      projectIdeas: Array.isArray(response.projectIdeas || response['Project Ideas']) && (response.projectIdeas || response['Project Ideas']).length > 0 ? (response.projectIdeas || response['Project Ideas']) : ["Build a personal portfolio website", "Contribute to open source projects", "Create a mobile app"],
      estimatedSalaryRange: response.estimatedSalaryRange || response['Estimated Salary Range'] || "Salary range not available",
      closingMotivation: response.closingMotivation || response['Closing Motivation'] || "Keep learning and growing in your career!"
    };

    // Validate edges (simple check: source/target exist)
    const nodeIds = new Set(processedResponse.nodes.map(n => n.id));
    processedResponse.edges = processedResponse.edges.filter((edge: RoadmapEdge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

    console.log("Processed roadmap response:", processedResponse);
    return processedResponse;
  } catch (error) {
    console.error('Career roadmap generation error:', error);

    // Generate meaningful fallback roadmap based on resume analysis
    const skills = input.resumeAnalysis.skills || [];
    const experience = input.resumeAnalysis.experience || '';
    const education = input.resumeAnalysis.education || '';

    // Create nodes from resume skills
    const skillNodes: RoadmapNode[] = skills.slice(0, 8).map((skill, index) => ({
      id: `skill_${index}`,
      label: skill,
      stage: index < 3 ? "Fundamentals" : index < 6 ? "Core Skills" : "Advanced Topics",
      description: `Master ${skill} - essential for ${input.targetRole} role`,
      resources: [
        { name: `Learn ${skill} on Udemy`, url: `https://www.udemy.com/topic/${skill.toLowerCase().replace(/\s+/g, '-')}/` },
        { name: `${skill} Documentation`, url: `https://developer.mozilla.org/en-US/docs/Web/${skill}` }
      ]
    }));

    // Add experience-based nodes
    const experienceNode: RoadmapNode = {
      id: "experience_building",
      label: "Experience Building",
      stage: "Core Skills",
      description: `Leverage your ${experience.length > 50 ? experience.substring(0, 50) + '...' : experience} to advance in ${input.targetRole}`,
      resources: []
    };

    // Add education-based node if available
    const educationNodes: RoadmapNode[] = education ? [{
      id: "continued_education",
      label: "Continued Education",
      stage: "Advanced Topics",
      description: `Build upon your ${education} with advanced learning for ${input.targetRole}`,
      resources: [
        { name: "Coursera Specializations", url: "https://www.coursera.org/specializations" },
        { name: "edX Professional Certificates", url: "https://www.edx.org/professional-certificate" }
      ]
    }] : [];

    // Combine all nodes
    const allNodes = [...skillNodes, experienceNode, ...educationNodes];

    // Create edges connecting the nodes
    const edges: RoadmapEdge[] = [];
    for (let i = 0; i < allNodes.length - 1; i++) {
      edges.push({
        source: allNodes[i].id,
        target: allNodes[i + 1].id,
        label: "leads to"
      });
    }

    // Generate role-specific content
    const roleSpecificContent = getRoleSpecificFallback(input.targetRole);

    return {
      introduction: `Welcome to your personalized journey towards becoming a ${input.targetRole}! Based on your resume analysis, here's a tailored roadmap to help you advance in your career.`,
      nodes: allNodes,
      edges: edges,
      potentialCertifications: roleSpecificContent.certifications,
      projectIdeas: roleSpecificContent.projects,
      estimatedSalaryRange: roleSpecificContent.salary,
      closingMotivation: "Keep learning and growing in your career! Every step forward brings you closer to your goals."
    };
  }
}
