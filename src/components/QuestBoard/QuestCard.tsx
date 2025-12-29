import { useState } from 'react'
import { motion } from 'framer-motion'
import { PenLine, RotateCcw, Trophy, Trash2 } from 'lucide-react'
import { useQuestStore } from '../../store/questStore'
import type { Quest } from '../../store/questStore'
import clsx from 'clsx'

interface QuestCardProps {
    quest: Quest
}

const DIFFICULTY_COLORS = {
    'Fácil': 'text-green-700 bg-green-100 border-green-300',
    'Médio': 'text-amber-700 bg-amber-100 border-amber-300',
    'Difícil': 'text-red-700 bg-red-100 border-red-300',
    'Mortal': 'text-purple-900 bg-purple-200 border-purple-400',
} as const

export function QuestCard({ quest }: QuestCardProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const updateNotes = useQuestStore((state) => state.updateQuestNotes)
    const removeQuest = useQuestStore((state) => state.removeQuest)

    const handleFlip = () => setIsFlipped(!isFlipped)
    const handleDelete = () => {
        if (window.confirm(`Excluir missão "${quest.title}"?`)) {
            removeQuest(quest.id)
        }
    }

    const difficultyColor = DIFFICULTY_COLORS[quest.difficulty] || DIFFICULTY_COLORS['Fácil']

    return (
        <div className="relative w-full h-64 perspective-1000 group cursor-pointer select-none" >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden flex flex-col">
                    {/* Parchment Background */}
                    <div className="absolute inset-0 bg-amber-100 rounded-lg shadow-md border-2 border-amber-200/50 overflow-hidden">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-amber-900/20 pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-4 h-full flex flex-col justify-between" onClick={(e) => {
                        e.stopPropagation()
                    }}>
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full border shadow-sm", difficultyColor)}>
                                    {quest.difficulty}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={handleDelete}
                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                        title="Excluir Missão"
                                        aria-label="Excluir missão"
                                        onPointerDownCapture={(e) => e.stopPropagation()}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={handleFlip}
                                        className="p-1.5 text-amber-800 hover:bg-amber-200/50 rounded-full transition-colors"
                                        title="Ver Verso"
                                        aria-label="Ver verso do card"
                                        onPointerDownCapture={(e) => e.stopPropagation()}
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-handwriting text-xl font-bold text-amber-900 leading-tight mb-2 drop-shadow-sm">
                                {quest.title}
                            </h3>

                            <p className="text-amber-800/80 text-sm font-medium italic line-clamp-3">
                                "{quest.description}"
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-amber-900/10">
                            {quest.reward && (
                                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                                    <Trophy size={14} className="text-yellow-600" />
                                    {quest.reward}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stamps/Decorations */}
                    {quest.status === 'done' && (
                        <div className="absolute bottom-2 right-2 opacity-80 rotate-[-15deg] border-4 border-red-800 rounded-lg px-2 py-1 pointer-events-none">
                            <span className="text-red-900 font-black text-xl uppercase tracking-widest stamp-font">CONCLUÍDO</span>
                        </div>
                    )}
                </div>

                {/* BACK FACE */}
                <div
                    className="absolute inset-0 backface-hidden rotate-y-180 h-full w-full rounded-lg overflow-hidden shadow-inner bg-[#d6cab0]"
                >
                    {/* Darker Parchment Texture */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    <div className="relative z-10 p-4 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-2 border-b border-stone-600/20 pb-2">
                            <h4 className="text-stone-800 font-bold flex items-center gap-2">
                                <PenLine size={16} />
                                Anotações
                            </h4>
                            <button
                                onClick={handleFlip}
                                className="p-1.5 text-stone-700 hover:bg-stone-600/10 rounded-full transition-colors"
                                title="Ver Frente"
                                aria-label="Ver frente do card"
                                onPointerDownCapture={(e) => e.stopPropagation()}
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>

                        <textarea
                            className="w-full flex-1 bg-transparent border-none resize-none focus:ring-2 focus:ring-amber-600/50 focus:outline-none rounded text-stone-900 font-handwriting text-sm leading-relaxed placeholder:text-stone-500/50 select-text"
                            placeholder="Escreva dicas ou lembretes aqui..."
                            value={quest.notes}
                            onChange={(e) => updateNotes(quest.id, e.target.value)}
                            onPointerDownCapture={(e) => e.stopPropagation()}
                            aria-label={`Anotações da missão ${quest.title}`}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
