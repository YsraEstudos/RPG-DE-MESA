import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginRequest, loginAnonymousRequest, type User, type AuthError } from '../services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // State
    hasHydrated: boolean;
    rememberMe: boolean;

    // Actions
    login: (username: string, password: string, remember?: boolean) => Promise<void>;
    loginAsGuest: () => Promise<void>;
    logout: () => void;
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
            hasHydrated: false,
            rememberMe: true, // default

            login: async (username, password, remember = true) => {
                set({ isLoading: true, error: null });
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
                        error: errorObj.error || 'Falha na autenticação',
                        isLoading: false,
                        isAuthenticated: false
                    });
                }
            },

            loginAsGuest: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await loginAnonymousRequest();
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        rememberMe: false // Guests usually don't need persistent sessions, but can be changed
                    });
                } catch (err) {
                    set({
                        error: 'Failed to enter as guest',
                        isLoading: false,
                        isAuthenticated: false
                    });
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            resetError: () => set({ error: null }),
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
