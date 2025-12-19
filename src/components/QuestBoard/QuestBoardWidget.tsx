import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Scroll, X, Plus } from 'lucide-react'
import { QuestBoard } from './QuestBoard'
import { NewQuestForm } from './NewQuestForm'
import { ErrorBoundary } from '../ErrorBoundary'

export function QuestBoardWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [showNewQuestForm, setShowNewQuestForm] = useState(false)

    // Close on Escape key & Focus Trap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)

            // Simple focus trap: preventing interaction with background elements is done via `fixed` overlay,
            // but for full a11y we should trap tab. For now, simple escape + click outside is good.
            // Let's at least shift focus to the modal when it opens.
            // (In a real app, use @radix-ui/react-dialog or similar for robust focus management)
        }
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    return (
        <>
            {/* Floating Trigger Button */}
            <div className="fixed top-0 bottom-0 right-6 z-50 flex items-center pointer-events-none">
                <motion.button
                    onClick={() => setIsOpen(true)}
                    // Enable Vertical Drag
                    drag="y"
                    dragConstraints={{ top: -300, bottom: 300 }} // Reasonable limits from center
                    dragElastic={0.1}
                    dragMomentum={false} // Stops immediately when released, feels more "controlled"

                    whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(251,191,36,0.5)", cursor: "grab" }}
                    whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                    animate={{
                        boxShadow: ["0 0 15px rgba(251,191,36,0.1)", "0 0 25px rgba(251,191,36,0.3)", "0 0 15px rgba(251,191,36,0.1)"],
                        transition: { duration: 2, repeat: Infinity }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-14 h-14 bg-stone-900 border-2 border-amber-700/50 rounded-full flex items-center justify-center transition-shadow overflow-hidden pointer-events-auto"
                    title="Abrir Quadro de Missões (Arraste para mover)"
                >
                    {/* Glowing Background Effect */}
                    <div className="absolute inset-0 bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors" />

                    <Scroll className="text-amber-100 relative z-10" size={24} />

                    {/* Tooltip */}
                    <span className="absolute -top-12 right-0 bg-stone-900 text-amber-100 text-xs px-3 py-1 rounded border border-amber-900/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Quadro de Missões
                    </span>
                </motion.button>
            </div>

            {/* Main Board Overlay - Rendered via Portal */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 pointer-events-auto">

                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            />

                            {/* Modal Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-7xl h-[85vh] bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                            >
                                {/* Header / Close Button */}
                                <div className="absolute top-4 right-4 z-50">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 bg-stone-900/50 hover:bg-red-900/50 text-stone-400 hover:text-white rounded-full transition-colors border border-stone-800"
                                        title="Fechar Quadro de Missões"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Background Texture for the container */}
                                <div className="absolute inset-0 -z-10 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                {/* Content */}
                                <div className="w-full h-full relative">
                                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                                        <h1 className="text-3xl font-gothic text-amber-500 font-bold tracking-widest drop-shadow-md">
                                            QUADRO DE MISSÕES
                                        </h1>
                                        <button
                                            onClick={() => setShowNewQuestForm(true)}
                                            className="mr-12 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                        >
                                            <Plus size={18} />
                                            Nova Missão
                                        </button>
                                    </div>
                                    <div className="pt-20 h-full">
                                        <ErrorBoundary>
                                            <QuestBoard />
                                        </ErrorBoundary>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* New Quest Form Modal */}
            <NewQuestForm
                isOpen={showNewQuestForm}
                onClose={() => setShowNewQuestForm(false)}
            />
        </>
    )
}
