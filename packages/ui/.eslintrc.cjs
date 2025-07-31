module.exports = {
  extends: ['@budmin/eslint-config/'],
  parserOptions: {
    project: ['./tsconfig.json'],     // ✅ Local to apps/web
    tsconfigRootDir: __dirname,       // ✅ Ensures proper path resolution
  },
  rules: {
    'react/jsx-props-no-spreading': 'off'
  }
};
