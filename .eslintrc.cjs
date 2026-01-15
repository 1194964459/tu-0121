module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier' // 覆盖所有ESLint规则和Prettier的冲突
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn', // 生产环境禁止debugger
    // 控制Vue组件属性的换行规则
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 5 // 单行最多允许5个属性（超过则自动换行）
        },
        multiline: {
          max: 1 // 多行时，每个属性单独占一行
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-content-newline': 'off'
    // 'vue/singleline-html-element-content-newline': 'off'
  }
};
