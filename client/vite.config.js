import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Without the site key the review and appointment forms cannot be submitted,
  // so a production build stops here instead of shipping them broken.
  const env = loadEnv(mode, process.cwd())
  if (command === 'build' && mode === 'production' && !env.VITE_TURNSTILE_SITE_KEY) {
    throw new Error('VITE_TURNSTILE_SITE_KEY is not set (Cloudflare Turnstile site key)')
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
