/**
 * Central design tokens (single source of truth for the palette).
 *
 * These values are mapped to semantic Tailwind / NativeWind color utilities in
 * `tailwind.config.js` (e.g. `bg-background`, `text-foreground`, `bg-primary`,
 * `text-muted`, `border-border`). Re-theme the whole app by editing this file.
 *
 * The defaults are tuned for a clean LIGHT theme so the starter screens render
 * well out of the box. To add light/dark/system switching, follow the spec in
 * `.ai/features/themes-system`.
 */
export const Colors = {
  // Brand & actions
  primary: '#6366f1', // Indigo 500
  primaryLight: '#818cf8', // Indigo 400
  primaryDark: '#4f46e5', // Indigo 600

  // Surfaces
  background: '#ffffff', // Screen background
  surface: '#f1f5f9', // Cards, sheets, inputs (Slate 100)
  surfaceAlt: '#e2e8f0', // Subtle alternate surface (Slate 200)
  border: '#e2e8f0', // Hairlines & dividers (Slate 200)

  // Text & icons
  foreground: '#0f172a', // Primary text (Slate 900)
  muted: '#64748b', // Secondary / muted text (Slate 500)
  icon: '#94a3b8', // Default icon tint (Slate 400)

  // Status
  success: '#22c55e', // Green 500
  error: '#ef4444', // Red 500
  warning: '#f59e0b', // Amber 500
  info: '#3b82f6', // Blue 500

  // Absolutes
  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorName = keyof typeof Colors;
