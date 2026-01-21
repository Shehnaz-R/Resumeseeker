'use client';

import { useAuthContext, AuthContextType } from '@/context/AuthContext';

// Re-export the interface for backward compatibility
export type AuthState = AuthContextType;

export function useAuth(): AuthState {
  return useAuthContext();
}
