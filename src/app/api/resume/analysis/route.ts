// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// // Create or update resume analysis
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { 
//       userId, 
//       resumeId,
//       extractedData,
//       skills,
//       experience,
//       education,
//       missingElements,
//       improvementSuggestions,
//       atsScore,
//       atsIssues,
//       jobRecommendations,
//       careerPathOptions,
//       skillGaps
//     } = body;
// try {
//    // call AI API
// } catch (err) {
//    console.error("AI analysis failed:", err);
//    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
// }

//     if (!userId || !resumeId) {
//       return NextResponse.json(
//         { error: 'User ID and Resume ID are required' },
//         { status: 400 }
//       );
//     }

//     // ✅ Check if user exists in DB
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // ✅ Check if resume exists in DB
//     const resume = await prisma.resume.findUnique({
//       where: { id: resumeId },
//     });

//     if (!resume) {
//       return NextResponse.json(
//         { error: 'Resume not found' },
//         { status: 404 }
//       );
//     }

//     // 🔹 This is the **storage logic**:
//     // Upsert ensures that if analysis for this user+resume exists, update it;
//     // otherwise, create a new record in the `resumeAnalysis` table.
//     const analysis = await prisma.resumeAnalysis.upsert({
//       where: {
//         userId_resumeId: {
//           userId,
//           resumeId,
//         },
//       },
//       update: {
//         // ✅ Update existing analysis with new extracted data
//         extractedData,
//         skills,
//         experience,
//         education,
//         missingElements,
//         improvementSuggestions,
//         atsScore,
//         atsIssues,
//         jobRecommendations,
//         careerPathOptions,
//         skillGaps,
//         updatedAt: new Date(),
//       },
//       create: {
//         // ✅ Create a new analysis entry if one doesn’t exist
//         userId,
//         resumeId,
//         extractedData,
//         skills: skills || [],
//         experience: experience || [],
//         education: education || [],
//         missingElements: missingElements || [],
//         improvementSuggestions,
//         atsScore,
//         atsIssues,
//         jobRecommendations,
//         careerPathOptions,
//         skillGaps,
//       },
//     });

//     // ✅ The saved analysis object is returned as JSON
//     return NextResponse.json(analysis);
//   } catch (error) {
//     console.error('Error creating/updating resume analysis:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while processing your request' },
//       { status: 500 }
//     );
//   }
// }

// // Get resume analysis
// export async function GET(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const userId = url.searchParams.get('userId');
//     const resumeId = url.searchParams.get('resumeId');

//     if (!userId || !resumeId) {
//       return NextResponse.json(
//         { error: 'User ID and Resume ID are required' },
//         { status: 400 }
//       );
//     }

//     // 🔹 Fetch analysis for given user+resume from DB
//     const analysis = await prisma.resumeAnalysis.findUnique({
//       where: {
//         userId_resumeId: {
//           userId,
//           resumeId,
//         },
//       },
//     });
// console.log("Analyze API received:", { contentType: typeof content, fileType });

//     if (!analysis) {
//       return NextResponse.json(
//         { error: 'Analysis not found for this resume' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(analysis);
//   } catch (error) {
//     console.error('Error fetching resume analysis:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while fetching resume analysis' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
// import { callYourAIModel } from "@/lib/ai"; // Example AI call

export async function POST(req: Request) {
  try {
    const { content, fileType } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "No resume content provided" }, { status: 400 });
    }

    // Call AI service (example, replace with your actual model)
    // const aiResult = await callYourAIModel(content);

    // Dummy response for testing
    const aiResult = {
      name: "John Doe",
      contactDetails: "johndoe@email.com",
      skills: ["JavaScript", "React", "Node.js"],
      education: "B.Sc. Computer Science",
      experience: "2 years at Example Corp",
      projects: ["Portfolio Website", "Chat App"],
      language: "English",
    };

    return NextResponse.json(aiResult);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
