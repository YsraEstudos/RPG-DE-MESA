import { motion, AnimatePresence } from 'framer-motion'
import { BodySilhouette } from './body/BodySilhouette'
import { StatusPanel } from './body/StatusPanel'
import { X } from 'lucide-react'

// This component can now be toggled or always visible based on requirements.
// Currently, App.tsx renders it conditionally or permanently.
// Let's assume for now it replaces the placeholder in the center.

interface Props {
    isVisible?: boolean
    onClose?: () => void
    variant?: 'centered' | 'side'
}

export const HumanBodyZone = ({ isVisible = true, onClose, variant = 'centered' }: Props) => {
    // Simplified layout classes: now it's mostly filling the parent container + some padding.
    // If variant is side, it should fill content.
    // If variant is centered (legacy or future use), it keeps absolute centering.

    const layoutClasses = variant === 'centered'
        ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[600px]"
        : "w-full h-full" // Side mode: fills parent container

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    // Reduced animation complexity for side mode to prevent layout thrashing
                    initial={variant === 'centered' ? { opacity: 0, scale: 0.9, x: '-50%' } : { opacity: 0 }}
                    animate={variant === 'centered'
                        ? { opacity: 1, scale: 1, x: '-50%' }
                        : { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`${layoutClasses} z-40 flex flex-col items-center justify-center relative`}
                >
                    {/* Glassmorphism Container */}
                    <div className="w-full h-full bg-stone-900/60 backdrop-blur-sm rounded-lg border border-stone-700/50 shadow-2xl overflow-hidden relative flex flex-col">

                        {/* Header */}
                        <div className="flex-shrink-0 h-10 bg-black/40 flex items-center justify-between px-4 border-b border-stone-800 z-20">
                            <span className="text-xs font-bold text-stone-500 tracking-widest uppercase flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-900 rounded-full animate-pulse"></span>
                                Bio-Status
                            </span>
                            {onClose && (
                                <button onClick={onClose} className="text-stone-600 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Scanner Beam Animation Removed */}

                        {/* Body View - Flexible height */}
                        <div className="flex-1 relative w-full pt-4 pb-4">
                            {/* Keep BodySilhouette centered within this view */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BodySilhouette />
                            </div>
                        </div>

                        {/* Stats Panel - Fixed at bottom */}
                        <div className="flex-shrink-0">
                            <StatusPanel />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
