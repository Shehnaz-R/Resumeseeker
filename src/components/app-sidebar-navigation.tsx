// src/components/app-sidebar-navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LogIn, LogOut, UserPlus, Sparkles, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarContent } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from './ui/skeleton';
import { useState, useEffect } from 'react';

export function AppSidebarNavigation() {
    const { isLoggedIn, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState<string | null>(null);

    // Debug logging
    useEffect(() => {
        console.log('[AppSidebarNavigation] Auth state:', { isLoggedIn, isLoading });
    }, [isLoggedIn, isLoading]);

    // Reset loading state when pathname changes (navigation complete)
    useEffect(() => {
        setLoadingButton(null);
    }, [pathname]);

    const handleNavigation = (href: string, buttonId: string) => {
        if (loadingButton) return; // Prevent multiple clicks

        setLoadingButton(buttonId);
        router.push(href);

        // Fallback: reset loading state after 3 seconds if navigation doesn't complete
        setTimeout(() => {
            setLoadingButton(null);
        }, 3000);
    };

    const handleLogout = () => {
        if (loadingButton) return; // Prevent multiple clicks

        setLoadingButton('logout');
        logout();

        // Reset loading state after logout
        setTimeout(() => {
            setLoadingButton(null);
        }, 1000);
    };

    if (isLoading) {
        return (
            <>
                <SidebarHeader className="p-4 flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold text-primary">
                        Resume<span className="text-accent">Seeker</span>
                    </h1>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton variant="default" size="default" disabled>
                                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> <Skeleton className="h-4 w-20" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton variant="default" size="default" disabled>
                                <Skeleton className="h-5 w-5 mr-2 rounded-full" /> <Skeleton className="h-4 w-24" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="p-2">
                    <p className="text-xs text-sidebar-foreground/70 text-center">
                        &copy; {new Date().getFullYear()} ResumeSeeker
                    </p>
                </SidebarFooter>
            </>
        );
    }

    return (
        <>
            <SidebarHeader className="p-4 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">
                    Resume<span className="text-accent">Seeker</span>
                </h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            variant="default"
                            size="lg"
                            tooltip="Go to Home"
                            className="sidebar-button"
                            onClick={() => handleNavigation('/', 'home')}
                            disabled={loadingButton === 'home'}
                        >
                            <div className="flex items-center gap-3 w-full">
                                {loadingButton === 'home' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Home className="w-5 h-5" />
                                )}
                                <span className="font-semibold text-base">
                                    {loadingButton === 'home' ? 'Loading...' : 'Home'}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            variant="default"
                            size="lg"
                            tooltip="Resume Templates"
                            className="sidebar-button"
                            onClick={() => handleNavigation('/templates', 'templates')}
                            disabled={loadingButton === 'templates'}
                        >
                            <div className="flex items-center gap-3 w-full">
                                {loadingButton === 'templates' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <FileText className="w-5 h-5" />
                                )}
                                <span className="font-semibold text-base">
                                    {loadingButton === 'templates' ? 'Loading...' : 'Templates'}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            variant="default"
                            size="lg"
                            tooltip="Provide Feedback"
                            className="sidebar-button"
                            onClick={() => handleNavigation('/feedback', 'feedback')}
                            disabled={loadingButton === 'feedback'}
                        >
                            <div className="flex items-center gap-3 w-full">
                                {loadingButton === 'feedback' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <MessageSquare className="w-5 h-5" />
                                )}
                                <span className="font-semibold text-base">
                                    {loadingButton === 'feedback' ? 'Loading...' : 'Feedback'}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {isLoggedIn ? (
                        <>
                            {/* Candidate Portal and Recruiter Portal links removed as per request */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    variant="default"
                                    size="lg"
                                    onClick={handleLogout}
                                    tooltip="Log out"
                                    className="sidebar-button"
                                    disabled={loadingButton === 'logout'}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        {loadingButton === 'logout' ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <LogOut className="w-5 h-5" />
                                        )}
                                        <span className="font-semibold text-base">
                                            {loadingButton === 'logout' ? 'Logging out...' : 'Logout'}
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </>
                    ) : (
                        <>
                            {/* Show Login and Signup links only if not on login/signup pages */}
                            {pathname !== '/login' && pathname !== '/signup' && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            variant="default"
                                            size="lg"
                                            tooltip="Log In"
                                            className="sidebar-button"
                                            onClick={() => handleNavigation('/login', 'login')}
                                            disabled={loadingButton === 'login'}
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                {loadingButton === 'login' ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <LogIn className="w-5 h-5" />
                                                )}
                                                <span className="font-semibold text-base">
                                                    {loadingButton === 'login' ? 'Loading...' : 'Login'}
                                                </span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            variant="default"
                                            size="lg"
                                            tooltip="Sign Up"
                                            className="sidebar-button"
                                            onClick={() => handleNavigation('/signup', 'signup')}
                                            disabled={loadingButton === 'signup'}
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                {loadingButton === 'signup' ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <UserPlus className="w-5 h-5" />
                                                )}
                                                <span className="font-semibold text-base">
                                                    {loadingButton === 'signup' ? 'Loading...' : 'Sign Up'}
                                                </span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}
                        </>
                    )}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2">
                <p className="text-xs text-sidebar-foreground/70 text-center">
                    &copy; {new Date().getFullYear()} ResumeSeeker
                </p>
            </SidebarFooter>
        </>
    );
}
