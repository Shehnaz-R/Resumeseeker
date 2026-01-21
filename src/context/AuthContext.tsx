'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_TOKEN_KEY = 'authToken_ResumeSeeker';

export interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string, redirectPath?: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Synchronous check for auth status from localStorage token presence
    const checkAuth = useCallback((): boolean => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            const authStatus = !!token;
            if (isLoggedIn !== authStatus) {
                setIsLoggedIn(authStatus);
            }
            return authStatus;
        }
        return false;
    }, [isLoggedIn]);

    // Effect to set initial auth state on mount and handle client-side only logic
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            const authStatus = !!token;
            console.log('[AuthContext] Initial auth check:', { hasToken: authStatus, token: token ? 'exists' : 'none' });
            setIsLoggedIn(authStatus);
            setIsLoading(false);

            // Listen for storage changes (e.g., login/logout in another tab)
            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === AUTH_TOKEN_KEY) {
                    const newAuthStatus = !!e.newValue;
                    console.log('[AuthContext] Storage change detected:', { newAuthStatus });
                    setIsLoggedIn(newAuthStatus);
                }
            };

            window.addEventListener('storage', handleStorageChange);

            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        } else {
            setIsLoading(false);
        }
    }, []);

    // Login function calls API and stores token
    const login = useCallback(async (email: string, password: string, redirectPath: string = '/') => {
        setIsLoading(true);
        console.log('[AuthContext] Login attempt:', { email, redirectPath });
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log('[AuthContext] Login response:', { ok: response.ok, hasToken: !!data.token });
            if (response.ok && data.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, data.token);
                setIsLoggedIn(true);
                console.log('[AuthContext] Login successful, token stored, redirecting to:', redirectPath);
                router.push(redirectPath);
            } else {
                setIsLoggedIn(false);
                console.error('[AuthContext] Login failed:', data.error);
                throw new Error(data.error?.message || data.error || 'Login failed');
            }
        } catch (error) {
            setIsLoggedIn(false);
            console.error('[AuthContext] Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const logout = useCallback(() => {
        console.log('[AuthContext] Logout initiated');
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setIsLoggedIn(false);
            console.log('[AuthContext] Token removed, redirecting to login');
            router.push('/login');
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
