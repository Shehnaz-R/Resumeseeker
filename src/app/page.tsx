// src/app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogIn,
  UserPlus,
  Sparkles,
  UserCircle,
  Briefcase,
  ArrowRight,
  FileText,
  Target,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  BarChart3,
  Users,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingIndicator } from "@/components/loading-indicator";

import { useState, useEffect } from "react";

export default function HomePortalPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <LoadingIndicator text="Loading session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Gradient Background - kept subtle */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10 dark:from-background dark:via-primary/10 dark:to-accent/5" />

        {/* Small, Floating Orbs - More Transparent & Blurry */}

        {/* Top Left (Purple) */}
        <div
          className="absolute top-[20%] left-[10%] w-[120px] h-[120px] bg-purple-500 rounded-full blur-[60px] opacity-60 animate-float-y"
          style={{ transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)` }}
        />

        {/* Top Right (Blue) */}
        <div
          className="absolute top-[15%] right-[15%] w-[100px] h-[100px] bg-blue-500 rounded-full blur-[50px] opacity-60 animate-float-y animation-delay-2000"
          style={{ transform: `translate(${mousePos.x * -0.03}px, ${mousePos.y * -0.03}px)` }}
        />

        {/* Bottom Left (Indigo) */}
        <div
          className="absolute bottom-[25%] left-[20%] w-[90px] h-[90px] bg-indigo-500 rounded-full blur-[55px] opacity-60 animate-float-y animation-delay-4000"
          style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}
        />

        {/* Bottom Right (Cyan) */}
        <div
          className="absolute bottom-[20%] right-[20%] w-[80px] h-[80px] bg-cyan-400 rounded-full blur-[45px] opacity-60 animate-float-y animation-delay-3000"
          style={{ transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)` }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.06]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
        {/* ---------- Header ---------- */}
        <header className="text-center mb-12 mt-16 max-w-5xl mx-auto">
          {/* Logo with Animation */}
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm text-primary p-5 rounded-full shadow-2xl mb-8 ring-4 ring-primary/20 hover:ring-primary/40 transition-all duration-500 hover:scale-110 group">
            <Sparkles className="w-16 h-16 animate-pulse group-hover:rotate-12 transition-transform duration-500" />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">
              Resume
            </span>
            <span className="text-accent">Seeker</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up">
            Unlock your career potential with{" "}
            <span className="text-primary font-semibold">AI-powered analysis</span>,{" "}
            <span className="text-accent font-semibold">tailored job recommendations</span>, and{" "}
            <span className="text-primary font-semibold">personalized roadmaps</span> to guide your professional journey.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up animation-delay-200">
            <div className="px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-sm font-medium text-primary border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
              <Zap className="w-4 h-4 inline mr-2" />
              AI-Powered
            </div>
            <div className="px-4 py-2 bg-accent/10 backdrop-blur-sm rounded-full text-sm font-medium text-accent border border-accent/20 hover:border-accent/40 transition-all hover:scale-105">
              <Shield className="w-4 h-4 inline mr-2" />
              Secure & Private
            </div>
            <div className="px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-sm font-medium text-primary border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Career Growth
            </div>
          </div>
        </header>

        {/* ---------- Stats Section ---------- */}
        {!isLoggedIn && (
          <div className="max-w-5xl w-full mb-16 animate-fade-in-up animation-delay-400">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)]">
                <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Active Users</div>
              </div>
              <div className="text-center p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.3)] dark:hover:shadow-[0_20px_50px_rgba(147,51,234,0.2)]">
                <FileText className="w-8 h-8 mx-auto mb-3 text-accent" />
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">Resumes Analyzed</div>
              </div>
              <div className="text-center p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)]">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
              </div>
              <div className="text-center p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.3)] dark:hover:shadow-[0_20px_50px_rgba(147,51,234,0.2)]">
                <Award className="w-8 h-8 mx-auto mb-3 text-accent" />
                <div className="text-3xl font-bold text-foreground">4.9/5</div>
                <div className="text-sm text-muted-foreground mt-1">User Rating</div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Portal Cards ---------- */}
        <div className="max-w-6xl w-full mb-16">
          {isLoggedIn ? (
            <div className="text-center animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Welcome Back! 👋
              </h2>
              <p className="text-muted-foreground mb-12 text-xl">
                Choose your portal to continue your journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Candidate Portal */}
                <Card className="shadow-2xl hover:shadow-[0_35px_80px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_35px_80px_rgba(59,130,246,0.3)] transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.03] group bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-2 border-primary/20 hover:border-primary/60 overflow-hidden relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="items-center text-center pt-10 relative z-10">
                    <div className="p-5 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-2xl text-primary mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <UserCircle className="w-20 h-20" />
                    </div>
                    <CardTitle className="text-3xl font-bold mb-3">
                      Candidate Portal
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Analyze your resume, discover perfect job matches, and chart your personalized career path with AI-powered insights.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-10 relative z-10">
                    <Button
                      asChild
                      size="lg"
                      className="w-full md:w-4/5 py-7 text-lg font-semibold group-hover:bg-accent group-hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Link href="/candidate-portal">
                        Go to Candidate Portal
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Recruiter Portal */}
                <Card className="shadow-2xl hover:shadow-[0_35px_80px_rgba(147,51,234,0.4)] dark:hover:shadow-[0_35px_80px_rgba(147,51,234,0.3)] transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.03] group bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-2 border-accent/20 hover:border-accent/60 overflow-hidden relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="items-center text-center pt-10 relative z-10">
                    <div className="p-5 bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-sm rounded-2xl text-accent mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Briefcase className="w-20 h-20" />
                    </div>
                    <CardTitle className="text-3xl font-bold mb-3">
                      Analyse with Job Description
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Efficiently evaluate candidate resumes against job descriptions using AI-powered analysis for precision matching.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-10 relative z-10">
                    <Button
                      asChild
                      size="lg"
                      className="w-full md:w-4/5 py-7 text-lg font-semibold group-hover:bg-primary group-hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Link href="/recruiter-portal">
                        Go to Recruiter Portal
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                Get Started with ResumeSeeker
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sign Up */}
                <Card className="shadow-2xl hover:shadow-[0_30px_70px_rgba(59,130,246,0.35)] dark:hover:shadow-[0_30px_70px_rgba(59,130,246,0.25)] transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.03] group bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-2 border-border hover:border-primary/60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="items-center text-center pt-10 relative z-10">
                    <div className="p-5 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-2xl text-primary mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <UserPlus className="w-16 h-16" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3">
                      New to ResumeSeeker?
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Create an account to unlock AI-powered career tools and personalized insights.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-10 relative z-10">
                    <Button
                      asChild
                      variant="default"
                      size="lg"
                      className="w-full py-6 text-lg font-semibold group-hover:bg-accent group-hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Link href="/signup">
                        Sign Up Now
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Login */}
                <Card className="shadow-2xl hover:shadow-[0_30px_70px_rgba(147,51,234,0.35)] dark:hover:shadow-[0_30px_70px_rgba(147,51,234,0.25)] transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.03] group bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-2 border-border hover:border-accent/60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="items-center text-center pt-10 relative z-10">
                    <div className="p-5 bg-gradient-to-br from-accent/20 to-accent/10 backdrop-blur-sm rounded-2xl text-accent mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <LogIn className="w-16 h-16" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3">
                      Already a Member?
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Log in to access your personalized dashboard and continue your journey.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-10 relative z-10">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full py-6 text-lg font-semibold border-2 border-accent text-accent hover:bg-accent/10 hover:text-accent group-hover:border-accent group-hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Link href="/login">
                        Login
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Templates */}
                <Card className="shadow-2xl hover:shadow-[0_30px_70px_rgba(59,130,246,0.35)] dark:hover:shadow-[0_30px_70px_rgba(59,130,246,0.25)] transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.03] group bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-2 border-border hover:border-primary/60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="items-center text-center pt-10 relative z-10">
                    <div className="p-5 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-2xl text-primary mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <FileText className="w-16 h-16" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-3">
                      Resume Templates
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Browse our collection of professional, ATS-friendly resume templates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-10 relative z-10">
                    <Button
                      asChild
                      variant="secondary"
                      size="lg"
                      className="w-full py-6 text-lg font-semibold group-hover:bg-primary/10 group-hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Link href="/templates">
                        View Templates
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Features Section ---------- */}
        {!isLoggedIn && (
          <div className="max-w-6xl w-full mb-20 animate-fade-in-up animation-delay-600">
            <h3 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Why Choose ResumeSeeker?
            </h3>
            <p className="text-center text-muted-foreground mb-12 text-lg max-w-2xl mx-auto">
              Powerful features designed to accelerate your career growth
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">Smart Job Matching</h4>
                <p className="text-muted-foreground leading-relaxed">
                  AI-powered algorithms match your skills and experience with the perfect job opportunities.
                </p>
              </div>

              <div className="p-8 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.25)] dark:hover:shadow-[0_20px_50px_rgba(147,51,234,0.2)] group">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">Resume Analysis</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Get detailed feedback on your resume with actionable suggestions for improvement.
                </p>
              </div>

              <div className="p-8 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">Career Roadmap</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Receive personalized career paths and skill development recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Footer ---------- */}
        <footer className="text-center mt-20 py-12 border-t border-border/50 w-full max-w-6xl backdrop-blur-sm">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} ResumeSeeker. Empowering Careers with AI.
          </p>
          <p className="text-xs text-muted-foreground/80 mt-3 max-w-2xl mx-auto">
            All AI-generated suggestions are for guidance only. Please review critical information independently.
          </p>
        </footer>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes blob-slow {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(20px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 15px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-y {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-float-y {
          animation: float-y 6s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-blob-slow {
          animation: blob-slow 10s infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-5000 {
          animation-delay: 5s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: backwards;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: backwards;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
