import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import noSecrets from 'eslint-plugin-no-secrets';
import pluginPromise from 'eslint-plugin-promise';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Recommended configs
  ...nextVitals,
  ...nextTs,
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  sonarjs.configs.recommended,
  unicorn.configs.recommended,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  pluginPromise.configs['flat/recommended'],
  security.configs.recommended,
  prettier,

  // Global ignores — extend eslint-config-next defaults (.next/**, out/**, build/**, next-env.d.ts)
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'coverage/**', 'public/**']),

  // Base language options + plugins + project rules
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: {
          allowDefaultProject: ['*.mjs', '*.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
      'no-secrets': noSecrets,
      import: importPlugin,
    },
    rules: {
      // SonarJS
      'sonarjs/todo-tag': 'warn',
      'sonarjs/unused-import': 'off',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/deprecation': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': 'off',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Security — tolerance 4.5 to avoid false positives on readable
      // camelCase identifiers while still catching real high-entropy secrets.
      'no-secrets/no-secrets': ['error', { tolerance: 4.5 }],

      // Unicorn
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            req: false,
            res: false,
            err: false,
            db: false,
            env: false,
            args: false,
            props: false,
            params: false,
            ref: false,
            refs: false,
            ctx: false,
            prev: false,
            e: false,
          },
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/no-static-only-class': 'off',
      'unicorn/prefer-module': 'off',

      // Import order + hygiene
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'error',
      'import/first': 'error',
      'import/no-anonymous-default-export': 'off',

      // Naming conventions (mirror racional-api)
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'method',
          format: ['camelCase'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'classProperty',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
      ],

      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'explicit',
            constructors: 'explicit',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
    },
  },
]);
