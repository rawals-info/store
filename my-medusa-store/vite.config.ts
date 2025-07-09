import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'


export default defineConfig({
  plugins: [react()],
  // 1) Never pre‑bundle SWC in dev
  optimizeDeps: {
    exclude: ['@swc/core'],
  },
  resolve: {
    alias: [
      {
        // Match "@swc/core", any sub-path like "@swc/core/binding", and any binary packages like "@swc/core-linux-x64-gnu"
        find: /^@swc\/core(?:[-\/].*)?$/,
        replacement: path.resolve(__dirname, 'src/empty-swc.js'),
      },
    ],
    // 2) Tell Vite to recognize .node imports as valid extensions
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.node'],
  },
  build: {
    // 3) Use esbuild for minification, bypassing any SWC minifier
    minify: 'esbuild',
    rollupOptions: {
      // 4) Externalize ALL .node files (so esbuild/Rollup won’t try to load them) :contentReference[oaicite:0]{index=0}
      external: [/\.node$/],
    },
  },
  // 5) Serve .node files as static assets instead of bundling
  assetsInclude: ['**/*.node'],
  ssr: {
    // 6) If you ever do SSR, don’t bundle SWC there either
    noExternal: ['@swc/core'],
  },
})
