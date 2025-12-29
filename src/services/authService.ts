import { auth } from './firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signOut,
    sendPasswordResetEmail,
    type User as FirebaseUser
} from "firebase/auth";

// Mock types to match the backend contract (Java Spring Standard)
// We keep this interface to maintain compatibility with the rest of the app
export interface User {
    id: string; // Changed from number to string to support Firebase UID
    username: string; // Will use email or display name
    email: string | null;
    role: 'ADMIN' | 'PLAYER' | 'GUEST';
    avatarUrl?: string;
    isAnonymous: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
    expiresIn?: number; // JWT/Token expiration in seconds
}

// Java Standard Exception Structure
export interface AuthError {
    timestamp?: string;
    status?: number;
    error: string; // "Unauthorized"
    message?: string; // "Bad credentials"
    path?: string;
    code?: string; // Custom error code like "AUTH_BAD_CREDENTIALS"
}

// Helper to map Firebase User to our App User
export const mapFirebaseUser = async (fbUser: FirebaseUser): Promise<User> => {
    // const token = await fbUser.getIdToken();
    const role = fbUser.uid === 'SR2x5Al631MNqSeX1VV3Tjsl6Tc2'
        ? 'ADMIN'
        : (fbUser.isAnonymous ? 'GUEST' : 'PLAYER');

    return {
        id: fbUser.uid,
        username: fbUser.displayName || fbUser.email?.split('@')[0] || 'Survivor',
        email: fbUser.email,
        role,
        avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${fbUser.uid}`,
        isAnonymous: fbUser.isAnonymous
    };
};

/**
 * Login with Email and Password
 */
export const loginRequest = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = await mapFirebaseUser(userCredential.user);
        const token = await userCredential.user.getIdToken();

        return {
            token,
            user,
            expiresIn: 3600 // This is managed by Firebase SDK internally
        };
    } catch (error: any) {
        throw mapFirebaseError(error);
    }
};

/**
 * Register with Email and Password
 */
export const registerRequest = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = await mapFirebaseUser(userCredential.user);
        const token = await userCredential.user.getIdToken();

        return {
            token,
            user,
            expiresIn: 3600
        };
    } catch (error: any) {
        throw mapFirebaseError(error);
    }
};

/**
 * Anonymous/Guest login
 */
export const loginAnonymousRequest = async (): Promise<AuthResponse> => {
    try {
        const userCredential = await signInAnonymously(auth);
        const user = await mapFirebaseUser(userCredential.user);
        const token = await userCredential.user.getIdToken();

        return {
            token,
            user,
            expiresIn: 7200
        };
    } catch (error: any) {
        throw mapFirebaseError(error);
    }
};

/**
 * Reset Password
 */
export const resetPasswordRequest = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw mapFirebaseError(error);
    }
};

/**
 * Logout
 */
export const logoutRequest = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        console.error("Logout error", error);
    }
};

// Helper to map Firebase errors to our AuthError interface
const mapFirebaseError = (error: any): AuthError => {
    let message = "An error occurred";
    let status = 400;

    switch (error.code) {
        case 'auth/invalid-email':
            message = "Invalid email address.";
            break;
        case 'auth/user-disabled':
            message = "This user account has been disabled.";
            status = 403;
            break;
        case 'auth/user-not-found':
            message = "User not found.";
            status = 404;
            break;
        case 'auth/wrong-password':
            message = "Incorrect password.";
            status = 401;
            break;
        case 'auth/email-already-in-use':
            message = "Email is already in use.";
            status = 409;
            break;
        case 'auth/weak-password':
            message = "Password is too weak. Minimum 6 characters required.";
            break;
        case 'auth/too-many-requests':
            message = "Too many failed attempts. Please try again later.";
            status = 429;
            break;
        default:
            message = error.message || "Authentication failed";
    }

    return {
        status,
        error: error.code || "AUTH_ERROR",
        message,
        code: error.code
    };
};
