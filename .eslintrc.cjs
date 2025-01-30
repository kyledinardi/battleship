module.exports = {
  env: { browser: true, es2021: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: ['airbnb-base', 'prettier', 'jest'],

  overrides: [
    {
      env: { node: true },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: { sourceType: 'script' },
    },
  ],
};
