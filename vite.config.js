import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Lingo.dev API calls to avoid CORS
      '/api/lingo': {
        target: 'https://api.lingo.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lingo/, ''),
        headers: {
          'Origin': 'https://api.lingo.dev',
        },
      },
    },
  },
})
