import { motion } from 'framer-motion'
import { Target, Clock, Star, CheckCircle2, Circle } from 'lucide-react'

const mockMissions = [
    {
        id: 1,
        title: 'Eliminar os Infectados',
        description: 'Elimine 10 zumbis na zona norte da cidade',
        status: 'active',
        progress: 7,
        total: 10,
        reward: '500 XP',
        difficulty: 'medium',
    },
    {
        id: 2,
        title: 'Encontrar Suprimentos',
        description: 'Colete suprimentos médicos no hospital abandonado',
        status: 'active',
        progress: 2,
        total: 5,
        reward: '300 XP + Poção de Vida',
        difficulty: 'easy',
    },
    {
        id: 3,
        title: 'O Sobrevivente Perdido',
        description: 'Encontre o cientista desaparecido nas ruínas',
        status: 'pending',
        progress: 0,
        total: 1,
        reward: '1000 XP + Item Raro',
        difficulty: 'hard',
    },
]

const difficultyColors = {
    easy: 'text-green-500',
    medium: 'text-amber-500',
    hard: 'text-red-500',
}

export const MissionsPage = () => {
    return (
        <div className="h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Target className="text-red-500" size={32} />
                        <h2 className="text-3xl font-bold text-stone-100 uppercase tracking-tight">
                            Missões
                        </h2>
                    </div>
                    <div className="flex gap-4 text-sm uppercase tracking-widest">
                        <span className="text-amber-500">2 Ativas</span>
                        <span className="text-stone-600">|</span>
                        <span className="text-stone-500">1 Pendente</span>
                    </div>
                </div>

                {/* Mission List */}
                <div className="space-y-4">
                    {mockMissions.map((mission, index) => (
                        <motion.div
                            key={mission.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`border rounded-sm p-6 cursor-pointer transition-all hover:border-red-900/50 ${mission.status === 'active'
                                    ? 'bg-stone-900/50 border-stone-700'
                                    : 'bg-stone-950/50 border-stone-800/50 opacity-60'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {mission.status === 'active' ? (
                                            <Circle className="text-amber-500" size={16} />
                                        ) : (
                                            <CheckCircle2 className="text-stone-600" size={16} />
                                        )}
                                        <h3 className="text-xl font-bold text-stone-100 uppercase tracking-tight">
                                            {mission.title}
                                        </h3>
                                        <span className={`text-xs ${difficultyColors[mission.difficulty as keyof typeof difficultyColors]}`}>
                                            [{mission.difficulty.toUpperCase()}]
                                        </span>
                                    </div>
                                    <p className="text-stone-500 mb-4 pl-7">
                                        {mission.description}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="pl-7">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-stone-500 uppercase">
                                                Progresso
                                            </span>
                                            <span className="text-xs text-stone-400">
                                                {mission.progress} / {mission.total}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(mission.progress / mission.total) * 100}%` }}
                                                transition={{ delay: 0.3, duration: 0.5 }}
                                                className="h-full bg-gradient-to-r from-red-900 to-red-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                                        <Star size={16} />
                                        <span className="text-sm font-bold">{mission.reward}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-stone-600 text-xs">
                                        <Clock size={14} />
                                        <span>Sem limite</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
