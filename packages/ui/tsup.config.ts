import { defineConfig } from 'tsup'
import { fixImportsPlugin } from "esbuild-fix-imports-plugin";

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm'],
  target: 'esnext',
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  outDir: 'dist',
  external: ['react', 'react-dom'],
  tsconfig: './tsconfig.json',
  esbuildPlugins: [
    fixImportsPlugin(),
  ],
  esbuildOptions(options) {
    options.outbase = 'src'
  }
})