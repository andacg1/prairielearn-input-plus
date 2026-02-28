import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// Plugin to copy manifest.json to dist
const copyManifest = () => ({
  name: 'copy-manifest',
  closeBundle() {
    copyFileSync('manifest.json', 'dist/manifest.json')
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyManifest()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    minify: false,
    sourcemap: 'inline',
  },
})
