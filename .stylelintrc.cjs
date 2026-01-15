module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: [],
  rules: {
    // 基本规则
    'no-empty-source': null,
    'no-invalid-double-slash-comments': null,
    // SCSS规则
    'scss/at-rule-no-unknown': true, // 禁止使用「未知的 SCSS 指令」
    'scss/declaration-nested-properties': null,
    'scss/selector-no-redundant-nesting-selector': true,
    'scss/load-partial-extension': null,
    'scss/dollar-variable-empty-line-before': null,
    'scss/no-global-function-names': null,
  },
  ignoreFiles: ['node_modules/**/*', 'dist/**/*', '*.min.css', '*.min.scss'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.scss', '**/*.sass'],
      customSyntax: 'postcss-scss',
    },
  ],
};
