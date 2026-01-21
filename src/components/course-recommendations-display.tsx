// src/components/course-recommendations-display.tsx
"use client";

import React, { useState, useEffect } from 'react';
import type { AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingIndicator } from './loading-indicator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { BookOpenCheck, ExternalLink, Sparkles, Info, GraduationCap } from 'lucide-react';
import { Badge } from './ui/badge';

interface CourseRecommendationsDisplayProps {
  analysisResult: AnalyzeResumeOutput | null;
  resumeId?: string;
  targetRole?: string; // Optional, can be taken from career roadmap or a specific input
  triggerAnalysis?: boolean;
}

interface RecommendedCourse {
  title: string;
  platform: string; // Changed from 'provider' to 'platform'
  duration: string;
  difficulty: string;
  description: string;
  url: string;
  skillsCovered: string[];
  rating: number;
  cost: string;
  focusArea?: string; // Added focusArea
}

interface CourseRecommenderOutput {
  recommendations: RecommendedCourse[];
  targetRole: string;
  skillGaps: string[];
  totalRecommendations: number;
  generalAdvice?: string; // Added generalAdvice
}

export function CourseRecommendationsDisplay({ analysisResult, resumeId, targetRole, triggerAnalysis = false }: CourseRecommendationsDisplayProps) {
  const [recommendations, setRecommendations] = useState<CourseRecommenderOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisPerformed, setAnalysisPerformed] = useState(false);
  const [effectiveTargetRole, setEffectiveTargetRole] = useState(targetRole || "");

  const fetchRecommendations = async (initialRole?: string) => {
    let roleToUse = initialRole || effectiveTargetRole;

    // If no role is provided or inferred, try to infer from analysisResult
    if (!roleToUse && analysisResult) {
        // Infer a target role from analysisResult.experience if possible
        const inferredRole = analysisResult.experience?.split('\n')[0]?.split(' at ')[0];
        if (inferredRole && inferredRole !== "your current field") {
            roleToUse = inferredRole;
            setEffectiveTargetRole(inferredRole); // Update state with inferred role
        }
    }

    if (!analysisResult || !roleToUse) {
      setError("Resume analysis and a target role (either provided or inferred) are needed for course recommendations.");
      setIsLoading(false); // Stop loading if requirements not met
      return;
    }

    if (!resumeId) {
      setError("Resume ID is required for course recommendations.");
      setIsLoading(false); // Stop loading if requirements not met
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const response = await fetch('/api/resumes/course-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          analysisResult,
          targetRole: roleToUse,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get course recommendations');
      }

      const data = await response.json();
      // Ensure data.courseRecommendations matches the CourseRecommenderOutput interface
      setRecommendations(data.courseRecommendations);
      setAnalysisPerformed(true);
    } catch (err) {
      console.error("Error getting course recommendations:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (targetRole) {
      setEffectiveTargetRole(targetRole);
    }
  }, [targetRole]);
  
  useEffect(() => {
    if (triggerAnalysis && analysisResult && !analysisPerformed && !isLoading) {
      // Attempt to fetch recommendations directly when the tab is triggered and analysis is available
      fetchRecommendations();
    }
  }, [triggerAnalysis, analysisResult, analysisPerformed, isLoading]);

  const handleFetchClick = () => {
    // When the button is clicked, re-fetch recommendations. If effectiveTargetRole is empty,
    // fetchRecommendations will attempt to infer it from analysisResult.
    fetchRecommendations();
  };


  if (!analysisResult) {
    return null;
  }

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-accent/10 rounded-md text-accent">
            <GraduationCap className="w-7 h-7" />
          </span>
          <div>
            <CardTitle className="text-2xl font-bold text-accent">Learning Recommendations</CardTitle>
            <CardDescription>AI-suggested courses and resources to achieve your career goals {effectiveTargetRole && `for ${effectiveTargetRole}`}.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(!recommendations && !isLoading) && (
             <div className="text-center py-4">
                {effectiveTargetRole ? (
                    <p className="text-muted-foreground mb-2">Get learning suggestions for your target role: <span className="font-medium text-foreground">{effectiveTargetRole}</span>.</p>
                ) : (
                    <p className="text-muted-foreground mb-2">Enter a target role (or let the Roadmap generate one) to get learning suggestions.</p>
                )}
                <Button onClick={handleFetchClick} disabled={isLoading || !analysisResult}>
                    {isLoading ? <LoadingIndicator size="sm" text="Fetching..." /> : `Get Courses${effectiveTargetRole ? ` for ${effectiveTargetRole}` : ''}`}
                </Button>
            </div>
        )}

        {isLoading && <LoadingIndicator text="Fetching course recommendations..." />}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recommendations && !isLoading && (
          <div className="mt-4 space-y-6">
            {recommendations.generalAdvice && (
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <Info className="h-5 w-5 text-primary" />
                <AlertTitle className="font-semibold text-primary">General Learning Advice</AlertTitle>
                <AlertDescription className="text-sm text-primary/90">
                  {recommendations.generalAdvice}
                </AlertDescription>
              </Alert>
            )}

            {recommendations.recommendations && recommendations.recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.recommendations.map((course, index) => (
                  <Card key={index} className="bg-card border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg text-primary">{course.title}</CardTitle>
                            <CardDescription className="text-sm">
                                On <span className="font-medium">{course.platform}</span>
                                {course.focusArea && ` - Focus: ${course.focusArea}`}
                            </CardDescription>
                        </div>
                        {course.url && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={course.url} target="_blank" rel="noopener noreferrer">
                                    Visit <ExternalLink className="ml-1.5 h-4 w-4" />
                                </a>
                            </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      {/* Optional: Display skills covered, duration, difficulty, etc. */}
                      {course.skillsCovered && course.skillsCovered.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {course.skillsCovered.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-4">
                        {course.duration && (<span>Duration: {course.duration}</span>)}
                        {course.difficulty && (<span>Difficulty: {course.difficulty}</span>)}
                        {course.rating && (<span>Rating: {course.rating.toFixed(1)}/5</span>)}
                        {course.cost && (<span>Cost: {course.cost}</span>)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No specific course recommendations available at this time.</p>
            )}
             <Button onClick={() => fetchRecommendations(effectiveTargetRole)} variant="outline" disabled={isLoading || !effectiveTargetRole}>
                {isLoading ? <LoadingIndicator size="sm" text="Refreshing..." /> : 'Refresh Recommendations'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
