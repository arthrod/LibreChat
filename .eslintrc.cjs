'use strict';

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'prettier',
    'plugin:jsx-a11y/recommended',
  ],
  ignorePatterns: [
    'client/dist/**/*',
    'client/public/**/*',
    'e2e/playwright-report/**/*',
    'packages/data-provider/types/**/*',
    'packages/data-provider/dist/**/*',
    'packages/data-provider/test_bundle/**/*',
    'data-node/**/*',
    'meili_data/**/*',
    'node_modules/**/*',
    'client/vite.config.ts',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'jsx-a11y'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': true }],
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'linebreak-style': 0,
    curly: ['error', 'all'],
    semi: ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': 'off',
    'import/no-cycle': 'off', // Temporarily disable these rules
    'import/no-self-import': 'off', // Temporarily disable these rules
    'import/extensions': 'off',
    'no-promise-executor-return': 'off',
    'no-param-reassign': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'react/prop-types': ['off'],
    'react/display-name': ['off'],
    'no-nested-ternary': 'error',
    'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
    quotes: ['error', 'single'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-unused-vars': 'off',
        'react/display-name': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
      },
    },
    {
      files: ['rollup.config.js', '.eslintrc.cjs', 'jest.config.js'],
      env: {
        node: true,
      },
    },
    {
      files: [
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.js',
        '**/*.spec.jsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'setupTests.js',
      ],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react/no-unescaped-entities': 'off',
      },
    },
    {
      files: ['client/src/**/*.ts', 'client/src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './client/tsconfig.json',
      },
      plugins: ['@typescript-eslint/eslint-plugin', 'jest'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/strict-boolean-expressions': 'warn',
      },
    },
    {
      files: './packages/data-provider/**/*.ts',
      overrides: [
        {
          files: '**/*.ts',
          parser: '@typescript-eslint/parser',
          parserOptions: {
            project: './packages/data-provider/tsconfig.json',
          },
        },
      ],
    },
    {
      files: './config/translations/**/*.ts',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './config/translations/tsconfig.json',
      },
    },
    {
      files: ['./packages/data-provider/specs/**/*.ts'],
      parserOptions: {
        project: './packages/data-provider/tsconfig.spec.json',
      },
    },
  ],
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      fragment: 'Fragment',
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
