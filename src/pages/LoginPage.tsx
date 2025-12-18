import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { KeyRound, User, ChevronRight, AlertCircle, Scan } from 'lucide-react'

export const LoginPage = () => {
    const { login, loginAsGuest, isLoading, error, resetError } = useAuthStore()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(true)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    // Clear errors on mount
    useEffect(() => {
        resetError()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isLoading) return
        await login(username, password, rememberMe)
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

            <motion.div
                className="w-full max-w-md p-8 relative"
                variants={cardVariants}
            >
                {/* Holographic Border Effect */}
                <div className="absolute inset-0 border border-stone-800 bg-stone-900/60 backdrop-blur-xl rounded-2xl shadow-2xl z-0" />
                <div className="absolute -inset-[1px] bg-gradient-to-b from-stone-700/20 to-transparent rounded-2xl -z-10" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">

                    {/* Header / Logo Area */}
                    <div className="mb-8 text-center relative">
                        <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/30 shadow-[0_0_15px_rgba(153,27,27,0.2)]">
                            <KeyRound className="text-red-500/80 w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-stone-200 tracking-[0.2em] uppercase">
                            Quarantine<span className="text-red-600">Gate</span>
                        </h1>
                        <p className="text-stone-500 text-xs mt-2 font-mono tracking-widest">
                            SECURE ACCESS REQUIRED
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-5">

                        {/* Username Input */}
                        <div className="space-y-1">
                            <label className="text-stone-500 text-xs uppercase tracking-wider font-bold ml-1">Username</label>
                            <div
                                className={`group relative flex items-center bg-stone-950/50 border rounded-lg transition-all duration-300
                            ${focusedField === 'username' ? 'border-red-900/60 ring-1 ring-red-900/30 shadow-lg' : 'border-stone-800 hover:border-stone-700'}
                        `}
                            >
                                <User size={18} className={`ml-3 transition-colors ${focusedField === 'username' ? 'text-red-400' : 'text-stone-600'}`} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full bg-transparent text-stone-200 p-3 pl-3 outline-none text-sm font-mono placeholder-stone-700"
                                    placeholder="IDENTIFIER"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
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
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full bg-transparent text-stone-200 p-3 pl-3 outline-none text-sm font-mono placeholder-stone-700"
                                    placeholder="ACCESS CODE"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center gap-2 pl-1 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                                ${rememberMe ? 'bg-red-950 border-red-900 text-red-500' : 'bg-transparent border-stone-700'}
                             `}>
                                {rememberMe && <div className="w-2 h-2 rounded-sm bg-red-500" />}
                            </div>
                            <label className="text-stone-500 text-xs font-mono select-none cursor-pointer">MAINTAIN CONNECTION</label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-950/40 border border-red-900/30 rounded-md p-3 flex items-start gap-3"
                            >
                                <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <p className="text-red-200/80 text-xs">{error}</p>
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
                                        <span>SCANNING...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enter System</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                            {/* Shimmer Effect */}
                            {!isLoading && (
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-red-500/10 to-transparent z-0" />
                            )}
                        </button>

                        {/* Guest / Anonymous Login */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-stone-800"></div>
                            <span className="flex-shrink mx-4 text-stone-600 text-[10px] uppercase tracking-widest">Or</span>
                            <div className="flex-grow border-t border-stone-800"></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => loginAsGuest()}
                            disabled={isLoading}
                            className="w-full py-3 bg-transparent border border-stone-800 hover:border-stone-600 rounded-lg text-stone-500 hover:text-stone-300 text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span>Access as Guest</span>
                        </button>

                    </form>

                    {/* Footer Decor */}
                    <div className="mt-8 pt-6 border-t border-stone-800/50 w-full flex justify-between text-[10px] text-stone-600 font-mono">
                        <span>SYS.VER.2.4.0</span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-900/50 animate-pulse" />
                            ONLINE
                        </span>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    )
}
