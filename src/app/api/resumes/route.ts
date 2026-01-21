//C:\Users\shehn\home_projects\ResumeSeeker\src\app\api\resumes\route.ts
import { NextResponse } from "next/server";
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth"; // For DOCX
import Tesseract from "tesseract.js"; // For OCR on images
import { db } from "@/lib/db";
import { analyzeResume } from "@/ai/flows/resume-analyzer-openrouter"; // <-- analysis
import { analyzeResumeAndScore } from "@/ai/flows/resume-score-openrouter"; // <-- scoring
import path from "path";
import fs from "fs";
import { getJobRecommendations } from "@/ai/flows/job-recommender-updated";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string | null;
    const userId = formData.get("userId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = file.type;

    let textContent = "";

    // 1. Extract text depending on file type
    console.log("Extracting text from file type:", fileType);
    if (fileType === "application/pdf") {
      const pdfData = await pdfParse.default(buffer);
      textContent = pdfData.text;
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      textContent = result.value;
    } else if (
      fileType === "image/jpeg" ||
      fileType === "image/jpg" ||
      fileType === "image/png"
    ) {
      const result = await Tesseract.recognize(buffer, "eng");
      textContent = result.data.text;
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    console.log("Text extraction completed, length:", textContent.length);

    // 2. Run AI Resume Analysis BEFORE storing
    console.log("Starting resume analysis...");
    const analysisResult = await analyzeResume({
      resumeText: textContent, // Pass the extracted text instead of data URI
    });
    console.log("Resume analysis completed:", analysisResult);

    // 3. Run AI Resume Scoring
    console.log("Starting resume scoring...");
    let scoreResult;
    try {
      scoreResult = await analyzeResumeAndScore({
        resumeText: textContent,
      });
      console.log("Resume scoring completed:", scoreResult);
    } catch (scoreError: any) {
      console.warn("Resume scoring failed, using default score:", scoreError.message);
      // Provide a fallback score if scoring fails
      scoreResult = {
        score: 75, // Default score
        feedback: "Analysis completed with default scoring due to API limitations"
      };
    }

    // 5. Get Job Recommendations
    console.log("Starting job recommendations...");
    let jobRecommendations: { jobs: any[] } = { jobs: [] }; // Default to empty array
    if (analysisResult?.skills && analysisResult?.experience && analysisResult.experience.length > 0) {
        try {
            jobRecommendations = await getJobRecommendations({
                skills: analysisResult.skills,
                experienceSummary: analysisResult.experience, // Pass experience as string
                projectsSummary: analysisResult.projects || [],
                targetRole: undefined,
            });
            console.log("Job recommendations completed:", jobRecommendations.jobs.length, "jobs found");
        } catch (jobRecError: any) {
            console.warn("Job recommendations generation failed:", jobRecError.message);
            // Fallback to empty recommendations if there's an error
            jobRecommendations = { jobs: [] };
        }
    } else {
        console.log("Skipping job recommendations - insufficient analysis data");
    }

    // 6. Save resume to database with score (if applicable for candidate portal)
    const resume = await db.resume.create({
      data: {
        userId,
        title: title || file.name.replace(/\.[^/.]+$/, ""),
        content: buffer,
        fileType,
        sentimentScore: scoreResult.score, // Save the score to database
      },
      include: {
        user: true,
      },
    });

    // 4. Save resume to file system organized by user and title
    if (resume.user) {
      const userName = resume.user.name || "unknown_user";
      const sanitizedUserName = userName.replace(/[^a-zA-Z0-9]/g, "_");
      const sanitizedResumeName = (title || file.name).replace(/[^a-zA-Z0-9]/g, "_");

      const userDir = path.join(process.cwd(), "data", "resumes", sanitizedUserName);

      try {
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
        }
        let fileExtension = "json";
        if (fileType === "application/pdf") {
          fileExtension = "pdf";
        } else if (
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          fileExtension = "docx";
        } else if (fileType.startsWith("image/")) {
          fileExtension = fileType.split("/")[1];
        }
        const filePath = path.join(userDir, `${sanitizedResumeName}.${fileExtension}`);

        if (fileExtension === "json") {
          fs.writeFileSync(
            filePath,
            JSON.stringify({ textContent, analysis: analysisResult }, null, 2)
          );
        } else {
          fs.writeFileSync(filePath, buffer);
        }
      } catch (fsError) {
        console.error("Error saving resume to file system:", fsError);
      }
    }

    return NextResponse.json({
      success: true,
      resume,
      analysis: analysisResult,
      score: scoreResult, // Include the score result
      content: buffer, // Return the binary buffer for frontend to convert to base64
      fileType,
      jobRecommendations, // Include job recommendations
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}
