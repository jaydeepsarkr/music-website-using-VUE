module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  indent: 'off', // Disables indentation errors
  'max-len': 'off', // Disables max length rule
  'vue/multi-word-component-names': 'off', // Allows single-word component names
  'no-trailing-spaces': 'off', // Disables trailing spaces rule
   'jsx-a11y/label-has-associated-control': 'off', // Disables label association rule
  'vuejs-accessibility/label-has-for': 'off', // For Vue accessibility rules
  // quotes: 'off',

},
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
