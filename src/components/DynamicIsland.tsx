import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLayoutStore } from '../store/layoutStore'
import { Home, Map, Backpack, Scroll, X, ChevronDown } from 'lucide-react'

// Core navigation pages - fixed structure
const CORE_PAGES = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'inventory', label: 'Inventário', icon: Backpack },
    { id: 'missions', label: 'Missões', icon: Scroll },
    { id: 'map', label: 'Mapa', icon: Map },
] as const

type CorePageId = typeof CORE_PAGES[number]['id']

export const DynamicIsland = () => {
    const { activePageId, setActivePage } = useLayoutStore()
    const [isExpanded, setIsExpanded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Find current page info
    const currentPage = CORE_PAGES.find(p => p.id === activePageId) || CORE_PAGES[0]
    const isHome = !activePageId || activePageId === 'home'

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleNavigate = (id: CorePageId) => {
        setActivePage(id === 'home' ? null : id)
        setIsExpanded(false)
    }

    return (
        <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
            <motion.div
                ref={containerRef}
                layout
                initial={false}
                animate={{
                    width: isExpanded ? 340 : 200,
                    height: isExpanded ? 'auto' : 52,
                    borderRadius: 26
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35
                }}
                className="pointer-events-auto relative overflow-hidden"
                style={{
                    background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                    boxShadow: isExpanded
                        ? '0 0 40px rgba(139, 0, 0, 0.15), 0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                        : '0 0 20px rgba(0, 0, 0, 0.5), 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
                onClick={() => !isExpanded && setIsExpanded(true)}
            >
                {/* Subtle glow effect */}
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-500"
                    style={{
                        background: isExpanded
                            ? 'radial-gradient(ellipse at top, rgba(139, 0, 0, 0.2), transparent 60%)'
                            : 'radial-gradient(ellipse at top, rgba(100, 100, 100, 0.1), transparent 60%)'
                    }}
                />

                <motion.div layout className="relative w-full h-full flex flex-col">

                    {/* Header / Compact View */}
                    <div className="h-[52px] w-full flex items-center justify-between px-1.5 cursor-pointer">
                        {/* Left Icon (Home or Close) */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-11 h-11 flex items-center justify-center text-stone-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                            onClick={(e) => {
                                e.stopPropagation()
                                if (isExpanded) {
                                    setIsExpanded(false)
                                } else {
                                    handleNavigate('home')
                                }
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isExpanded ? 'close' : 'home'}
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {isExpanded ? <X size={18} /> : <Home size={18} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Center Text */}
                        <motion.div
                            layout="position"
                            className="flex-1 text-center"
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isExpanded ? 'nav' : currentPage.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-xs font-bold uppercase tracking-[0.2em] text-stone-300 block"
                                >
                                    {isExpanded ? 'Navigate' : (isHome ? 'Home Base' : currentPage.label)}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>

                        {/* Right Indicator (Expand) */}
                        <div className="w-11 h-11 flex items-center justify-center text-stone-600">
                            <motion.div
                                animate={{
                                    opacity: isExpanded ? 0 : 1,
                                    rotate: isExpanded ? 180 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={16} className="animate-pulse" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-3 pb-4 pt-1">
                                    {/* Divider */}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

                                    {/* Navigation Grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {CORE_PAGES.map((page, index) => {
                                            const isActive = (page.id === 'home' && isHome) ||
                                                (page.id === activePageId)
                                            const Icon = page.icon

                                            return (
                                                <motion.button
                                                    key={page.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => handleNavigate(page.id)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`relative p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200 overflow-hidden group
                                                        ${isActive
                                                            ? 'bg-white/10 text-white'
                                                            : 'bg-black/30 text-stone-400 hover:bg-white/5 hover:text-stone-200'
                                                        }`}
                                                >
                                                    {/* Active indicator glow */}
                                                    {isActive && (
                                                        <div
                                                            className="absolute inset-0 opacity-50"
                                                            style={{
                                                                background: 'radial-gradient(circle at center, rgba(139, 0, 0, 0.3), transparent 70%)'
                                                            }}
                                                        />
                                                    )}

                                                    {/* Icon container */}
                                                    <div className={`relative p-2.5 rounded-lg transition-colors duration-200
                                                        ${isActive
                                                            ? 'bg-red-900/40 text-red-200'
                                                            : 'bg-stone-800/50 group-hover:bg-stone-700/50'
                                                        }`}
                                                    >
                                                        <Icon size={20} />
                                                    </div>

                                                    {/* Label */}
                                                    <span className="relative text-[10px] uppercase font-bold tracking-wider">
                                                        {page.label}
                                                    </span>

                                                    {/* Active dot indicator */}
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="activeIndicator"
                                                            className="absolute bottom-2 w-1 h-1 rounded-full bg-red-500"
                                                        />
                                                    )}
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </motion.div>
        </div>
    )
}
