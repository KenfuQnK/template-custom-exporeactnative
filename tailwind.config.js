const { Colors } = require('./src/constants/Colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Semantic color tokens backed by src/constants/Colors.ts.
      // Usage: bg-primary, text-foreground, text-muted, bg-surface, border-border…
      colors: {
        primary: Colors.primary,
        'primary-light': Colors.primaryLight,
        'primary-dark': Colors.primaryDark,
        background: Colors.background,
        surface: Colors.surface,
        'surface-alt': Colors.surfaceAlt,
        border: Colors.border,
        foreground: Colors.foreground,
        muted: Colors.muted,
        icon: Colors.icon,
        success: Colors.success,
        error: Colors.error,
        warning: Colors.warning,
        info: Colors.info,
      },
    },
  },
  plugins: [],
};
