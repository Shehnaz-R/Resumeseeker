"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AuthGuard } from '@/components/auth-guard';
import { ResumeUploadForm } from '@/components/resume-upload-form';
import { AnalysisResultsDisplay } from '@/components/analysis-results-display';
import { ScoreFeedbackDisplay } from '@/components/score-feedback-display';
import { JobRecommendationsDisplay } from '@/components/job-recommendations-display';
import { InteractiveFeedback } from '@/components/interactive-feedback';
import dynamic from 'next/dynamic';

// Lazy load heavy components for better performance
const CareerRoadmapDisplay = dynamic(() => import('@/components/career-roadmap-display').then(mod => ({ default: mod.CareerRoadmapDisplay })), {
  loading: () => <QuickLoading />,
  ssr: false
});

const BiasDetectionDisplay = dynamic(() => import('@/components/bias-detection-display').then(mod => ({ default: mod.BiasDetectionDisplay })), {
  loading: () => <QuickLoading />,
  ssr: false
});

const CourseRecommendationsDisplay = dynamic(() => import('@/components/course-recommendations-display').then(mod => ({ default: mod.CourseRecommendationsDisplay })), {
  loading: () => <QuickLoading />,
  ssr: false
});

const ResumeSummaryDisplay = dynamic(() => import('@/components/resume-summary-display').then(mod => ({ default: mod.ResumeSummaryDisplay })), {
  loading: () => <QuickLoading />,
  ssr: false
});
import { LoadingIndicator } from '@/components/loading-indicator';
import { AILoading, QuickLoading } from '@/components/ai-loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fileToDataUri } from '@/lib/file-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileText, Sparkles, Target, Bot, MapPinned, Filter, BookOpen, Lightbulb, ShieldAlert, Info, BookText as BookTextIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Use React.memo to prevent unnecessary re-renders of the entire component
const CandidatePortalContent = React.memo(function CandidatePortalContent() {
  // Use useReducer instead of multiple useState calls for better performance
  const [state, dispatch] = React.useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case 'SET_UPLOADED_FILE':
          return { ...state, uploadedFile: action.payload };
        case 'SET_ANALYSIS_RESULT':
          return { ...state, analysisResult: action.payload };
        case 'SET_SCORE_RESULT':
          return { ...state, scoreResult: action.payload };
        case 'SET_JOB_RECOMMENDATIONS':
          return { ...state, jobRecommendations: action.payload };
        case 'SET_IS_PROCESSING':
          return { ...state, isProcessing: action.payload };
        case 'SET_ERROR':
          return { ...state, error: action.payload };
        case 'SET_CURRENT_STAGE':
          return { ...state, currentStage: action.payload };
        case 'SET_ACTIVE_TAB':
          return { ...state, activeTab: action.payload };
        case 'SET_DERIVED_TARGET_ROLE':
          return { ...state, derivedTargetRole: action.payload };
        case 'SET_RESUME_ID':
          return { ...state, resumeId: action.payload };
        case 'SET_ANALYSIS_PROGRESS':
          return { ...state, analysisProgress: action.payload };
        case 'RESET_STATE':
          return {
            ...state,
            analysisResult: null,
            scoreResult: null,
            jobRecommendations: null,
            error: null,
            activeTab: "analysis",
            derivedTargetRole: undefined,
            resumeId: null
          };
        default:
          return state;
      }
    },
    {
      uploadedFile: null,
      analysisResult: null,
      scoreResult: null,
      jobRecommendations: null,
      isProcessing: false,
      error: null,
      currentStage: "",
      activeTab: "analysis",
      derivedTargetRole: undefined,
      resumeId: null,
      analysisProgress: 0
    }
  );

  // Destructure state for easier access
  const {
    uploadedFile,
    analysisResult,
    scoreResult,
    jobRecommendations,
    isProcessing,
    error,
    currentStage,
    activeTab,
    derivedTargetRole,
    resumeId,
    analysisProgress
  } = state;

  // Optimize useEffect to use dispatch
  useEffect(() => {
    if (!uploadedFile) {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [uploadedFile]);

  // Optimize handleAnalyzeResume to use dispatch and memoization
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchUserId() {
      try {
        // Fetch user profile to get userId
        // Remove Authorization header to match backend expectation of userId in query param
        const token = localStorage.getItem('authToken_ResumeSeeker');
        if (!token) {
          setUserId(null);
          return;
        }
        // Decode token to get userId or fetch from profile API with userId query param
        // For now, try to decode JWT token payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        if (payload && payload.userId) {
          setUserId(payload.userId);
          console.log("User ID from JWT payload:", payload.userId);
          return;
        }
        // Fallback: fetch profile API with userId query param (if available)
        const response = await fetch(`/api/user/profile?userId=${payload.userId || ''}`);
        if (!response.ok) {
          setUserId(null);
          console.log("Failed to fetch user profile, setting userId to null.");
          return;
        }
        const user = await response.json();
        setUserId(user.id);
        console.log("User ID from profile API:", user.id);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserId(null);
        console.log("Error fetching user profile, setting userId to null.");
      }
    }
    fetchUserId();
  }, []);

  const handleAnalyzeResume = useCallback(async (file: File, title?: string) => {
    console.log("handleAnalyzeResume called. Current userId:", userId);
    if (!userId) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated. Please log in.' });
      return;
    }
    dispatch({ type: 'SET_IS_PROCESSING', payload: true });
    dispatch({ type: 'RESET_STATE' });
    dispatch({ type: 'SET_UPLOADED_FILE', payload: file });
    dispatch({ type: 'SET_ANALYSIS_PROGRESS', payload: 10 });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: "analysis" });

    try {
      requestAnimationFrame(() => {
        dispatch({ type: 'SET_CURRENT_STAGE', payload: "Uploading and analyzing resume..." });
        dispatch({ type: 'SET_ANALYSIS_PROGRESS', payload: 20 });
      });

      // Upload resume file first with userId
      const formData = new FormData();
      // Add userId to formData as backend requires it
      formData.append("userId", userId);
      formData.append("title", title || file.name.replace(/\.[^/.]+$/, ""));
      formData.append("file", file);

      // Retry mechanism for API call
      const maxRetries = 3;
      let attempt = 0;
      let uploadResponse;

      while (attempt < maxRetries) {
        try {
          uploadResponse = await fetch("/api/resumes", {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            break; // Success, exit retry loop
          } else {
            // Check if it's a client error (4xx), don't retry
            if (uploadResponse.status >= 400 && uploadResponse.status < 500) {
              const errorData = await uploadResponse.json().catch(() => ({ message: "Unknown error from server" }));
              console.error("Server responded with client error:", errorData);
              throw new Error(`Failed to upload resume: ${errorData.message || "Unknown error"}`);
            }
            // Server error (5xx), retry
            attempt++;
            if (attempt < maxRetries) {
              const delay = 1000 * Math.pow(2, attempt); // Exponential backoff
              dispatch({ type: 'SET_CURRENT_STAGE', payload: `Retrying upload (attempt ${attempt + 1}/${maxRetries})...` });
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              const errorData = await uploadResponse.json().catch(() => ({ message: "Unknown error from server" }));
              throw new Error(`Failed to upload resume after ${maxRetries} attempts: ${errorData.message || "Unknown error"}`);
            }
          }
        } catch (fetchError) {
          // Network error or other fetch failure, retry
          attempt++;
          if (attempt < maxRetries) {
            const delay = 1000 * Math.pow(2, attempt); // Exponential backoff
            dispatch({ type: 'SET_CURRENT_STAGE', payload: `Retrying upload (attempt ${attempt + 1}/${maxRetries})...` });
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw new Error(`Failed to upload resume after ${maxRetries} attempts due to network error`);
          }
        }
      }

      const uploadedResume = await uploadResponse.json();
      const { content, fileType, analysis, score, resume, jobRecommendations } = uploadedResume;

      if (!content || !fileType) {
        throw new Error("Uploaded resume content or fileType missing");
      }

      // Use the analysis and score directly from the upload response
      dispatch({ type: 'SET_ANALYSIS_RESULT', payload: analysis });
      dispatch({ type: 'SET_ANALYSIS_PROGRESS', payload: 80 });
      
      // Set the score from the upload response
      if (score) {
        dispatch({ type: 'SET_SCORE_RESULT', payload: score });
      }
      
      dispatch({ type: 'SET_ANALYSIS_PROGRESS', payload: 100 });

      // Store the resume ID for other API calls
      dispatch({ type: 'SET_RESUME_ID', payload: resume?.id });

      // Set job recommendations
      if (jobRecommendations) {
        dispatch({ type: 'SET_JOB_RECOMMENDATIONS', payload: jobRecommendations });
      }

    } catch (err) {
      console.error("Error during resume processing:", err);
      let errorMessage = `Error during ${currentStage}: An unknown error occurred.`;
      if (err instanceof Error) {
        if (err.message.includes("GoogleGenerativeAI Error") ||
          err.message.includes("500") ||
          err.message.includes("503") ||
          err.message.toLowerCase().includes("service unavailable") ||
          err.message.toLowerCase().includes("internal server error") ||
          err.message.toLowerCase().includes("overloaded")) {
          errorMessage = `Error during ${currentStage}: The AI service seems to be temporarily unavailable or overloaded. Please try again in a few minutes. (Details: ${err.message})`;
        } else {
          errorMessage = `Error during ${currentStage}: ${err.message}`;
        }
      }
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      setTimeout(() => {
        dispatch({ type: 'SET_IS_PROCESSING', payload: false });
        dispatch({ type: 'SET_CURRENT_STAGE', payload: "" });
      }, 100);
    }
  }, [currentStage, dispatch, userId]);

  // Memoize the content rendering for better performance
  const renderContent = useCallback(() => {
    // Use early returns for conditional rendering to improve performance
    if (isProcessing) {
      return (
        <AILoading 
          message={currentStage || "Processing your resume..."}
          showProgress={true}
          progress={analysisProgress}
        />
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="shadow-lg">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="font-semibold text-lg">Processing Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!analysisResult) {
      // Optimize image loading with next/image
      return (
        <Card className="shadow-xl text-center bg-card/80 backdrop-blur-sm border border-primary/20">
          <CardHeader className="pt-10">
            <div className="mx-auto inline-block p-5 bg-primary/10 rounded-full text-primary mb-6 ring-4 ring-primary/20 animate-pulse">
              <BarChart className="w-16 h-16" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Resume Analysis Suite</CardTitle>
          </CardHeader>
          <CardContent className="pb-10">
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Upload your resume (PDF, DOCX, JPG, PNG) to unlock AI-driven insights, scores, job matches, and a personalized career roadmap.
            </p>
            <Image
              src="https://placehold.co/800x400.png"
              alt="Illustration of resume analysis and career growth"
              width={800}
              height={400}
              className="rounded-xl shadow-2xl mx-auto object-cover"
              priority
              loading="eager"
            />
          </CardContent>
        </Card>
      );
    }

    const TABS_CONFIG = [
      { value: "analysis", icon: FileText, label: "Analysis", disabled: false },
      { value: "summary", icon: BookTextIcon, label: "Summary", disabled: false },
      { value: "feedback", icon: Bot, label: "AI Chat", disabled: false },
      { value: "jobs", icon: Target, label: "Jobs", disabled: !scoreResult || scoreResult.score < 30 },
      { value: "roadmap", icon: MapPinned, label: "Roadmap", disabled: false },
      { value: "bias", icon: Filter, label: "Bias Check", disabled: false },
      { value: "courses", icon: BookOpen, label: "Courses", disabled: false },
    ];

    return (
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => {
          // Optimize tab switching with requestAnimationFrame
          requestAnimationFrame(() => {
            dispatch({ type: 'SET_ACTIVE_TAB', payload: value });
          });
        }}
        className="w-full">
        <TabsList className="flex w-full gap-1 mb-8 p-1 bg-muted rounded-xl shadow-inner">
          {TABS_CONFIG.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className="tab-button flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg transition-all duration-200 hover:bg-muted/50 hover:scale-105 hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex-1 min-w-0"
            >
              <tab.icon size={14} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      <TabsContent value="analysis">
        <div className="space-y-10">
          {scoreResult && <ScoreFeedbackDisplay scoreData={scoreResult} />}
          {analysisResult && <AnalysisResultsDisplay analysis={analysisResult} />}
        </div>
      </TabsContent>
      <TabsContent value="summary">
        <ResumeSummaryDisplay analysisResult={analysisResult} resumeId={resumeId} triggerAnalysis={activeTab === "summary"} />
      </TabsContent>
      <TabsContent value="feedback">
        <InteractiveFeedback analysisResult={analysisResult} scoreResult={scoreResult} resumeId={resumeId} />
      </TabsContent>
      <TabsContent value="jobs">
        {jobRecommendations && <JobRecommendationsDisplay recommendations={jobRecommendations} />}
        {(!jobRecommendations) && scoreResult && scoreResult.score < 30 && (
          <Card className="shadow-md text-center bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-destructive">Job Recommendations Locked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Improve your resume score to 30 or above to unlock job recommendations. Focus on enhancing clarity, quantifiable achievements, and relevance to target roles.</p>
            </CardContent>
          </Card>
        )}
        {(!jobRecommendations) && scoreResult && scoreResult.score >= 30 && (
          <Card className="shadow-md text-center bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">No Job Recommendations Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We couldn't find specific job recommendations based on your current resume. Consider broadening your search criteria or refining your resume content for more targeted results. Check back later as new jobs are added frequently.</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="roadmap">
        <CareerRoadmapDisplay analysisResult={analysisResult} />
      </TabsContent>
      <TabsContent value="bias">
        <BiasDetectionDisplay analysisResult={analysisResult} resumeId={resumeId} triggerAnalysis={activeTab === "bias"} />
      </TabsContent>
      <TabsContent value="courses">
        <CourseRecommendationsDisplay analysisResult={analysisResult} resumeId={resumeId} targetRole={derivedTargetRole} triggerAnalysis={activeTab === "courses"} />
      </TabsContent>
    </Tabs>
  );
}, [
  uploadedFile,
  analysisResult,
  scoreResult,
  jobRecommendations,
  isProcessing,
  error,
  currentStage,
  activeTab,
  derivedTargetRole,
  resumeId,
  dispatch
]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background py-10 selection:bg-primary/20 selection:text-primary">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-4 rounded-full shadow-lg mb-6 ring-4 ring-primary/20">
            <Sparkles className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Candidate Dashboard
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your personal AI career assistant. Analyze, improve, and discover opportunities.
          </p>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-8">
          <ResumeUploadForm onAnalyze={handleAnalyzeResume} isProcessing={isProcessing} />
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg border border-primary/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <Info className="mr-2.5 h-6 w-6 shrink-0" /> Quick Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p><span className="font-semibold text-foreground">1. Upload Resume:</span> Use PDF, DOCX, JPG, or PNG formats.</p>
              <p><span className="font-semibold text-foreground">2. AI Processing:</span> We extract key info, score your resume, and generate initial recommendations.</p>
              <p><span className="font-semibold text-foreground">3. Explore Insights:</span> Use the tabs above to dive deeper:</p>
              <ul className="list-none pl-4 space-y-1.5">
                <li className="flex items-start"><FileText className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" /><div><span className="font-medium">Analysis:</span> View parsed data & overall score.</div></li>
                <li className="flex items-start"><BookTextIcon className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" /><div><span className="font-medium">Summary:</span> Get an AI-generated professional summary.</div></li>
                <li className="flex items-start"><Bot className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" /><div><span className="font-medium">AI Chat:</span> Ask specific questions about your resume.</div></li>
                <li className="flex items-start"><Target className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" /><div><span className="font-medium">Jobs:</span> Get job recommendations (if score ≥ 30).</div></li>
                <li className="flex items-start"><MapPinned className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" /><div><span className="font-medium">Roadmap:</span> Generate a career plan to your target role.</div></li>
                <li className="flex items-start"><Filter className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" /><div><span className="font-medium">Bias Check:</span> Get inclusivity suggestions.</div></li>
                <li className="flex items-start"><BookOpen className="mr-2 mt-0.5 h-4 w-4 text-primary shrink-0" /><div><span className="font-medium">Courses:</span> Find relevant learning resources.</div></li>
              </ul>
              <p className="text-xs text-muted-foreground/80 pt-2 border-t border-border/50">
                <Lightbulb className="inline h-3.5 w-3.5 mr-1 text-accent" /> For best results, ensure your resume is up-to-date and clearly formatted.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {renderContent()}
        </div>
      </div>
      <footer className="text-center mt-20 py-10 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ResumeSeeker. Candidate Portal.
        </p>
        <p className="text-xs text-muted-foreground/80 mt-2">
          All suggestions are AI-generated. Please verify critical information independently for accuracy.
        </p>
      </footer>
      </div>
    </div>
  );
});

export default function CandidatePortalPage() {
  return (
    <AuthGuard>
      <CandidatePortalContent />
    </AuthGuard>
  );
}
