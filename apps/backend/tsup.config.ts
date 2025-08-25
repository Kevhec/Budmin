import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: false, // Keep this false to preserve your file structure
  keepNames: true,
  external: [
    // Add any packages that should remain external
  ]
})