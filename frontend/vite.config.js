import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
  proxy: {
    '/ingest': 'http://localhost:8000',
    '/detect': 'http://localhost:8000',
    '/hazards': 'http://localhost:8000',
    '/trends': 'http://localhost:8000',
    '/export': 'http://localhost:8000'
  }
}
})
