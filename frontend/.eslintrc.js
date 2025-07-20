module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'css/at-rule-no-unknown': 'off',
    'css.lint.unknownAtRules': 0,
    'react/no-unescaped-entities': 'off'
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')]
    }
  }
}
