import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { past } from './src/config/config'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:past
  
})
