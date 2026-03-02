import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// Plugin to copy manifest.json to dist
const copyManifest = () => ({
  name: 'copy-manifest',
  closeBundle() {
    copyFileSync('manifest.json', 'dist/manifest.json')
  }
})

// function generateManifest() {
//   const manifest = readJsonFile("src/manifest.json");
//   const pkg = readJsonFile("package.json");
//   return {
//     name: pkg.name,
//     description: pkg.description,
//     version: pkg.version,
//     ...manifest
//   };
// }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // webExtension({
    //   manifest: generateManifest
    // }),
    copyManifest()
  ],
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
