const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // Node-only tooling and generated/native folders are not app code.
    // REFERENCIA/ is gitignored sample code kept for inspiration, not part of the app.
    ignores: ['dist/*', '.expo/**', 'android/**', 'ios/**', 'scripts/**', 'REFERENCIA/**'],
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: [
            '.native.ts',
            '.native.tsx',
            '.web.ts',
            '.web.tsx',
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
          ],
        },
      },
    },
    rules: {
      'react/display-name': 'off',
      // Enforce the Rules of Hooks across the template.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
