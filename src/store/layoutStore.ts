import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ButtonItem {
    id: string
    label: string
    icon?: string // Lucide icon name or similar
    x: number
    y: number
    color?: string
}

interface LayoutState {
    buttons: ButtonItem[]
    isEditMode: boolean
    toggleEditMode: () => void
    addButton: (button: ButtonItem) => void
    updateButtonPosition: (id: string, x: number, y: number) => void
    removeButton: (id: string) => void
    characterPosition: { x: number, y: number }
    updateCharacterPosition: (x: number, y: number) => void
    activePageId: string | null
    setActivePage: (id: string | null) => void

    // Sidebar & Preferences
    showSidebar: boolean
    userPrefersSidebarHidden: boolean
    toggleSidebar: () => void
    setUserSidebarPreference: (hidden: boolean) => void

    // Global Settings
    volume: number
    sfxVolume: number
    notifications: boolean
    darkMode: boolean
    vibration: boolean
    setVolume: (val: number) => void
    setSfxVolume: (val: number) => void
    toggleNotifications: () => void
    toggleDarkMode: () => void
    toggleVibration: () => void
}

export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            buttons: [],
            isEditMode: false,
            // Default position matches the CSS "bottom-6 left-1/2" roughly
            characterPosition: { x: 0, y: 300 },
            activePageId: null,

            // Sidebar Defaults
            showSidebar: true,
            userPrefersSidebarHidden: false,

            // Settings Defaults
            volume: 70,
            sfxVolume: 80,
            notifications: true,
            darkMode: true,
            vibration: true,

            toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
            addButton: (button) => set((state) => ({ buttons: [...state.buttons, button] })),
            updateButtonPosition: (id, x, y) =>
                set((state) => ({
                    buttons: state.buttons.map((btn) =>
                        btn.id === id ? { ...btn, x, y } : btn
                    ),
                })),
            removeButton: (id) =>
                set((state) => ({ buttons: state.buttons.filter((btn) => btn.id !== id) })),
            updateCharacterPosition: (x, y) => set(() => ({ characterPosition: { x, y } })),
            setActivePage: (id) => set((state) => {
                const isHome = !id || id === 'home'
                // If moving to a sub-page, reset sidebar based on preference
                // If staying on home, logic doesn't matter as much, but we generally hide body on home via App.tsx logic anyway
                // But for the state flag:
                const newShowSidebar = !isHome ? !state.userPrefersSidebarHidden : state.showSidebar

                return { activePageId: id, showSidebar: newShowSidebar }
            }),

            // Sidebar Actions
            toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
            setUserSidebarPreference: (hidden) => set(() => ({ userPrefersSidebarHidden: hidden })),

            // Settings Actions
            setVolume: (volume) => set(() => ({ volume })),
            setSfxVolume: (sfxVolume) => set(() => ({ sfxVolume })),
            toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            toggleVibration: () => set((state) => ({ vibration: !state.vibration })),
        }),
        {
            name: 'rpg-layout-storage',
            partialize: (state) => ({
                // Persist everything EXCEPT showSidebar (temp state)
                buttons: state.buttons,
                characterPosition: state.characterPosition,
                userPrefersSidebarHidden: state.userPrefersSidebarHidden,
                volume: state.volume,
                sfxVolume: state.sfxVolume,
                notifications: state.notifications,
                darkMode: state.darkMode,
                vibration: state.vibration,
            }),
        }
    )
)
