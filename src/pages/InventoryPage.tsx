import { motion } from 'framer-motion'
import { Package, Shield, Sword, Heart, Zap, Plus } from 'lucide-react'

const mockItems = [
    { id: 1, name: 'Espada de Ferro', type: 'weapon', rarity: 'common', icon: Sword },
    { id: 2, name: 'Escudo de Madeira', type: 'armor', rarity: 'common', icon: Shield },
    { id: 3, name: 'Poção de Vida', type: 'consumable', rarity: 'uncommon', icon: Heart },
    { id: 4, name: 'Cristal de Energia', type: 'material', rarity: 'rare', icon: Zap },
]

const rarityColors = {
    common: 'border-stone-600 bg-stone-800/50',
    uncommon: 'border-green-600 bg-green-900/30',
    rare: 'border-blue-500 bg-blue-900/30',
    epic: 'border-purple-500 bg-purple-900/30',
    legendary: 'border-amber-500 bg-amber-900/30',
}

export const InventoryPage = () => {
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
                        <Package className="text-red-500" size={32} />
                        <h2 className="text-3xl font-bold text-stone-100 uppercase tracking-tight">
                            Inventário
                        </h2>
                    </div>
                    <div className="text-stone-500 text-sm uppercase tracking-widest">
                        {mockItems.length} / 20 Slots
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Peso', value: '12.5kg', max: '50kg' },
                        { label: 'Ouro', value: '1,250', icon: '💰' },
                        { label: 'Itens Raros', value: '2', icon: '✨' },
                        { label: 'Valor Total', value: '3,450', icon: '💎' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-stone-900/50 border border-stone-800 p-4 rounded-sm"
                        >
                            <div className="text-stone-500 text-xs uppercase tracking-widest mb-1">
                                {stat.label}
                            </div>
                            <div className="text-xl font-bold text-stone-200">
                                {stat.icon && <span className="mr-2">{stat.icon}</span>}
                                {stat.value}
                                {stat.max && <span className="text-stone-600 font-normal"> / {stat.max}</span>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inventory Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {mockItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`aspect-square p-4 border-2 rounded-sm cursor-pointer hover:scale-105 transition-transform ${rarityColors[item.rarity as keyof typeof rarityColors]}`}
                        >
                            <div className="h-full flex flex-col items-center justify-center gap-2">
                                <item.icon size={32} className="text-stone-300" />
                                <span className="text-xs text-center text-stone-400 uppercase tracking-wider">
                                    {item.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: 8 - mockItems.length }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="aspect-square border-2 border-dashed border-stone-800/50 rounded-sm flex items-center justify-center opacity-30 hover:opacity-50 hover:border-stone-700 cursor-pointer transition-all"
                        >
                            <Plus size={24} className="text-stone-600" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
