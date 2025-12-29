import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Sword } from 'lucide-react'
import { useQuestStore } from '../../store/questStore'
import clsx from 'clsx'

const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil', 'Mortal'] as const

interface NewQuestFormProps {
    isOpen: boolean
    onClose: () => void
}

export function NewQuestForm({ isOpen, onClose }: NewQuestFormProps) {
    const addQuest = useQuestStore((state) => state.addQuest)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [difficulty, setDifficulty] = useState<typeof DIFFICULTIES[number]>('Fácil')
    const [reward, setReward] = useState('')
    const [notes, setNotes] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !description.trim()) return

        addQuest({
            title: title.trim(),
            description: description.trim(),
            difficulty,
            notes,
            reward: reward.trim() || undefined
        })

        // Reset form
        setTitle('')
        setDescription('')
        setDifficulty('Fácil')
        setReward('')
        setNotes('')
        onClose()
    }

    const difficultyColors = {
        'Fácil': 'bg-green-600 hover:bg-green-700',
        'Médio': 'bg-amber-600 hover:bg-amber-700',
        'Difícil': 'bg-red-600 hover:bg-red-700',
        'Mortal': 'bg-purple-700 hover:bg-purple-800',
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-stone-900 border border-amber-900/50 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-950/50">
                            <h2 className="text-xl font-gothic text-amber-400 font-bold flex items-center gap-2">
                                <Sword size={20} />
                                Nova Missão
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-stone-500 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
                                aria-label="Fechar formulário"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm text-stone-400 mb-1.5 font-medium">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: O Pergaminho Perdido"
                                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder:text-stone-600 focus:ring-2 focus:ring-amber-600/50 focus:outline-none focus:border-amber-700 transition-colors"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-stone-400 mb-1.5 font-medium">
                                    Descrição *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descreva a missão..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder:text-stone-600 focus:ring-2 focus:ring-amber-600/50 focus:outline-none focus:border-amber-700 transition-colors resize-none"
                                    required
                                />
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-sm text-stone-400 mb-1.5 font-medium">
                                    Dificuldade
                                </label>
                                <div className="flex gap-2">
                                    {DIFFICULTIES.map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setDifficulty(d)}
                                            className={clsx(
                                                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border-2",
                                                difficulty === d
                                                    ? `${difficultyColors[d]} text-white border-transparent`
                                                    : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-600"
                                            )}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reward */}
                            <div>
                                <label className="block text-sm text-stone-400 mb-1.5 font-medium">
                                    Recompensa (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={reward}
                                    onChange={(e) => setReward(e.target.value)}
                                    placeholder="Ex: 100 Moedas de Ouro"
                                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder:text-stone-600 focus:ring-2 focus:ring-amber-600/50 focus:outline-none focus:border-amber-700 transition-colors"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm text-stone-400 mb-1.5 font-medium">
                                    Anotações (opcional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Dicas ou lembretes..."
                                    rows={2}
                                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder:text-stone-600 focus:ring-2 focus:ring-amber-600/50 focus:outline-none focus:border-amber-700 transition-colors resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!title.trim() || !description.trim()}
                                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-700 disabled:text-stone-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Criar Missão
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
