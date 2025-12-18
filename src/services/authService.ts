
// Mock types to match the backend contract (Java Spring Standard)

export interface User {
    id: number;
    username: string;
    role: 'ADMIN' | 'PLAYER' | 'GUEST';
    avatarUrl?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    expiresIn?: number; // JWT expiration in seconds
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

// Mock Database
const MOCK_USER: User = {
    id: 1,
    username: "Survivor",
    role: "PLAYER",
    avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Survivor",
};

/**
 * Simulates the backend login endpoint: POST /api/auth/login
 */
export const loginRequest = async (username: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate basic validation
            if (!username || !password) {
                reject({
                    status: 400,
                    error: "Bad Request",
                    message: "Username and password are required",
                    code: "AUTH_MISSING_FIELDS"
                } as AuthError);
                return;
            }

            if (password.length < 3) {
                reject({
                    status: 401,
                    error: "Unauthorized",
                    message: "Password must be at least 3 characters",
                    code: "AUTH_BAD_PASSWORD"
                } as AuthError);
                return;
            }

            // Success
            resolve({
                token: "mock-jwt-token-" + Math.random().toString(36).substring(7),
                user: { ...MOCK_USER, username }, // Adopt the username typed
                expiresIn: 3600
            });
        }, 1500); // 1.5s delay to show the "Scanning..." animation
    });
};

/**
 * Simulates anonymous/guest login
 */
export const loginAnonymousRequest = async (): Promise<AuthResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const guestId = Math.floor(Math.random() * 1000) + 9000;
            const guestName = `Survivor-${guestId}`;

            resolve({
                token: "mock-guest-token-" + Math.random().toString(36).substring(7),
                user: {
                    id: -guestId, // Negative ID for local-only/guest users
                    username: guestName,
                    role: 'GUEST',
                    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestName}`
                },
                expiresIn: 7200 // 2 hours for guests
            });
        }, 1000);
    });
};
