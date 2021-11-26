module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', '@vue/prettier', 'plugin:vue-i18n/recommended'],
  rules: {
    'vue/valid-template-root': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/require-default-prop': 'off',
    'no-console': 'error',
    'no-debugger': 'error',
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/locales/*.json', // extention is glob formatting!
    },
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  plugins: ['simple-import-sort'],
};
