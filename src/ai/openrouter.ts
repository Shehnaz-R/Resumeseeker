import OpenAI from 'openai';

// Initialize OpenRouter client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

export const openrouter = {
  // Generate text using OpenRouter
  async generateText(prompt: string, maxTokens: number = 1000): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });

      console.log("OpenRouter response:", JSON.stringify(response, null, 2));

      if (response && response.choices && response.choices.length > 0) {
        return response.choices[0]?.message?.content || "No response generated";
      } else {
        console.error("Invalid response structure:", response);
        return "No response generated";
      }
    } catch (error) {
      console.error("OpenRouter API error:", error);
      throw new Error("Failed to generate text with OpenRouter");
    }
  },

  // Generate structured JSON response with retry logic for rate limiting
  async generateStructuredResponse(prompt: string, schema: any, maxTokens: number = 1000): Promise<any> {
    const maxRetries = 3; // Reduced from 5 to 3 to speed up response
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        console.log(`OpenRouter API call attempt ${attempt + 1}/${maxRetries + 1}`);
        const response = await openai.chat.completions.create({
          model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "user",
              content: `${prompt}\n\nPlease respond with valid JSON matching this schema: ${JSON.stringify(schema)}`,
            },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        });

        console.log("OpenRouter structured response received");

        if (response && response.choices && response.choices.length > 0) {
          const content = response.choices[0]?.message?.content || "{}";

          try {
            const parsed = JSON.parse(content);
            console.log("Successfully parsed JSON response");
            return parsed;
          } catch (parseError) {
            console.error("Failed to parse JSON response:", parseError);
            console.error("Raw content length:", content.length);
            console.error("Raw content preview:", content.substring(0, 500) + (content.length > 500 ? "..." : ""));

            // Try to extract the actual data from the malformed response
            try {
              // Look for the actual data fields in the response
              const nameMatch = content.match(/"name"\s*:\s*"([^"]+)"/);
              const contactMatch = content.match(/"contactDetails"\s*:\s*"([^"]+)"/);
              const skillsMatch = content.match(/"skills"\s*:\s*(\[[^\]]*\])/);
              const experienceMatch = content.match(/"experience"\s*:\s*"([^"]+)"/);
              const educationMatch = content.match(/"education"\s*:\s*"([^"]+)"/);
              const projectsMatch = content.match(/"projects"\s*:\s*(\[[^\]]*\])/);
              const languageMatch = content.match(/"language"\s*:\s*"([^"]+)"/);

              // Also try to extract from the _def structure that was returned
              const defNameMatch = content.match(/"data":\s*{\s*"name"\s*:\s*"([^"]+)"/);
              const defContactMatch = content.match(/"contactDetails"\s*:\s*"([^"]+)"/);
              const defSkillsMatch = content.match(/"skills"\s*:\s*(\[[^\]]*\])/);
              const defExperienceMatch = content.match(/"experience"\s*:\s*(\[[^\]]*\]|[^,}]+)/);
              const defEducationMatch = content.match(/"education"\s*:\s*(\[[^\]]*\]|[^,}]+)/);
              const defProjectsMatch = content.match(/"projects"\s*:\s*(\[[^\]]*\])/);
              const defLanguageMatch = content.match(/"language"\s*:\s*"([^"]+)"/);

              if (nameMatch || contactMatch || skillsMatch || experienceMatch || educationMatch || projectsMatch || languageMatch ||
                defNameMatch || defContactMatch || defSkillsMatch || defExperienceMatch || defEducationMatch || defProjectsMatch || defLanguageMatch) {
                const extractedData: any = {};

                if (nameMatch) extractedData.name = nameMatch[1];
                else if (defNameMatch) extractedData.name = defNameMatch[1];

                if (contactMatch) extractedData.contactDetails = contactMatch[1];
                else if (defContactMatch) extractedData.contactDetails = defContactMatch[1];

                if (skillsMatch) {
                  try {
                    extractedData.skills = JSON.parse(skillsMatch[1]);
                  } catch (e) {
                    extractedData.skills = [];
                  }
                } else if (defSkillsMatch) {
                  try {
                    extractedData.skills = JSON.parse(defSkillsMatch[1]);
                  } catch (e) {
                    extractedData.skills = [];
                  }
                }

                if (experienceMatch) extractedData.experience = experienceMatch[1];
                else if (defExperienceMatch) {
                  try {
                    const expData = defExperienceMatch[1];
                    if (expData.startsWith('[')) {
                      const parsed = JSON.parse(expData);
                      extractedData.experience = parsed.map((exp: any) =>
                        typeof exp === 'object' ? `${exp.title || exp.position || ''} at ${exp.company || ''} (${exp.date || exp.dates || ''})` : exp
                      ).join('; ');
                    } else {
                      extractedData.experience = expData;
                    }
                  } catch (e) {
                    extractedData.experience = 'Experience not available';
                  }
                }

                if (educationMatch) extractedData.education = educationMatch[1];
                else if (defEducationMatch) {
                  try {
                    const eduData = defEducationMatch[1];
                    if (eduData.startsWith('[')) {
                      const parsed = JSON.parse(eduData);
                      extractedData.education = parsed.map((edu: any) =>
                        typeof edu === 'object' ? `${edu.degree || ''} from ${edu.institution || edu.school || ''} (${edu.graduationDate || edu.date || ''})` : edu
                      ).join('; ');
                    } else {
                      extractedData.education = eduData;
                    }
                  } catch (e) {
                    extractedData.education = 'Education not available';
                  }
                }

                if (projectsMatch) {
                  try {
                    extractedData.projects = JSON.parse(projectsMatch[1]);
                  } catch (e) {
                    extractedData.projects = [];
                  }
                } else if (defProjectsMatch) {
                  try {
                    extractedData.projects = JSON.parse(defProjectsMatch[1]);
                  } catch (e) {
                    extractedData.projects = [];
                  }
                }

                if (languageMatch) extractedData.language = languageMatch[1];
                else if (defLanguageMatch) extractedData.language = defLanguageMatch[1];

                console.log("Successfully extracted data from malformed JSON:", extractedData);
                return extractedData;
              }
            } catch (extractError) {
              console.error("Failed to extract data from malformed JSON:", extractError);
            }
          }

          // Try to extract partial JSON if possible
          try {
            const partialContent = content.substring(0, content.lastIndexOf('}') + 1);
            const parsed = JSON.parse(partialContent);
            console.log("Successfully parsed partial JSON");
            return parsed;
          } catch (partialError) {
            console.error("Failed to parse partial JSON:", partialError);
            // Return a fallback response based on the schema
            return this.getFallbackResponse(schema);
          }
        } else {
          console.error("Invalid structured response structure:", response);
          return this.getFallbackResponse(schema);
        }
      } catch (error: any) {
        // Check if it's a 429 rate limit error
        if (error.status === 429 || error.message?.includes('429') || error.message?.includes('rate limit')) {
          attempt++;
          if (attempt <= maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
            console.warn(`OpenRouter rate limit hit (attempt ${attempt}/${maxRetries + 1}). Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            console.error(`OpenRouter rate limit: Max retries (${maxRetries}) exceeded. Using fallback response.`);
            return this.getFallbackResponse(schema);
          }
        } else {
          // For non-429 errors, don't retry
          console.error("OpenRouter structured response error:", error);
          return this.getFallbackResponse(schema);
        }
      }
    }

    // This should never be reached, but just in case
    return this.getFallbackResponse(schema);
  },

  // Get fallback response based on schema
  getFallbackResponse: function (schema: any): any {
    // For resume analysis, provide more specific fallback values
    if (schema && typeof schema === 'object' && (schema.name || schema.properties)) {
      return {
        name: "Name not available",
        contactDetails: "Contact information not available",
        skills: [],
        experience: "Experience not available",
        education: "Education not available",
        projects: [],
        language: "English"
      };
    }

    if (schema.type === "object") {
      const fallback: any = {};
      if (schema.properties) {
        for (const [key, prop] of Object.entries(schema.properties)) {
          const propSchema = prop as any;
          if (propSchema.type === "string") {
            fallback[key] = "Analysis temporarily unavailable due to API limitations";
          } else if (propSchema.type === "number") {
            fallback[key] = 0;
          } else if (propSchema.type === "boolean") {
            fallback[key] = false;
          } else if (propSchema.type === "array") {
            fallback[key] = [];
          } else {
            fallback[key] = null;
          }
        }
      }
      return fallback;
    }
    return {}; // Return empty object for unknown schemas like Zod
  }
};

export default openrouter;
