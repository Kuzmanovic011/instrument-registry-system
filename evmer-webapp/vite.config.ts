import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const normalizeBaseUrl = (baseUrl?: string) => {
  const path = baseUrl?.trim().replace(/^\/+|\/+$/g, '')

  return path ? `/${path}/` : '/'
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: normalizeBaseUrl(env.VITE_BASE_URL),
    plugins: [react(), tailwindcss()],
  }
})
