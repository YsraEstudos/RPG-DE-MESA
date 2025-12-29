import { useShallow } from 'zustand/react/shallow' // id: 0
import { motion, type PanInfo } from 'framer-motion' // id: 1
import { useLayoutStore } from '../store/layoutStore' // id: 2
import type { ButtonItem } from '../store/layoutStore' // id: 3
import { useRef } from 'react' // id: 4
import { GripVertical, X } from 'lucide-react' // id: 5

// Helper to check collision with center zone
const isInsideExclusionZone = (x: number, y: number) => {
    // Center is (0,0) in relative space
    const zoneHalfW = 120 // Reduced slightly to avoid edge cases
    const zoneHalfH = 180

    return Math.abs(x) < zoneHalfW && Math.abs(y) < zoneHalfH
}

interface Props {
    data: ButtonItem
}

export const FloatingButton = ({ data }: Props) => {
    // PERFORMANCE: Use shallow to only subscribe to needed changes
    // Specifically, we don't want to re-render ALL buttons when ONE button moves
    // Note: strict selector for `isEditMode`. Actions are stable.
    const { updateButtonPosition, isEditMode, removeButton, setActivePage } = useLayoutStore(
        useShallow(state => ({
            updateButtonPosition: state.updateButtonPosition,
            isEditMode: state.isEditMode,
            removeButton: state.removeButton,
            setActivePage: state.setActivePage
        }))
    )
    const btnRef = useRef<HTMLDivElement>(null)

    // Calculate offsets relative to screen center
    const updatePosition = (clientX: number, clientY: number) => {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        const relativeX = clientX - centerX
        const relativeY = clientY - centerY

        if (isInsideExclusionZone(relativeX, relativeY)) {
            // Snap logic: Push to nearest edge
            const zoneHalfW = 128
            const zoneHalfH = 192

            let newX = relativeX
            let newY = relativeY

            const distX = zoneHalfW - Math.abs(relativeX)
            const distY = zoneHalfH - Math.abs(relativeY)

            if (distX < distY) {
                newX = relativeX > 0 ? zoneHalfW + 32 : -zoneHalfW - 32
            } else {
                newY = relativeY > 0 ? zoneHalfH + 32 : -zoneHalfH - 32
            }
            updateButtonPosition(data.id, newX, newY)
        } else {
            updateButtonPosition(data.id, relativeX, relativeY)
        }
    }

    return (
        <motion.div
            ref={btnRef}
            drag={isEditMode}
            dragMomentum={false}
            initial={{ x: data.x, y: data.y }}
            animate={{ x: data.x, y: data.y }}
            whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
            onDragEnd={(_, info: PanInfo) => updatePosition(info.point.x, info.point.y)}
            className={`absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-sm shadow-2xl flex items-center justify-center cursor-pointer select-none
       ${isEditMode
                    ? 'bg-red-900/60 hover:bg-red-800/80 ring-2 ring-red-500/50'
                    : 'bg-stone-800 hover:bg-stone-700 border border-stone-600 hover:border-red-900/50 hover:shadow-[0_0_15px_rgba(153,27,27,0.3)]'}
       transition-all duration-200 z-10 backdrop-blur-sm
      `}
            style={{ touchAction: 'none' }}
            onClick={() => {
                if (!isEditMode) {
                    setActivePage(data.id)
                }
            }}
        >
            {isEditMode && (
                <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-red-500 pointer-events-none">
                        <GripVertical size={16} />
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Delete button?')) removeButton(data.id)
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-sm p-1 shadow-md hover:bg-red-700 z-50 flex items-center justify-center border border-red-800"
                        style={{ width: '20px', height: '20px' }}
                    >
                        <X size={12} />
                    </button>
                </>
            )}
            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-300 max-w-[80%] text-center leading-tight pointer-events-none drop-shadow-md">
                {data.label}
            </span>
        </motion.div>
    )
}
