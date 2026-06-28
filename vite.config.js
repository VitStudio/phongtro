import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Raise the warning threshold slightly — assets like listings images are large by design
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // ── Manual chunk strategy ─────────────────────────────────────────
        // Keeps vendor code in a separate long-cached chunk.
        // Route-level pages are already split by React.lazy in App.jsx.
        manualChunks(id) {
          // React core → one stable, cacheable vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // React Router → separate chunk (changes less often than app code)
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // Lucide icons → large library, split out so app chunks stay small
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },

  // Faster local dev: pre-bundle common deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
})
