import { useRef, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { useQuestStore } from '../../store/questStore'
import type { QuestStatus } from '../../store/questStore'
import { QuestCard } from './QuestCard'
import clsx from 'clsx'

const COLUMNS: { id: QuestStatus; title: string, color: string }[] = [
    { id: 'todo', title: 'A Fazer', color: 'border-stone-700 bg-stone-900/50' },
    { id: 'progress', title: 'Em Progresso', color: 'border-amber-900/30 bg-amber-900/10' },
    { id: 'done', title: 'Concluído', color: 'border-green-900/30 bg-green-900/10' },
]

export function QuestBoard() {
    const quests = useQuestStore((state) => state.quests)
    const updateQuestStatus = useQuestStore((state) => state.updateQuestStatus)

    // Ref to track column positions for drop detection
    const columnsRefs = useRef<Map<QuestStatus, HTMLDivElement>>(new Map())

    const handleDragStart = () => {
        // Haptic feedback for mobile/supported devices
        if (navigator.vibrate) navigator.vibrate(50)
    }

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, questId: string) => {
        if (navigator.vibrate) navigator.vibrate(20)

        const { point } = info

        // Check which column we dropped it in
        for (const [status, element] of Array.from(columnsRefs.current.entries())) {
            const rect = element.getBoundingClientRect()

            if (
                point.x >= rect.left &&
                point.x <= rect.right &&
                point.y >= rect.top &&
                point.y <= rect.bottom
            ) {
                updateQuestStatus(questId, status)
                return
            }
        }
    }

    // Memoize clustered quests to prevent unnecessary filtering on every render
    const questsByStatus = useMemo(() => {
        return {
            todo: quests.filter(q => q.status === 'todo'),
            progress: quests.filter(q => q.status === 'progress'),
            done: quests.filter(q => q.status === 'done')
        }
    }, [quests])

    return (
        // [FIX 1] LayoutGroup for shared layout animations across lists
        <LayoutGroup>
            <div className="w-full h-full p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
                {COLUMNS.map((col) => {
                    const columnQuests = questsByStatus[col.id]

                    return (
                        <div
                            key={col.id}
                            ref={(el) => {
                                if (el) columnsRefs.current.set(col.id, el)
                                else columnsRefs.current.delete(col.id)
                            }}
                            className={clsx(
                                "flex flex-col h-fit min-h-full rounded-xl border-2 backdrop-blur-sm transition-colors",
                                col.color
                            )}
                            role="region"
                            aria-label={`Coluna ${col.title}`}
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-stone-800 bg-black/20 text-center sticky top-0 z-10 backdrop-blur-md">
                                <h2 className="font-gothic text-xl font-bold text-stone-300 tracking-wider">
                                    {col.title}
                                </h2>
                                <span className="text-xs text-stone-500 uppercase tracking-widest">
                                    {columnQuests.length} {columnQuests.length === 1 ? 'Missão' : 'Missões'}
                                </span>
                            </div>

                            {/* Quest List */}
                            <div
                                className="flex-1 p-4 space-y-4"
                                role="list"
                            >
                                <AnimatePresence mode='popLayout'>
                                    {columnQuests.map((quest) => (
                                        <motion.div
                                            key={quest.id}
                                            layoutId={quest.id}
                                            layout
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                            drag
                                            dragSnapToOrigin
                                            dragElastic={0.1}
                                            onDragStart={handleDragStart}
                                            onDragEnd={(e, info) => handleDragEnd(e, info, quest.id)}
                                            whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
                                            className="cursor-grab active:cursor-grabbing touch-none"
                                            role="listitem"
                                        >
                                            <QuestCard quest={quest} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Empty State Animation */}
                                <AnimatePresence>
                                    {columnQuests.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.5 }}
                                            exit={{ opacity: 0 }}
                                            className="h-32 border-2 border-dashed border-stone-800 rounded-lg flex items-center justify-center text-stone-600 font-gothic text-xs uppercase tracking-widest"
                                        >
                                            Vazio
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )
                })}
            </div>
        </LayoutGroup>
    )
}
