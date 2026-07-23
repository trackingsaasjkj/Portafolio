import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js core — largest chunk, separate so it caches independently
          'vendor-three':    ['three'],
          // R3F ecosystem
          'vendor-r3f':      ['@react-three/fiber', '@react-three/drei'],
          // Post-processing
          'vendor-post':     ['@react-three/postprocessing', 'postprocessing'],
          // Animation libs
          'vendor-anim':     ['gsap', 'framer-motion'],
          // State
          'vendor-state':    ['zustand'],
        },
      },
    },
    // Raise warning threshold — Three.js chunks are inherently large
    chunkSizeWarningLimit: 600,
  },
})
