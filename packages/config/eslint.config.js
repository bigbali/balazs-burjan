import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
    js.configs.recommended,
    {
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/max-len': ['warn', 135],
            '@stylistic/object-curly-spacing': ['warn', 'always'],
            '@stylistic/quotes': ['warn', 'single'],
            '@stylistic/jsx-quotes': ['warn', 'prefer-single'],
            '@stylistic/no-trailing-spaces': 'warn',
            '@stylistic/semi': 'error',
            '@stylistic/no-extra-semi': 'warn',
            '@stylistic/comma-dangle': [
                'warn',
                {
                    arrays: 'never',
                    objects: 'never',
                    imports: 'never',
                    exports: 'never',
                    functions: 'never'
                }
            ],
            '@stylistic/indent': [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ]
        }
    },
    {
        // general
        files: [
            '**/*.ts',
            '**/*.tsx',
            '**/*.js',
            '**/*.jsx',
            '**/*.mjs',
            '**/*.cjs'
        ],
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.browser,
                ...globals.node,
                React: true,
                NodeJS: true
            }
        },
        rules: {
            'import/no-anonymous-default-export': 'off',
            'no-unused-vars': 'warn',
            'no-redeclare': [
                // 'error',
                // {
                //     builtinGlobals: false
                // },
                'warn',
                {
                    builtinGlobals: true
                }
            ]
        }
    },
    {
        // TypeScript
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: 'tsconfig.json'
            },
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': 'warn',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-extra-semi': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-function': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'enumMember',
                    format: ['UPPER_CASE'],
                    custom: {
                        regex: '[A-Z]',
                        match: true
                    }
                },
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    custom: {
                        regex: '^I?[A-Z]',
                        match: true
                    }
                }
            ]
        }
    }
];
