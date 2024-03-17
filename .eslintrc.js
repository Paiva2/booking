module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: [
    'node_modules/',
    '**/node_modules/',
    '/**/node_modules/*',
    'out/',
    'dist/',
    'build/',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'no-restricted-syntax': 'off',
    "max-classes-per-file": "off",
    'import/export': 'off',
    'import/prefer-default-export': 'off',
    'no-promise-executor-return': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-console': 'off',
    'consistent-return': 'off',
    'import/no-cycle': 'off'
  },
};
