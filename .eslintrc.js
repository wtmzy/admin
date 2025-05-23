module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'vue-global-api',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    'plugin:prettier/recommended',
    '@vue/eslint-config-prettier',
    '@element-plus/eslint-config',
    'plugin:unicorn/recommended',
  ],
  globals: {
    defineOptions: 'writable',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'array-callback-return': 'off',
    'escape-case': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'import/order': 'off',
    'no-alert': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-restricted-imports': 'off',
    'no-return-await': 'off',
    'prefer-const': 'off',
    'prefer-template': 'error',
    'prettier/prettier': 'error',

    'unicorn/consistent-function-scoping': 'off',
    'unicorn/escape-case': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/import-style': 'off',
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-object-as-default-parameter': 'off',
    'unicorn/no-process-exit': 'off',
    'unicorn/no-this-assignment': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-array-some': 'off',
    'unicorn/prefer-default-parameters': 'off',
    'unicorn/prefer-dom-node-append': 'off',
    'unicorn/prefer-dom-node-remove': 'off',
    'unicorn/prefer-logical-operator-over-ternary': 'off',
    'unicorn/prefer-math-trunc': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-number-properties': 'off',
    'unicorn/prefer-query-selector': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prefer-string-slice': 'off',
    'unicorn/prefer-structured-clone': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': 'off',

    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    camelcase: 'off',
    'vue/attributes-order': [
      'warn',
      {
        alphabetical: true,
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'any',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        autofix: true,
      },
    ],
  },
}
