
module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/recommended',
      'plugin:prettier/recommended',
      'prettier',
      'prettier/vue'
    ],
    // required to lint *.vue files
    plugins: ['prettier', 'vue'],
    // add your custom rules here
    rules: {
    //   'no-console' : 0,
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'vue/no-v-html': 'off'
    }
  };