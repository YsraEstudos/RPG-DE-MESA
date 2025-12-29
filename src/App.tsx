import { FloatingButton } from './components/FloatingButton'
import { useLayoutStore } from './store/layoutStore'
import { Settings, PanelLeftClose, PanelLeftOpen, Move, X, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DynamicIsland } from './components/DynamicIsland'
import { useState, lazy, Suspense, useMemo, useEffect } from 'react'
import { QuestBoardWidget } from './components/QuestBoard/QuestBoardWidget'

// Page imports
import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from './store/authStore'
import { auth } from './services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { mapFirebaseUser } from './services/authService'
// Page imports - Code Splitting
// Using lazy loading to reduce initial bundle size
const HumanBodyZone = lazy(() => import('./components/HumanBodyZone').then(module => ({ default: module.HumanBodyZone })))
const InventoryPage = lazy(() => import('./pages/InventoryPage').then(module => ({ default: module.InventoryPage })))
const MissionsPage = lazy(() => import('./pages/MissionsPage').then(module => ({ default: module.MissionsPage })))
const MapPage = lazy(() => import('./pages/MapPage').then(module => ({ default: module.MapPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })))
const DefaultPage = lazy(() => import('./pages/DefaultPage').then(module => ({ default: module.DefaultPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))


// Page registry - maps page IDs to components
// Note: We need to type this as LazyExoticComponent or similar, but for simplicity in this refactor
// we will handle the registry dynamically or keep it simple.
// Since lazy components are components, this map works if we treat them as standard components.
const pageRegistry: Record<string, React.ComponentType<any>> = {
  'inventory': InventoryPage,
  'inventário': InventoryPage,
  'missions': MissionsPage,
  'missões': MissionsPage,
  'map': MapPage,
  'mapa': MapPage,
  'settings': SettingsPage,
  'configurações': SettingsPage,
}

function App() {
  // PERFORMANCE: Use shallow selector to prevent unnecessary re-renders
  const {
    buttons,
    isEditMode,
    toggleEditMode,
    activePageId,
    setActivePage,
    showSidebar,
    toggleSidebar
  } = useLayoutStore(
    useShallow((state) => ({
      buttons: state.buttons,
      isEditMode: state.isEditMode,
      toggleEditMode: state.toggleEditMode,
      activePageId: state.activePageId,
      setActivePage: state.setActivePage,
      showSidebar: state.showSidebar,
      toggleSidebar: state.toggleSidebar,
    }))
  )

  const { isAuthenticated, hasHydrated, user } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Determine view state
  const isHome = !activePageId || activePageId === 'home'

  // AUTH OBSERVER: Sync local state with real Firebase Auth state
  // This prevents users from bypassing login by manually setting localStorage or stale tokens
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in to Firebase
        const user = await mapFirebaseUser(firebaseUser);
        useAuthStore.getState().syncUser(user);
      } else {
        // User is signed out in Firebase
        useAuthStore.getState().syncUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Determine which page to render - Memoized to prevent O(N) lookup on every render
  const pageContent = useMemo(() => {
    if (isHome || !activePageId) return null

    const pageId = activePageId.toLowerCase().trim()
    const PageComponent = pageRegistry[pageId]

    if (PageComponent) {
      return <PageComponent />
    }

    // Check if it's a button-based page
    const activeButton = buttons.find(b => b.id === activePageId)
    if (activeButton) {
      const labelLower = activeButton.label.toLowerCase().trim()
      const ButtonPageComponent = pageRegistry[labelLower]
      if (ButtonPageComponent) {
        return <ButtonPageComponent />
      }
      return <DefaultPage pageId={activeButton.id} label={activeButton.label} />
    }

    return <DefaultPage pageId={activePageId} label={activePageId} />
  }, [isHome, activePageId, buttons])

  // HYDRATION CHECK
  // Wait for the store to read from localStorage before rendering anything.
  // This prevents the "Flash of Login Screen" if the user is actually authenticated.
  if (!hasHydrated) {
    return (
      <div className="w-full h-full bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-red-900 border-t-red-500 animate-spin" />
      </div>
    )
  }

  // AUTH GUARD
  // If not authenticated, show only the Login Page
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div className="w-full h-full bg-stone-950 flex items-center justify-center text-stone-600">Loading Auth...</div>}>
        <LoginPage />
      </Suspense>
    )
  }

  return (
    <div className="relative w-full h-full text-stone-200 bg-stone-950 overflow-hidden font-mono selection:bg-red-900 selection:text-white">
      {/* Background Elements - Zombie / Gritty Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900 to-stone-950 -z-20" />
      <div className="absolute inset-0 opacity-10 pointer-events-none -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-150" />

      {/* Dynamic Island - Always visible */}
      <DynamicIsland />

      {/* MAIN CONTAINER LAYOUT */}

      {/* 1. HOME LAYOUT */}
      <AnimatePresence>
        {isHome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-6 left-6 z-40 flex items-center gap-4"
            >
              <h1 className="text-2xl font-bold text-stone-500 tracking-widest opacity-80 select-none uppercase border-l-4 border-red-900/50 pl-3">
                SURVIVAL UI
              </h1>
            </motion.header>

            {/* Floating Buttons */}
            {buttons.map((btn) => (
              <FloatingButton key={btn.id} data={btn} />
            ))}

            {/* Note: Character Body is STRICTLY HIDDEN on HOME based on requirements. 
                  If you need it back, uncomment HumanBodyZone or CharacterButton below, 
                  but the request specified it must be hidden. 
              */}
          </motion.div>
        )}
      </AnimatePresence>


      {/* 2. SUB-PAGE LAYOUT (Split Screen) */}
      <AnimatePresence>
        {!isHome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pt-24 pb-6 px-6 z-10 flex gap-6"
          >
            {/* LEFT SIDEBAR (Body) - Hidden if showSidebar is false OR on Mobile (hidden md:block handled via CSS/media queries usually, but doing logic here for cleanliness) */}
            <AnimatePresence mode="wait">
              {showSidebar && (
                <motion.aside
                  initial={{ width: 0, opacity: 0, x: -50 }}
                  animate={{ width: 340, opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: -50 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  className="hidden md:block h-full flex-shrink-0 relative"
                >
                  <Suspense fallback={<div className="w-[340px] h-full flex items-center justify-center bg-stone-900/40 rounded-lg border border-stone-800"><div className="w-8 h-8 rounded-full border-2 border-red-900 border-t-red-500 animate-spin" /></div>}>
                    <HumanBodyZone isVisible={true} variant="side" />
                  </Suspense>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* RIGHT CONTENT AREA - Expands to fill space */}
            <motion.main
              layout
              className="flex-1 h-full bg-stone-900/40 backdrop-blur-md border border-stone-800 rounded-lg overflow-hidden relative shadow-2xl"
            >
              {/* Sidebar Toggle Button (Inside Content Area for Focus Mode) */}
              <button
                onClick={toggleSidebar}
                className="absolute top-4 left-4 z-50 text-stone-600 hover:text-stone-300 transition-colors p-2 rounded-full hover:bg-stone-800"
                title={showSidebar ? "Focus Mode (Hide Sidebar)" : "Show Sidebar"}
              >
                {showSidebar ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>

              <div className="w-full h-full overflow-y-auto p-8 pt-16 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-stone-700 border-t-red-500 animate-spin" />
                  </div>
                }>
                  {pageContent}
                </Suspense>
              </div>
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Global Controls Overlay */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4 z-50">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-stone-900 border border-stone-800 rounded-lg shadow-xl overflow-hidden mb-2 min-w-[200px]"
            >
              <div className="p-2 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setActivePage('settings')
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-stone-300 hover:bg-stone-800 rounded-md transition-colors w-full text-left"
                >
                  <Settings size={18} />
                  Configurações
                </button>

                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      // Placeholder for Admin Page navigation
                      console.log("Admin Area Accessed");
                      // setActivePage('admin'); // Enable this when AdminPage is ready
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-950/30 rounded-md transition-colors w-full text-left font-bold"
                  >
                    <ShieldAlert size={18} />
                    ADMIN
                  </button>
                )}

                <button
                  onClick={() => {
                    toggleEditMode()
                    setIsMenuOpen(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors w-full text-left ${isEditMode ? 'text-red-400 bg-red-900/20' : 'text-stone-300 hover:bg-stone-800'
                    }`}
                >
                  <Move size={18} />
                  {isEditMode ? 'Sair da Edição' : 'Mover Botões'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all border border-stone-700
              ${isMenuOpen ? 'bg-stone-800 text-white rotate-90' : 'bg-stone-900/80 text-stone-400 hover:text-white backdrop-blur-sm'}
          `}
          title="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Settings size={24} />}
        </button>
      </div>

      {isEditMode && (
        <div className="absolute top-6 right-6 text-xs text-red-500 font-mono bg-black/80 px-4 py-2 border border-red-900/40 rounded-full font-bold z-50 animate-pulse tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Modo de Edição
        </div>
      )}

      {/* Quest Board Widget */}
      <QuestBoardWidget />
    </div>
  )
}

export default App
