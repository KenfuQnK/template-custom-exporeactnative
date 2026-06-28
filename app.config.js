const baseConfig = require('./app.json').expo;

const APP_VARIANT = process.env.APP_VARIANT ?? process.env.EAS_BUILD_PROFILE ?? 'production';

// Cada variante solo añade un sufijo a lo que ya hay en app.json — así
// dev/preview/producción conviven instaladas en el mismo dispositivo sin
// mantener 3 nombres/ids por separado.
const VARIANT_SUFFIX = {
  development: { name: ' (Dev)', id: '.dev', scheme: '-dev' },
  preview: { name: ' (Preview)', id: '.preview', scheme: '-preview' },
  production: { name: '', id: '', scheme: '' },
};

module.exports = ({ config }) => {
  const suffix = VARIANT_SUFFIX[APP_VARIANT] ?? VARIANT_SUFFIX.production;

  return {
    ...config,
    name: `${baseConfig.name}${suffix.name}`,
    scheme: `${baseConfig.scheme}${suffix.scheme}`,
    ios: {
      ...config.ios,
      bundleIdentifier: `${baseConfig.ios.bundleIdentifier}${suffix.id}`,
    },
    android: {
      ...config.android,
      package: `${baseConfig.android.package}${suffix.id}`,
    },
    extra: {
      ...config.extra,
      APP_VARIANT,
    },
  };
};
