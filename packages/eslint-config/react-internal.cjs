module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', 'react-refresh', 'jsx-a11y'],
  env: { browser: true, node: true, es2020: true },
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    ...require('eslint-plugin-react-hooks').configs.recommended.rules,
    'react/function-component-definition': [2, {
      namedComponents: 'function-declaration',
      unnamedComponents: 'function-expression', // or 'arrow-function' if you want unnamed ones that way
    }],
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.config.{js,ts}',
        '**/vite.config.{js,ts}',
        '**/vitest.config.{js,ts}'
      ]
    }],
    'import/extensions': 'off',
    'react/jsx-props-no-spreading': 'off'
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': { typescript: { alwaysTryTypes: true } }
  }
};