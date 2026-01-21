'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Star, Calendar, User, MessageSquare } from 'lucide-react';

interface Feedback {
  id: string;
  userId: string | null;
  feedbackType: string;
  content: string;
  rating: number | null;
  status: string;
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature_request': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Feedback Management</h1>
        <p className="text-muted-foreground">
          View and manage user feedback from the ResumeSeeker platform.
        </p>
      </div>

      <div className="grid gap-6">
        {feedback.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No feedback found.</p>
            </CardContent>
          </Card>
        ) : (
          feedback.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">
                        {item.user ? `${item.user.name} (${item.user.email})` : 'Anonymous User'}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getTypeColor(item.feedbackType)}>
                      {item.feedbackType.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Feedback Content:</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {item.content}
                    </p>
                  </div>
                  
                  {item.rating && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">
                        Rating: {item.rating}/5 ({'⭐'.repeat(item.rating)})
                      </span>
                    </div>
                  )}
                  
                  {item.adminResponse && (
                    <div>
                      <h4 className="font-medium mb-2">Admin Response:</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                        {item.adminResponse}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      ID: {item.id}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}