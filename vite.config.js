import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/tokens/": 'http://192.168.1.206:8800/tokens'
    }
  },
  plugins: [react()],
})
