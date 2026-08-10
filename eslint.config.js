import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Architectural boundary rules
      'import/no-cycle': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // Forbid deep imports into domains — use the public index
            '@domains/*/api/*',
            '@domains/*/components/*/*',
            '@domains/*/hooks/*',
            '@domains/*/services/*',
            '@domains/*/store/*',
            '@domains/*/types/*',
            '@domains/*/validation/*',
            '@domains/*/mappers/*',
            // Forbid shared importing from domains or core
            // (enforced by convention — no automated rule needed for intra-shared)
          ],
        },
      ],
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
