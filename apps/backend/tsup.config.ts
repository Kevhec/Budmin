import { defineConfig } from 'tsup'
import { fixImportsPlugin } from "esbuild-fix-imports-plugin";
import { execSync } from 'child_process';

export default defineConfig({
  entry: ['src/**/*.{ts,js}'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  keepNames: true,
  tsconfig: './tsconfig.json',
  onSuccess: async () => {
    if (process.env.NODE_ENV === 'development') {
      execSync('cp ./ca.pem dist/');
    }
  },
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