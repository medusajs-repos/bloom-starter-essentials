import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts', '.netlify', '.nitro', '.vercel', 'static-routes.json', 'scripts/', 'dist', '.output'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Enforce alias imports instead of relative imports
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', './*'],
              message: 'Use alias imports (@/) instead of relative imports. Example: import { something } from "@/lib/utils" instead of import { something } from "../lib/utils"',
            },
          ],
        },
      ],
      // Additional TypeScript and React rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // React specific rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      // Enforce double quotes or template literals
      'quotes': ['error', 'double', { avoidEscape: true, allowTemplateLiterals: true }],
      // Disallow semicolons
      'semi': ['error', 'never'],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
);
