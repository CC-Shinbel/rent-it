import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/rent-it/admin',
        changeOrigin: true,
        secure: false,
      },
      '/admin/api': {
        target: 'http://localhost/rent-it',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
