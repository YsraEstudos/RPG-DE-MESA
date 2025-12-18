import { motion } from 'framer-motion'
import { useLayoutStore } from '../store/layoutStore'

interface Props {
    onClick: () => void
    isVisible: boolean
}

export const CharacterButton = ({ onClick, isVisible }: Props) => {
    const { characterPosition, updateCharacterPosition } = useLayoutStore()

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            // Allow free dragging
            drag
            dragMomentum={false} // Disable momentum for precise state updates without jitter
            whileDrag={{ scale: 1.1, zIndex: 60, cursor: 'grabbing' }}
            onDragEnd={(_, info) => {
                // Update position based on the delta (offset) of the drag
                // This preserves the "grab point" so the button doesn't jump to center on the mouse
                updateCharacterPosition(
                    characterPosition.x + info.offset.x,
                    characterPosition.y + info.offset.y
                )
            }}
            animate={{ x: characterPosition.x, y: characterPosition.y }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
            <button
                onClick={onClick}
                className={`
                    flex items-center gap-2 px-6 py-3 rounded-sm
                    bg-stone-900/80 backdrop-blur-md border border-stone-700/50 shadow-2xl 
                    hover:bg-red-900/20 hover:border-red-900/50 hover:scale-105 active:scale-95 transition-all duration-300
                    group cursor-pointer
                `}
                // Prevent drag from triggering click if needed, but usually Framer handles this.
                // Stopping propagation to prevent conflicts if we had parent interactables.
                onPointerDown={(e) => e.stopPropagation()}
            >
                <div className="w-8 h-8 rounded-sm bg-red-900/80 flex items-center justify-center shadow-inner group-hover:rotate-45 transition-transform duration-500">
                    <span className="text-xs font-bold text-red-100">BIO</span>
                </div>
                <span className="text-sm font-semibold tracking-wide text-stone-300 group-hover:text-red-200 uppercase">Status</span>
            </button>
        </motion.div>
    )
}
