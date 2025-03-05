import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    // Ignore specific files and directories
    ignores: ['**/.eslintrc.js', 'node_modules/', 'dist/', 'build/'],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.jasmine,
        ...globals.mocha,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },

    files: ['**/*.ts', '**/*.tsx', '**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts'],

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

      'import-helpers/order-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      'newline-before-return': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      quotes: ['error', 'single'],

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
  // Specific configuration for test files
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts'],
    rules: {
      // You can add test-specific rules here
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];
