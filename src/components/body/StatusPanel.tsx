import { motion } from 'framer-motion'
import { Heart, Droplets, Utensils, Zap, Brain } from 'lucide-react'
import { useBodyStore } from '../../store/bodyStore'
import { useShallow } from 'zustand/react/shallow'

const StatBar = ({
    icon: Icon,
    value,
    color,
    label
}: {
    icon: any,
    value: number,
    color: string,
    label: string
}) => {
    // Determine status color based on value thresholds
    // Use the passed color as base, but desaturate/darken if value is low?
    // Or just keep simple.

    return (
        <div className="flex items-center gap-3 w-full group">
            <div className={`
                p-2 rounded-md bg-stone-950/50 border border-stone-800 
                ${color} bg-opacity-10 text-opacity-90 shadow-sm
                group-hover:border-stone-600 transition-colors duration-300
            `}>
                <Icon size={16} className={color} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    <span className="group-hover:text-stone-200 transition-colors">{label}</span>
                    <span className={value < 30 ? "text-red-500 animate-pulse" : "text-stone-500"}>
                        {Math.round(value)}%
                    </span>
                </div>
                <div className="h-2 bg-stone-900/80 rounded-full overflow-hidden border border-stone-800/50 relative">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_4px)]"></div>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                        className={`h-full rounded-r-full shadow-[0_0_10px_currentColor] ${color.replace('text-', 'bg-')}`}
                    >
                        {/* Shine effect */}
                        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_4px_rgba(255,255,255,0.8)]"></div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export const StatusPanel = () => {
    const stats = useBodyStore(useShallow(state => state.stats))

    return (
        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 p-5 bg-stone-900/90 backdrop-blur-xl border border-stone-700/50 rounded-lg shadow-2xl">
            {/* Header decoration */}
            <div className="absolute -top-3 left-4 px-2 bg-black/80 border border-stone-800 text-[10px] text-stone-500 uppercase tracking-[0.2em]">
                Vitals Monitor
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <StatBar icon={Heart} value={stats.health} color="text-red-600" label="Sistemas" />
                <StatBar icon={Zap} value={stats.energy} color="text-yellow-500" label="Energia" />
                <StatBar icon={Utensils} value={stats.hunger} color="text-orange-500" label="Nutrição" />
                <StatBar icon={Droplets} value={stats.thirst} color="text-blue-400" label="Hidratação" />
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent my-1" />

            <StatBar icon={Brain} value={stats.sanity} color="text-purple-500" label="Psique" />
        </div>
    )
}
