'use client';

import Link from 'next/link';
import { Sparkles, PanelLeft, LogOut } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import {
    SidebarProvider,
    Sidebar,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebarNavigation } from '@/components/app-sidebar-navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, logout } = useAuth();

    return (
        <SidebarProvider defaultOpen={false}>
            <Sidebar>
                <AppSidebarNavigation />
            </Sidebar>

            <SidebarInset>
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger variant="ghost" size="icon" className="md:hidden">
                            {/* Mobile Toggle */}
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </SidebarTrigger>
                        <SidebarTrigger variant="ghost" size="icon" className="hidden md:flex">
                            {/* Desktop Toggle */}
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Sidebar</span>
                        </SidebarTrigger>
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="w-7 h-7 text-primary" />
                            <span className="text-xl font-semibold text-primary">
                                Resume<span className="text-accent">Seeker</span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {isLoggedIn && (
                            <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
