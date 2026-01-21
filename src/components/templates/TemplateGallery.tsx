// 'use client';

// import { useState, useEffect } from 'react';
// import { Box, Grid, Card, CardContent, Typography, CardMedia, Button, CircularProgress } from '@mui/material';

// type ResumeTemplate = {
//     id: string;
//     name: string;
//     description: string;
//     previewImageUrl: string;
//     isDefault: boolean;
// };

// export default function TemplateGallery({ onSelect }: { onSelect: (template: ResumeTemplate) => void }) {
//     const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         async function fetchTemplates() {
//             try {
//                 const response = await fetch('/api/templates');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch templates');
//                 }
//                 const data = await response.json();
//                 setTemplates(data);
//             } catch (err) {
//                 setError('Error loading templates. Please try again later.');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchTemplates();
//     }, []);

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box textAlign="center" p={3}>
//                 <Typography color="error">{error}</Typography>
//                 <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
//                     Try Again
//                 </Button>
//             </Box>
//         );
//     }

//     return (
//         <Grid container spacing={3}>
//             {templates.map((template) => (
//                 <Grid item xs={12} sm={6} md={4} key={template.id}>
//                     <Card
//                         sx={{
//                             height: '100%',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             transition: 'transform 0.2s, box-shadow 0.2s',
//                             '&:hover': {
//                                 transform: 'translateY(-5px)',
//                                 boxShadow: 6,
//                             }
//                         }}
//                     >
//                         <CardMedia
//                             component="img"
//                             height="200"
//                             image={
//                                 // Use placeholder images if the actual images are not available
//                                 template.previewImageUrl.startsWith('/templates/')
//                                     ? `https://placehold.co/600x800/${template.name === 'Professional' ? 'e2e8f0/1e293b?text=Professional+Template' :
//                                         template.name === 'Creative' ? 'fef3c7/854d0e?text=Creative+Template' :
//                                             'f0f9ff/0c4a6e?text=Academic+Template'}`
//                                     : template.previewImageUrl || 'https://placehold.co/600x800/e2e8f0/1e293b?text=Default+Template'
//                             }
//                             alt={template.name}
//                             sx={{ objectFit: 'contain', p: 2 }}
//                         />
//                         <CardContent sx={{ flexGrow: 1 }}>
//                             <Typography gutterBottom variant="h6" component="div">
//                                 {template.name}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                                 {template.description}
//                             </Typography>
//                             <Button
//                                 variant="contained"
//                                 fullWidth
//                                 onClick={() => onSelect(template)}
//                             >
//                                 Use This Template
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  CircularProgress
} from '@mui/material';
import { Loader2 } from 'lucide-react';

type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  isDefault: boolean;
};

export default function TemplateGallery({ onSelect }: { onSelect: (template: ResumeTemplate) => void }) {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  const handleTemplateSelect = async (template: ResumeTemplate) => {
    if (loadingTemplateId) return; // Prevent multiple clicks
    
    setLoadingTemplateId(template.id);
    
    try {
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      onSelect(template);
    } catch (error) {
      console.error('Error selecting template:', error);
    } finally {
      // Reset loading state after navigation
      setTimeout(() => {
        setLoadingTemplateId(null);
      }, 1000);
    }
  };

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch templates: ${response.status}`);
        }
        const data: ResumeTemplate[] = await response.json();
        
        // If no templates are returned, use mock data as fallback
        if (!data || data.length === 0) {
          console.warn('No templates found in database, using mock data');
          const mockTemplates: ResumeTemplate[] = [
            {
              id: '1',
              name: 'Professional',
              description: 'A clean, professional template suitable for corporate environments',
              previewImageUrl: '/templates/professional-preview.png',
              isDefault: true,
            },
            {
              id: '2',
              name: 'Creative',
              description: 'A colorful template for creative industries',
              previewImageUrl: '/templates/creative-preview.png',
              isDefault: false,
            },
            {
              id: '3',
              name: 'Academic',
              description: 'Formal template for academic and research positions',
              previewImageUrl: '/templates/academic-preview.png',
              isDefault: false,
            },
          ];
          setTemplates(mockTemplates);
        } else {
          setTemplates(data);
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        // Use mock data as fallback when API fails
        const mockTemplates: ResumeTemplate[] = [
          {
            id: '1',
            name: 'Professional',
            description: 'A clean, professional template suitable for corporate environments',
            previewImageUrl: '/templates/professional-preview.png',
            isDefault: true,
          },
          {
            id: '2',
            name: 'Creative',
            description: 'A colorful template for creative industries',
            previewImageUrl: '/templates/creative-preview.png',
            isDefault: false,
          },
          {
            id: '3',
            name: 'Academic',
            description: 'Formal template for academic and research positions',
            previewImageUrl: '/templates/academic-preview.png',
            isDefault: false,
          },
        ];
        setTemplates(mockTemplates);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  if (templates.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="h6" gutterBottom>
          No templates available
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          We're working on adding more templates. Please check back later.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {templates.map((template) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              maxWidth: 280,
              mx: 'auto',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 4,
              },
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={
                template.previewImageUrl && template.previewImageUrl.startsWith('/templates/')
                  ? `https://placehold.co/400x600/${
                      template.name === 'Professional'
                        ? 'e2e8f0/1e293b?text=Professional+Template'
                        : template.name === 'Creative'
                        ? 'fef3c7/854d0e?text=Creative+Template'
                        : 'f0f9ff/0c4a6e?text=Academic+Template'
                    }`
                  : template.previewImageUrl ||
                    'https://placehold.co/400x600/e2e8f0/1e293b?text=Default+Template'
              }
              alt={template.name}
              sx={{ objectFit: 'cover', p: 1 }}
            />
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                {template.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.4 }}>
                {template.description}
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => handleTemplateSelect(template)}
                disabled={loadingTemplateId === template.id}
                size="small"
                sx={{ 
                  fontSize: '0.875rem', 
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:disabled': {
                    opacity: 0.7,
                  }
                }}
              >
                {loadingTemplateId === template.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Use This Template'
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
