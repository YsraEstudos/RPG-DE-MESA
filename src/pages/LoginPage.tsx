import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { KeyRound, User, ChevronRight, AlertCircle, Scan, Mail, CheckCircle2, ArrowLeft } from 'lucide-react'

type AuthMode = 'login' | 'register' | 'forgot_password';

export const LoginPage = () => {
    const {
        login,
        register,
        loginAsGuest,
        resetPassword,
        isLoading,
        error,
        resetError,
        successMessage
    } = useAuthStore()

    const [mode, setMode] = useState<AuthMode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(true)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    // Password Validation State
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Helper to switch mode and clear errors
    const handleSwitchMode = (newMode: AuthMode) => {
        setMode(newMode);
        resetError();
        setPasswordError(null);
    };

    const validatePassword = (pwd: string): boolean => {
        if (pwd.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return false;
        }
        if (!/[A-Z]/.test(pwd)) {
            setPasswordError("Password must contain at least one uppercase letter (A-Z).");
            return false;
        }
        if (!/[a-z]/.test(pwd)) {
            setPasswordError("Password must contain at least one lowercase letter (a-z).");
            return false;
        }
        setPasswordError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isLoading) return

        // Manual Validation for Register
        if (mode === 'register') {
            if (!validatePassword(password)) return;
        }

        if (mode === 'login') {
            await login(email, password, rememberMe);
        } else if (mode === 'register') {
            await register(email, password);
        } else if (mode === 'forgot_password') {
            await resetPassword(email);
        }
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" } as any
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 50, damping: 20, delay: 0.2 } as any
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    }

    // Dynamic Title based on Mode
    const getTitle = () => {
        switch (mode) {
            case 'register': return 'NEW ID';
            case 'forgot_password': return 'RECOVER';
            default: return 'ACCESS';
        }
    }

    return (
        <motion.div
            className="fixed inset-0 w-full h-full bg-stone-950 flex items-center justify-center overflow-hidden z-[100]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Background Gradients & Noise */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900/50 to-stone-950 -z-20" />
            <div className="absolute inset-0 opacity-10 pointer-events-none -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.03]" />

            {/* Animated Scan Line (Ambient) */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-900/20 shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-scan-slow pointer-events-none" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    className="w-full max-w-md p-8 relative"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Holographic Border Effect */}
                    <div className="absolute inset-0 border border-stone-800 bg-stone-900/60 backdrop-blur-xl rounded-2xl shadow-2xl z-0" />
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-stone-700/20 to-transparent rounded-2xl -z-10" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">

                        {/* Header / Logo Area */}
                        <div className="mb-8 text-center relative">
                            <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/30 shadow-[0_0_15px_rgba(153,27,27,0.2)]">
                                {mode === 'forgot_password' ? (
                                    <Mail className="text-red-500/80 w-8 h-8" />
                                ) : (
                                    <KeyRound className="text-red-500/80 w-8 h-8" />
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-stone-200 tracking-[0.2em] uppercase">
                                Quarantine<span className="text-red-600">Gate</span>
                            </h1>
                            <p className="text-stone-500 text-xs mt-2 font-mono tracking-widest uppercase">
                                {getTitle()} REQUIRED
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-full space-y-5">

                            {/* Email Input */}
                            <div className="space-y-1">
                                <label className="text-stone-500 text-xs uppercase tracking-wider font-bold ml-1">Email</label>
                                <div
                                    className={`group relative flex items-center bg-stone-950/50 border rounded-lg transition-all duration-300
                                ${focusedField === 'email' ? 'border-red-900/60 ring-1 ring-red-900/30 shadow-lg' : 'border-stone-800 hover:border-stone-700'}
                            `}
                                >
                                    <User size={18} className={`ml-3 transition-colors ${focusedField === 'email' ? 'text-red-400' : 'text-stone-600'}`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent text-stone-200 p-3 pl-3 outline-none text-sm font-mono placeholder-stone-700"
                                        placeholder="user@example.com"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input (Visible only for Login and Register) */}
                            {mode !== 'forgot_password' && (
                                <div className="space-y-1">
                                    <label className="text-stone-500 text-xs uppercase tracking-wider font-bold ml-1">Password</label>
                                    <div
                                        className={`group relative flex items-center bg-stone-950/50 border rounded-lg transition-all duration-300
                                    ${focusedField === 'password' ? 'border-red-900/60 ring-1 ring-red-900/30 shadow-lg' : 'border-stone-800 hover:border-stone-700'}
                                `}
                                    >
                                        <KeyRound size={18} className={`ml-3 transition-colors ${focusedField === 'password' ? 'text-red-400' : 'text-stone-600'}`} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (mode === 'register') validatePassword(e.target.value);
                                            }}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-transparent text-stone-200 p-3 pl-3 outline-none text-sm font-mono placeholder-stone-700"
                                            placeholder="ACCESS CODE"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    {/* Password Requirements hint (only on register) */}
                                    {mode === 'register' && (
                                        <p className="text-[10px] text-stone-500 pl-1">
                                            Min: 6 chars, 1 Uppercase, 1 Lowercase
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Login Options (Remember Me & Forgot Password) */}
                            {mode === 'login' && (
                                <div className="flex items-center justify-between pl-1">
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                                            ${rememberMe ? 'bg-red-950 border-red-900 text-red-500' : 'bg-transparent border-stone-700'}
                                        `}>
                                            {rememberMe && <div className="w-2 h-2 rounded-sm bg-red-500" />}
                                        </div>
                                        <label className="text-stone-500 text-xs font-mono select-none cursor-pointer">KEEP SESSION</label>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleSwitchMode('forgot_password')}
                                        className="text-stone-500 hover:text-red-400 text-xs font-mono transition-colors"
                                    >
                                        FORGOT CODE?
                                    </button>
                                </div>
                            )}

                            {/* Back to Login Link (for Register/Forgot) */}
                            {mode !== 'login' && (
                                <button
                                    type="button"
                                    onClick={() => handleSwitchMode('login')}
                                    className="flex items-center gap-2 text-stone-500 hover:text-stone-300 text-xs font-mono transition-colors pl-1"
                                >
                                    <ArrowLeft size={12} />
                                    BACK TO LOGIN
                                </button>
                            )}

                            {/* Error Message */}
                            {(error || passwordError) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-950/40 border border-red-900/30 rounded-md p-3 flex items-start gap-3"
                                >
                                    <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-red-200/80 text-xs font-mono">{error || passwordError}</p>
                                </motion.div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-green-950/40 border border-green-900/30 rounded-md p-3 flex items-start gap-3"
                                >
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <p className="text-green-200/80 text-xs font-mono">{successMessage}</p>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full relative group overflow-hidden rounded-lg font-bold tracking-widest text-sm uppercase transition-all duration-300
                                ${isLoading ? 'bg-stone-800 cursor-not-allowed text-stone-500' : 'bg-red-950 hover:bg-red-900 text-red-100 border border-red-900/50 shadow-lg hover:shadow-red-900/20'}
                            `}
                            >
                                <div className="px-6 py-4 flex items-center justify-center gap-2 relative z-10">
                                    {isLoading ? (
                                        <>
                                            <Scan className="animate-spin" size={18} />
                                            <span>PROCESSING...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>
                                                {mode === 'login' ? 'Enter System' : mode === 'register' ? 'Register Identity' : 'Send Recovery'}
                                            </span>
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                                {/* Shimmer Effect */}
                                {!isLoading && (
                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-red-500/10 to-transparent z-0" />
                                )}
                            </button>

                            {/* Guest / Mode Switch */}
                            {mode === 'login' ? (
                                <>
                                    <div className="relative flex py-2 items-center">
                                        <div className="flex-grow border-t border-stone-800"></div>
                                        <span className="flex-shrink mx-4 text-stone-600 text-[10px] uppercase tracking-widest">Or</span>
                                        <div className="flex-grow border-t border-stone-800"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchMode('register')}
                                            disabled={isLoading}
                                            className="py-3 bg-transparent border border-stone-800 hover:border-stone-600 rounded-lg text-stone-500 hover:text-stone-300 text-[10px] tracking-wider uppercase transition-all duration-300"
                                        >
                                            Create ID
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => loginAsGuest()}
                                            disabled={isLoading}
                                            className="py-3 bg-transparent border border-stone-800 hover:border-stone-600 rounded-lg text-stone-500 hover:text-stone-300 text-[10px] tracking-wider uppercase transition-all duration-300"
                                        >
                                            Guest Access
                                        </button>
                                    </div>
                                </>
                            ) : null}

                        </form>

                        {/* Footer Decor */}
                        <div className="mt-8 pt-6 border-t border-stone-800/50 w-full flex justify-between text-[10px] text-stone-600 font-mono">
                            <span>SYS.VER.2.4.0</span>
                            <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-600' : 'bg-green-900/50'} animate-pulse`} />
                                {isLoading ? 'SYNCING...' : 'ONLINE'}
                            </span>
                        </div>

                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}
