import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // 👈 THIS IS REQUIRED
    port: 5173,       // optional (default)
    allowedHosts: [
      "92acc6d4a2ca872f-49-36-50-101.serveousercontent.com",
    ],
  }
})
