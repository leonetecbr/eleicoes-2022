import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import tailwind from 'eslint-plugin-tailwindcss';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import {defineConfig, globalIgnores} from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
    globalIgnores(['dist', 'build', 'node_modules']),
    js.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        plugins: {
            'tailwindcss': tailwind,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'react-compiler': reactCompiler,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ecmaFeatures: {jsx: true},
                sourceType: 'module',
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react/prop-types': 'off',
            'no-unreachable': 'error',
            'no-unexpected-multiline': 'error',
            'react-compiler/react-compiler': 'error',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/incompatible-library': 'off',
            'react/jsx-curly-spacing': [2, { 'when': 'always', 'children': true }],
            'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
            'no-unused-vars': ['error', {
                varsIgnorePattern: '^[A-Z_]',
                argsIgnorePattern: '^_',
            }],
            ...tailwind.configs.recommended.rules,
        },
    },
    eslintConfigPrettier,
]);