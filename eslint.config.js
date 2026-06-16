const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // Node-only tooling and generated/native folders are not app code.
    ignores: ['dist/*', '.expo/**', 'android/**', 'ios/**', 'scripts/**'],
  },
  {
    rules: {
      'react/display-name': 'off',
      // Enforce the Rules of Hooks across the template.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
