import { motion } from 'framer-motion'
import { Map, MapPin, AlertTriangle, Home, Skull } from 'lucide-react'

const locations = [
    { id: 1, name: 'Base Segura', x: 50, y: 50, type: 'safe', discovered: true },
    { id: 2, name: 'Hospital Abandonado', x: 25, y: 30, type: 'danger', discovered: true },
    { id: 3, name: 'Zona Industrial', x: 70, y: 20, type: 'danger', discovered: true },
    { id: 4, name: 'Floresta Negra', x: 15, y: 70, type: 'unknown', discovered: false },
    { id: 5, name: 'Centro da Cidade', x: 60, y: 60, type: 'extreme', discovered: true },
]

const typeIcons = {
    safe: Home,
    danger: AlertTriangle,
    unknown: MapPin,
    extreme: Skull,
}

const typeColors = {
    safe: 'bg-green-500 border-green-400',
    danger: 'bg-amber-500 border-amber-400',
    unknown: 'bg-stone-500 border-stone-400',
    extreme: 'bg-red-600 border-red-400',
}

export const MapPage = () => {
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
                        <Map className="text-red-500" size={32} />
                        <h2 className="text-3xl font-bold text-stone-100 uppercase tracking-tight">
                            Mapa
                        </h2>
                    </div>
                    <div className="flex gap-6 text-xs uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-stone-500">Seguro</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-stone-500">Perigoso</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600" />
                            <span className="text-stone-500">Extremo</span>
                        </div>
                    </div>
                </div>

                {/* Map Container */}
                <div className="relative aspect-video bg-stone-900/50 border border-stone-800 rounded-sm overflow-hidden">
                    {/* Grid overlay */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
                            backgroundSize: '10% 10%',
                        }}
                    />

                    {/* Location markers */}
                    {locations.map((loc, index) => {
                        const Icon = typeIcons[loc.type as keyof typeof typeIcons]
                        const colorClass = typeColors[loc.type as keyof typeof typeColors]

                        return (
                            <motion.div
                                key={loc.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: loc.discovered ? 1 : 0.3, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                className="absolute cursor-pointer group"
                                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-125 ${colorClass}`}
                                >
                                    <Icon size={14} className="text-white" />
                                </div>

                                {/* Tooltip */}
                                <div className="absolute left-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <div className="bg-stone-950 border border-stone-700 px-3 py-2 rounded-sm whitespace-nowrap">
                                        <div className="text-sm font-bold text-stone-100">
                                            {loc.discovered ? loc.name : '???'}
                                        </div>
                                        <div className="text-xs text-stone-500 uppercase">
                                            {loc.type === 'safe' && 'Zona Segura'}
                                            {loc.type === 'danger' && 'Zona de Perigo'}
                                            {loc.type === 'extreme' && 'Zona de Morte'}
                                            {loc.type === 'unknown' && 'Não Explorado'}
                                        </div>
                                    </div>
                                </div>

                                {/* Pulse animation for current location */}
                                {loc.type === 'safe' && (
                                    <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2">
                                        <div className="w-8 h-8 rounded-full bg-green-500/30 animate-ping" />
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}

                    {/* Player indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute text-xs text-stone-400 uppercase tracking-widest"
                        style={{ left: '50%', top: '50%' }}
                    >
                        <div className="transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                            <div className="w-4 h-4 bg-blue-500 border-2 border-blue-300 rounded-full animate-pulse" />
                            <span className="bg-stone-950/80 px-2 py-0.5 rounded text-blue-400">Você</span>
                        </div>
                    </motion.div>
                </div>

                {/* Location List */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    {locations
                        .filter((loc) => loc.discovered)
                        .map((loc) => {
                            const Icon = typeIcons[loc.type as keyof typeof typeIcons]
                            return (
                                <div
                                    key={loc.id}
                                    className="flex items-center gap-3 p-3 bg-stone-900/30 border border-stone-800/50 rounded-sm cursor-pointer hover:border-stone-700 transition-colors"
                                >
                                    <Icon size={18} className="text-stone-500" />
                                    <span className="text-sm text-stone-300">{loc.name}</span>
                                </div>
                            )
                        })}
                </div>
            </motion.div>
        </div>
    )
}
