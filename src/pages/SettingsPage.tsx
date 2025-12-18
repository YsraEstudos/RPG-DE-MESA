import { motion } from 'framer-motion'
import { Settings2, Volume2, MonitorSpeaker, Gamepad2, Bell, Moon, Sun, Trash2, Sidebar, LogOut } from 'lucide-react'
import { useLayoutStore } from '../store/layoutStore'
import { useAuthStore } from '../store/authStore'

export const SettingsPage = () => {
    const {
        volume,
        sfxVolume,
        notifications,
        darkMode,
        vibration,
        userPrefersSidebarHidden,
        setVolume,
        setSfxVolume,
        toggleNotifications,
        toggleDarkMode,
        toggleVibration,
        setUserSidebarPreference
    } = useLayoutStore()

    const { logout } = useAuthStore()

    return (
        <div className="h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Settings2 className="text-red-500" size={32} />
                    <h2 className="text-3xl font-bold text-stone-100 uppercase tracking-tight">
                        Configurações
                    </h2>
                </div>

                {/* Settings Sections */}
                <div className="space-y-8">
                    {/* Audio Settings */}
                    <section>
                        <h3 className="text-lg font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-3">
                            <Volume2 size={20} className="text-stone-500" />
                            Áudio
                        </h3>
                        <div className="space-y-4 pl-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-stone-400">Volume Geral</span>
                                    <span className="text-stone-500">{volume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => setVolume(parseInt(e.target.value))}
                                    className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-red-600"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-stone-400">Efeitos Sonoros</span>
                                    <span className="text-stone-500">{sfxVolume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sfxVolume}
                                    onChange={(e) => setSfxVolume(parseInt(e.target.value))}
                                    className="w-full h-2 bg-stone-800 rounded-full appearance-none cursor-pointer accent-red-600"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Display Settings */}
                    <section>
                        <h3 className="text-lg font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-3">
                            <MonitorSpeaker size={20} className="text-stone-500" />
                            Interface
                        </h3>
                        <div className="space-y-3 pl-8">
                            <button
                                onClick={toggleDarkMode}
                                className="w-full flex items-center justify-between p-4 bg-stone-900/50 border border-stone-800 rounded-sm hover:border-stone-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {darkMode ? (
                                        <Moon size={18} className="text-stone-400" />
                                    ) : (
                                        <Sun size={18} className="text-amber-400" />
                                    )}
                                    <span className="text-stone-300">Modo Escuro</span>
                                </div>
                                <div
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-red-900' : 'bg-stone-700'
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                    />
                                </div>
                            </button>

                            <button
                                onClick={toggleNotifications}
                                className="w-full flex items-center justify-between p-4 bg-stone-900/50 border border-stone-800 rounded-sm hover:border-stone-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Bell size={18} className="text-stone-400" />
                                    <span className="text-stone-300">Notificações</span>
                                </div>
                                <div
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-red-900' : 'bg-stone-700'
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                    />
                                </div>
                            </button>

                            {/* Added Sidebar Preference */}
                            <button
                                onClick={() => setUserSidebarPreference(!userPrefersSidebarHidden)}
                                className="w-full flex items-center justify-between p-4 bg-stone-900/50 border border-stone-800 rounded-sm hover:border-stone-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Sidebar size={18} className="text-stone-400" />
                                    <span className="text-stone-300">Ocultar Biometria por Padrão</span>
                                </div>
                                <div
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${userPrefersSidebarHidden ? 'bg-red-900' : 'bg-stone-700'
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full bg-white transition-transform ${userPrefersSidebarHidden ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Controls */}
                    <section>
                        <h3 className="text-lg font-bold text-stone-300 uppercase tracking-wider mb-4 flex items-center gap-3">
                            <Gamepad2 size={20} className="text-stone-500" />
                            Controles
                        </h3>
                        <div className="space-y-3 pl-8">
                            <button
                                onClick={toggleVibration}
                                className="w-full flex items-center justify-between p-4 bg-stone-900/50 border border-stone-800 rounded-sm hover:border-stone-700 transition-colors"
                            >
                                <span className="text-stone-300">Vibração</span>
                                <div
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${vibration ? 'bg-red-900' : 'bg-stone-700'
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full bg-white transition-transform ${vibration ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Danger Zone / Account */}
                    <section className="border-t border-stone-800 pt-8">
                        <h3 className="text-lg font-bold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-3">
                            <Trash2 size={20} />
                            Zona de Perigo
                        </h3>
                        <div className="pl-8 space-y-4">
                            <button
                                onClick={logout}
                                className="w-full text-left px-6 py-3 bg-stone-900 border border-stone-700 text-stone-300 rounded-sm hover:bg-stone-800 transition-colors uppercase tracking-wider text-sm flex items-center gap-3"
                            >
                                <LogOut size={16} />
                                Encerrar Sessão
                            </button>

                            <div>
                                <button className="px-6 py-3 bg-red-900/30 border border-red-900/50 text-red-400 rounded-sm hover:bg-red-900/50 hover:text-red-300 transition-colors uppercase tracking-wider text-sm">
                                    Resetar Progresso
                                </button>
                                <p className="text-xs text-stone-600 mt-2">
                                    Esta ação irá apagar todo o seu progresso. Não pode ser desfeita.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    )
}
