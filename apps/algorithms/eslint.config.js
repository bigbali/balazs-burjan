import config from 'config/eslint.config.js';

import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

import { fixupPluginRules } from '@eslint/compat';

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            react: fixupPluginRules(reactPlugin),
            'react-hooks': fixupPluginRules(hooksPlugin),
            '@next/next': fixupPluginRules(nextPlugin)
        },
        rules: {
            ...reactPlugin.configs['jsx-runtime'].rules,
            ...hooksPlugin.configs.recommended.rules,
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
            '@next/next/no-img-element': 'error'
        }
    },
    ...config
];
