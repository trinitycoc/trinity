import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for custom domain - use root path
  // For custom domain trinitycoc.fun, we use '/' as base
  base: '/',
})

