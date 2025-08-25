module.exports = {
  extends: ['@budmin/eslint-config/base'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    'no-console': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    'import/extensions': 'off',
    "@typescript-eslint/no-explicit-any": "warn",
    'no-console': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  }
};
