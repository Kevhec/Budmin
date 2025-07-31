module.exports = {
  extends: ['@budmin/eslint-config/react'],
  parserOptions: {
    project: ['./tsconfig.app.json'],     // ✅ Local to apps/web
    tsconfigRootDir: __dirname,       // ✅ Ensures proper path resolution
  },
  rules: {
    "react/jsx-no-useless-fragment": "off"
  }
};
