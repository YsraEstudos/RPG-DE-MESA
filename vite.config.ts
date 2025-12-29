import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // SSL apenas para desenvolvimento local
    command === 'serve' ? basicSsl() : null
  ].filter(Boolean),
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          framer: ['framer-motion'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          state: ['zustand']
        }
      }
    }
  }
}))
