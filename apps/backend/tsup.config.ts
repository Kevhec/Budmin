import { defineConfig } from 'tsup'
import { fixImportsPlugin } from "esbuild-fix-imports-plugin";

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  keepNames: true,
  tsconfig: './tsconfig.json',
  esbuildPlugins: [
    fixImportsPlugin(),
  ],
  esbuildOptions(options) {
    options.outbase = 'src'
    // Ensure path mapping is preserved
    options.alias = {
      '@': './',
      '@lib': './src/lib',
      '@database': './src/database',
      '@schemas': './src/database/schemas',
      '@controllers': './src/controllers',
      '@middlewares': './src/middleware',
      '@router': './src/router'
    }
  }
})