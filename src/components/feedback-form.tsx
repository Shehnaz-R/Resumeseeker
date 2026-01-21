'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Rating, 
  Snackbar, 
  Alert,
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';

type FeedbackType = 'bug' | 'feature_request' | 'general';

// Create a theme that adapts to the custom dark mode
const createAdaptiveTheme = (isDark: boolean) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    background: {
      default: isDark ? 'hsl(220, 25%, 10%)' : '#ffffff',
      paper: isDark ? 'hsl(220, 25%, 15%)' : '#ffffff',
    },
    text: {
      primary: isDark ? 'hsl(220, 30%, 90%)' : 'hsl(220, 20%, 10%)',
      secondary: isDark ? 'hsl(220, 25%, 65%)' : 'hsl(220, 20%, 40%)',
    },
    primary: {
      main: isDark ? 'hsl(210, 85%, 70%)' : 'hsl(210, 85%, 50%)',
      contrastText: isDark ? 'hsl(220, 20%, 10%)' : '#ffffff',
    },
    secondary: {
      main: isDark ? 'hsl(260, 85%, 75%)' : 'hsl(260, 85%, 60%)',
      contrastText: isDark ? 'hsl(220, 20%, 10%)' : '#ffffff',
    },
    divider: isDark ? 'hsl(220, 20%, 28%)' : 'hsl(220, 20%, 85%)',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default function FeedbackForm() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check for dark mode
  useEffect(() => {
    setMounted(true);
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please provide feedback content');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userId = localStorage.getItem('userId');
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId || undefined,
          feedbackType,
          content,
          rating,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setFeedbackType('general');
      setContent('');
      setRating(null);
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const theme = createAdaptiveTheme(isDark);

  return (
    <ThemeProvider theme={theme}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          textAlign: 'center', 
          bgcolor: isDark 
            ? 'linear-gradient(135deg, hsl(220, 25%, 15%) 0%, hsl(220, 25%, 20%) 100%)'
            : 'linear-gradient(135deg, #f9f9f9 0%, #e3f2fd 100%)',
          border: isDark ? '1px solid hsl(220, 20%, 28%)' : 'none',
        }}
      >
      {/* Heading */}
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: isDark ? 'hsl(210, 85%, 70%)' : '#1976d2',
          textShadow: isDark ? '0 0 10px hsl(210, 85%, 70%, 0.3)' : 'none',
        }}
      >
        🌟 We Value Your Feedback 🌟
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        paragraph
        sx={{ maxWidth: 500, mx: 'auto' }}
      >
        Help us improve <b style={{ color: isDark ? 'hsl(210, 85%, 70%)' : '#1976d2' }}>ResumeSeeker</b> by sharing your thoughts, 
        reporting issues, or suggesting new features.
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate 
        sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <FormControl fullWidth margin="normal" sx={{ maxWidth: 400 }}>
          <InputLabel id="feedback-type-label">Feedback Type</InputLabel>
          <Select
            labelId="feedback-type-label"
            value={feedbackType}
            label="Feedback Type"
            onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
          >
            <MenuItem value="general">✨ General Feedback</MenuItem>
            <MenuItem value="bug">🐞 Report a Bug</MenuItem>
            <MenuItem value="feature_request">🚀 Feature Request</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          margin="normal"
          required
          fullWidth
          multiline
          rows={4}
          sx={{ maxWidth: 400 }}
          label="Your Feedback"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            feedbackType === 'bug' 
              ? 'Please describe the issue you encountered and steps to reproduce it...' 
              : feedbackType === 'feature_request'
              ? 'Please describe the feature you would like to see...'
              : 'Share your thoughts about ResumeSeeker...'
          }
        />
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography 
            component="legend" 
            gutterBottom 
            sx={{ 
              color: isDark ? 'hsl(30, 80%, 60%)' : '#f57c00', 
              fontWeight: 'bold',
              textShadow: isDark ? '0 0 5px hsl(30, 80%, 60%, 0.3)' : 'none',
            }}
          >
            ⭐ Rate your experience (optional)
          </Typography>
          <Rating
            name="experience-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            sx={{
              '& .MuiRating-iconFilled': {
                color: isDark ? 'hsl(30, 80%, 60%)' : '#f57c00',
              },
              '& .MuiRating-iconHover': {
                color: isDark ? 'hsl(30, 80%, 70%)' : '#ff9800',
              },
            }}
          />
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ 
            mt: 2, 
            px: 4, 
            py: 1.5, 
            borderRadius: 3,
            fontWeight: 'bold',
            background: isDark 
              ? 'linear-gradient(45deg, hsl(210, 85%, 70%), hsl(210, 85%, 80%))'
              : 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': { 
              background: isDark 
                ? 'linear-gradient(45deg, hsl(210, 85%, 60%), hsl(210, 85%, 70%))'
                : 'linear-gradient(45deg, #1565c0, #1e88e5)',
              transform: 'translateY(-2px)',
              boxShadow: isDark 
                ? '0 8px 25px hsl(210, 85%, 70%, 0.3)'
                : '0 8px 25px rgba(25, 118, 210, 0.3)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </Box>
      
      {/* Success Snackbar */}
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          🎉 Thank you for your feedback! We appreciate your input.
        </Alert>
      </Snackbar>
      
      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
    </ThemeProvider>
  );
}
