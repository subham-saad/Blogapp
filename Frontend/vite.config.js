import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://blogapp-3-hruz.onrender.com",
    }  
  } ,
  plugins: [react()],
})
