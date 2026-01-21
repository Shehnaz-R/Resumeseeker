'use client';

import React, { useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import FeedbackForm from '@/components/feedback-form';
import { trackPageView } from '@/lib/analytics';

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
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

export default function FeedbackPage() {
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Track page view
  useEffect(() => {
    trackPageView('feedback_page');
  }, []);

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

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const theme = createAdaptiveTheme(isDark);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box py={4}>
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Feedback
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're constantly working to improve ResumeSeeker. Your feedback helps us make it better.
            </Typography>
          </Paper>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <FeedbackForm />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Other Ways to Reach Us
                </Typography>
                
                <Typography variant="body2" paragraph>
                  If you prefer, you can also reach us through these channels:
                </Typography>
                
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Email: support@resumeseeker.com
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Twitter: @resumeseeker
                  </Typography>
                  <Typography component="li" variant="body2">
                    GitHub: github.com/resumeseeker/issues
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mt: 3 }}>
                  We typically respond within 24-48 hours during business days.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}