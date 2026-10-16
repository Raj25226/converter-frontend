import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    {
        files: ['src/**/*.{jsx,tsx}'],
        extends: [
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            reactHooks.configs.flat.recommended,
            jsxA11y.flatConfigs.recommended,
        ],
        settings: { react: { version: 'detect' } },
        rules: {
            'react/prop-types': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/refs': 'off',
        },
    },
]);
