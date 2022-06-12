module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 0
  }
}
