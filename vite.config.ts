import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE_PATH in CI for GitHub Pages (e.g. /Alaina_bday/)
const base = process.env.VITE_BASE_PATH || '/alainas_bday/'

export default defineConfig({
  plugins: [react()],
  base,
})
