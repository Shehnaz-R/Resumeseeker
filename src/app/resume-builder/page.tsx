"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Lightbulb, CheckCircle, User, FileText, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { SimpleDocumentGenerator } from '@/lib/simple-document-generator';
// import { useToast } from '@/components/ui/use-toast';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  summary: string;
  experience: string;
  education: string;
  skills: string;
  strengths: string;
  projects: string;
  certifications: string;
}

export default function ResumeBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { toast } = useToast();
  const templateName = searchParams.get('template') || 'Professional';
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      profileImage: ''
    },
    summary: '',
    experience: '',
    education: '',
    skills: '',
    strengths: '',
    projects: '',
    certifications: ''
  });

  // Load sample data based on template
  useEffect(() => {
    if (templateName === 'Professional') {
      setResumeData({
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY'
        },
        summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading cross-functional teams.',
        experience: 'Senior Software Engineer - Tech Corp (2020 - Present)\n• Led development of microservices architecture serving 1M+ users\n• Improved system performance by 40% through optimization\n• Mentored 3 junior developers and conducted code reviews\n\nSoftware Engineer - StartupXYZ (2018 - 2020)\n• Built responsive web applications using React and Node.js\n• Collaborated with design team to implement UI/UX improvements\n• Reduced bug reports by 60% through comprehensive testing',
        education: 'Bachelor of Science in Computer Science - University of Technology (2014 - 2018)\nRelevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering',
        skills: 'JavaScript, React, Node.js, Python, AWS, Docker, Git, SQL, MongoDB, Agile Methodologies',
        strengths: 'Problem-Solving, Adaptability, Team Collaboration, Time Management, Critical Thinking, Leadership, Communication',
        projects: 'E-Commerce Platform - Built full-stack web application using React and Node.js\nTask Management App - Developed with real-time collaboration features\nPortfolio Website - Responsive design with modern UI/UX',
        certifications: 'AWS Certified Developer Associate (2023)\nGoogle Cloud Professional Developer (2022)\nMicrosoft Azure Fundamentals (2021)'
      });
    }
  }, [templateName]);

  const [aiTips] = useState([
    "Use action verbs like 'achieved', 'implemented', 'led'",
    "Quantify your accomplishments with numbers and percentages",
    "Include keywords from the job description",
    "Keep bullet points concise and impactful"
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profileImage: result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        profileImage: ''
      }
    }));
  };

  const handleInputChange = (section: keyof ResumeData, field: string, value: string) => {
    if (section === 'personalInfo') {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const generator = new SimpleDocumentGenerator(resumeData, templateName);
      
      const success = await generator.generatePDF();
      
      // Only show success message if the file was actually saved
      if (success) {
        const fileName = `${resumeData.personalInfo.name || 'resume'}-${templateName.toLowerCase()}.pdf`;
        
        // Show informative message about save dialog
        alert(`✅ PDF file generation complete! A save dialog should appear where you can choose the location and filename. Default name: "${fileName}"`);
      } else {
        // User cancelled the save dialog, no message needed
        console.log('User cancelled the save dialog');
      }
      
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      
      // Check if it's a user cancellation
      if (error.message?.includes('cancelled') || error.message?.includes('canceled')) {
        // User cancelled, don't show error message
        return;
      }
      
      // Other errors, show error message
      alert('❌ Failed to generate PDF file. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderResumePreview = () => {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 min-h-[700px] max-h-[950px] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-6">
            {resumeData.personalInfo.profileImage && (
              <img
                src={resumeData.personalInfo.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {resumeData.personalInfo.name || 'Your Name'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {resumeData.personalInfo.email || 'email@example.com'}
                {resumeData.personalInfo.phone ? ` • ${resumeData.personalInfo.phone}` : ''}
                {resumeData.personalInfo.location ? ` • ${resumeData.personalInfo.location}` : ''}
              </p>
            </div>
          </div>
        </div>
        
        {resumeData.personalInfo.name ? (
          <div className="space-y-6">
            {resumeData.summary && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">Professional Summary</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{resumeData.summary}</p>
              </div>
            )}
            
            {resumeData.experience && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">Work Experience</h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">{resumeData.experience}</div>
              </div>
            )}
            
            {resumeData.education && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">Education</h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">{resumeData.education}</div>
              </div>
            )}
            
            {resumeData.skills && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">Skills</h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{resumeData.skills}</div>
              </div>
            )}

            {resumeData.strengths && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">Strengths</h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{resumeData.strengths}</div>
              </div>
            )}

            {resumeData.projects && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">Projects</h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">{resumeData.projects}</div>
              </div>
            )}

            {resumeData.certifications && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-1">Certifications</h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed">{resumeData.certifications}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg">Start filling out the form to see your resume preview</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Resume Builder</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Template: {templateName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isGenerating}
              className="download-button flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Column - Form */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Personal Information */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</Label>
                    <Input
                      id="name"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                      placeholder="Enter your full name"
                      className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      placeholder="Enter your email"
                      className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-200">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                      placeholder="Enter your location"
                      className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>
                
                {/* Profile Image Upload */}
                <div className="mt-6">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Profile Photo (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {resumeData.personalInfo.profileImage ? (
                      <div className="relative">
                        <img
                          src={resumeData.personalInfo.profileImage}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image"
                      />
                      <Label
                        htmlFor="profile-image"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {resumeData.personalInfo.profileImage ? 'Change Photo' : 'Upload Photo'}
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max 5MB, JPEG/PNG</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="summary" className="text-sm font-medium text-gray-700 dark:text-gray-200">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={resumeData.summary}
                    onChange={(e) => handleInputChange('summary', '', e.target.value)}
                    placeholder="Write a compelling summary that highlights your key achievements and career goals..."
                    rows={4}
                    className="resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700 dark:text-gray-200">Work Experience</Label>
                  <Textarea
                    id="experience"
                    value={resumeData.experience}
                    onChange={(e) => handleInputChange('experience', '', e.target.value)}
                    placeholder={`Job Title - Company Name (Start Date - End Date)
• Achievement or responsibility
• Achievement with quantifiable results
• Key accomplishment`}
                    rows={6}
                    className="resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-medium text-gray-700 dark:text-gray-200">Education</Label>
                  <Textarea
                    id="education"
                    value={resumeData.education}
                    onChange={(e) => handleInputChange('education', '', e.target.value)}
                    placeholder="Degree - University Name (Graduation Year) Relevant coursework, honors, or achievements."
                    rows={4}
                    className="resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-medium text-gray-700 dark:text-gray-200">Technical Skills</Label>
                  <Textarea
                    id="skills"
                    value={resumeData.skills}
                    onChange={(e) => handleInputChange('skills', '', e.target.value)}
                    placeholder="List your technical skills, separated by commas e.g., JavaScript, React, Node.js, Python, AWS, Docker, Git, SQL"
                    rows={3}
                    className="resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="strengths" className="text-sm font-medium text-gray-700 dark:text-gray-200">Key Strengths</Label>
                  <Textarea
                    id="strengths"
                    value={resumeData.strengths}
                    onChange={(e) => handleInputChange('strengths', '', e.target.value)}
                    placeholder="List your key strengths and soft skills e.g., Problem-Solving, Leadership, Communication, Team Collaboration, Time Management"
                    rows={3}
                    className="resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="projects" className="text-sm font-medium text-gray-700 dark:text-gray-200">Key Projects</Label>
                  <Textarea
                    id="projects"
                    value={resumeData.projects}
                    onChange={(e) => handleInputChange('projects', '', e.target.value)}
                    placeholder="Project Name - Brief description of what you built and technologies used\nAnother Project - Description with key achievements"
                    rows={4}
                    className="resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="certifications" className="text-sm font-medium text-gray-700 dark:text-gray-200">Professional Certifications</Label>
                  <Textarea
                    id="certifications"
                    value={resumeData.certifications}
                    onChange={(e) => handleInputChange('certifications', '', e.target.value)}
                    placeholder="Certification Name - Issuing Organization (Year)\nAnother Certification - Organization (Year)"
                    rows={3}
                    className="resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - AI Tips and Preview */}
        <div className="w-[600px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 space-y-6 overflow-y-auto flex-shrink-0">
          {/* AI Writing Tips */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                AI Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  ATS-Optimized
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {renderResumePreview()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
