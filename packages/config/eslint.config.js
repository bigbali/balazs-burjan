import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import globals from 'globals';

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
    js.configs.recommended,
    { // general
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.mjs', '**/*.cjs'],
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.browser
            }
        },
        rules: {
            'linebreak-style': ['error', 'unix'],
            'max-len': ['warn', 135],
            'object-curly-spacing': ['warn', 'always'],
            'quotes': ['warn', 'single'],
            'jsx-quotes': ['warn', 'prefer-single'],
            'no-trailing-spaces': 'warn',
            'semi': 'error',
            'no-extra-semi': 'warn',
            'no-unused-vars': 'warn',
            'comma-dangle': [
                'warn',
                {
                    'arrays': 'never',
                    'objects': 'never',
                    'imports': 'never',
                    'exports': 'never',
                    'functions': 'never'
                }
            ],
            'indent': [
                'error',
                4,
                {
                    'SwitchCase': 1
                }
            ],
            'no-redeclare': [
                'error',
                {
                    'builtinGlobals': false
                }
            ],
            'import/no-anonymous-default-export': 'off'
        }
    },
    { // TypeScript
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.browser
            }
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': 'warn',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-extra-semi': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/semi': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    'selector': 'enumMember',
                    'format': ['UPPER_CASE'],
                    'custom': {
                        'regex': '[A-Z]',
                        'match': true
                    }
                },
                {
                    'selector': 'interface',
                    'format': ['PascalCase'],
                    'custom': {
                        'regex': '^I?[A-Z]',
                        'match': true
                    }
                }
            ]

        }
    },
    {
        files: ['**/*.tsx'],
        languageOptions: {
            globals: {
                'React': true
            }
        }
    }
];
