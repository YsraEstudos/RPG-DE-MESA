import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    loginRequest,
    loginAnonymousRequest,
    registerRequest,
    resetPasswordRequest,
    logoutRequest,
    type User,
    type AuthError
} from '../services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null; // For reset password feedback

    // State
    hasHydrated: boolean;
    rememberMe: boolean;

    // Actions
    login: (username: string, password: string, remember?: boolean) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    syncUser: (user: User | null) => void;
    resetError: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            successMessage: null,
            hasHydrated: false,
            rememberMe: true, // default

            login: async (username, password, remember = true) => {
                set({ isLoading: true, error: null, successMessage: null });
                try {
                    const response = await loginRequest(username, password);
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        rememberMe: remember
                    });
                } catch (err) {
                    const errorObj = err as AuthError;
                    set({
                        error: errorObj.message || 'Falha na autenticação',
                        isLoading: false,
                        isAuthenticated: false
                    });
                }
            },

            register: async (username, password) => {
                set({ isLoading: true, error: null, successMessage: null });
                try {
                    const response = await registerRequest(username, password);
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        rememberMe: true
                    });
                } catch (err) {
                    const errorObj = err as AuthError;
                    set({
                        error: errorObj.message || 'Falha no registro',
                        isLoading: false,
                        isAuthenticated: false
                    });
                }
            },

            loginAsGuest: async () => {
                set({ isLoading: true, error: null, successMessage: null });
                try {
                    const response = await loginAnonymousRequest();
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        rememberMe: false
                    });
                } catch {
                    set({
                        error: 'Failed to enter as guest',
                        isLoading: false,
                        isAuthenticated: false
                    });
                }
            },

            logout: async () => {
                await logoutRequest();
                set({ user: null, token: null, isAuthenticated: false });
            },

            resetPassword: async (email: string) => {
                set({ isLoading: true, error: null, successMessage: null });
                try {
                    await resetPasswordRequest(email);
                    set({
                        isLoading: false,
                        successMessage: "Password reset email sent! Check your inbox."
                    });
                } catch (err) {
                    const errorObj = err as AuthError;
                    set({
                        error: errorObj.message || 'Failed to send reset email',
                        isLoading: false
                    });
                }
            },

            syncUser: (user: User | null) => {
                if (user) {
                    set({ user, isAuthenticated: true });
                } else {
                    set({ user: null, token: null, isAuthenticated: false });
                }
            },

            resetError: () => set({ error: null, successMessage: null }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                rememberMe: state.rememberMe
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
