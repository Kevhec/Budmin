module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'turbo'],
  env: { node: true, es2020: true },
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'turbo/no-undeclared-env-vars': 'warn',
  },
  settings: {
    'import/resolver': { typescript: { alwaysTryTypes: true } }
  }
};