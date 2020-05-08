module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent' : 'off',
    'vue/no-unused-components' : 'off',
    'no-trailing-spaces' : 'off',
    'space-before-function-paren': 'off',
    'eol-last' : 'off',
    'no-unused-vars' : 'off',
    'comma-spacing' : 'off',
    'no-undef' : 'off',
    'spaced-comment' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
