'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Brain, Sparkles } from 'lucide-react';

interface AILoadingProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export function AILoading({ 
  message = "AI is analyzing your resume...", 
  showProgress = false,
  progress = 0 
}: AILoadingProps) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <Brain className="h-6 w-6 text-primary" />
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <h3 className="text-lg font-semibold">{message}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {showProgress && (
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          This may take a few moments...
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickLoading() {
  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">Loading...</span>
    </div>
  );
}
