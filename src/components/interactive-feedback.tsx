// src/components/interactive-feedback.tsx
"use client";

import React, { useState } from 'react';
import type { AnalyzeResumeOutput } from '@/ai/flows/resume-analyzer';
import type { AnalyzeResumeAndScoreOutput } from '@/ai/flows/resume-score';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoadingIndicator } from './loading-indicator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { MessageSquareQuote, Sparkles } from 'lucide-react';

interface InteractiveFeedbackProps {
  analysisResult: AnalyzeResumeOutput | null;
  scoreResult: AnalyzeResumeAndScoreOutput | null;
  resumeId?: string;
}

interface InteractiveFeedbackOutput {
  response: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export function InteractiveFeedback({ analysisResult, scoreResult, resumeId }: InteractiveFeedbackProps) {
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState<InteractiveFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !analysisResult) {
      setError("Please type a question and ensure your resume has been analyzed.");
      return;
    }

    if (!resumeId) {
      setError("Resume ID is required for AI chat.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch('/api/resumes/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          analysisResult,
          userQuestion: question,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      setFeedback(data.chatResponse);
    } catch (err) {
      console.error("Error getting interactive feedback:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while getting feedback.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!analysisResult) {
    return null; // Don't show this component if no analysis has been done
  }

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-primary/10 rounded-md text-primary">
            <MessageSquareQuote className="w-7 h-7" /> {/* Changed MessageSquareQuestion to MessageSquareQuote */}
          </span>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Ask AI About Your Resume</CardTitle>
            <CardDescription>Get specific advice. E.g., "How can I improve my skills section for a marketing role?"</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="resize-none"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !question.trim()} className="w-full sm:w-auto">
            {isLoading ? <LoadingIndicator size="sm" text="Getting advice..." /> : 'Get AI Advice'}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {feedback && !isLoading && (
          <Card className="mt-6 bg-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                <Sparkles className="w-5 h-5 text-accent"/>
                <CardTitle className="text-lg text-accent">AI Response:</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{feedback.response}</p>
              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Suggestions:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
