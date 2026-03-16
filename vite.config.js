import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
            // Add the API key here so it's not exposed in the frontend
            'X-API-Key': env.LINGO_API_KEY || env.VITE_LINGO_API_KEY,
          },
        },
      },
    },
  }
})
