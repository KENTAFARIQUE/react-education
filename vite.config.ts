import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  base: '/react-education/',
  plugins: [react(), svgr()],
  server: {
		watch: {
			usePolling: false,  // Включаем polling для Windows
		},
		hmr: {
			overlay: false,
		},
	},
})
