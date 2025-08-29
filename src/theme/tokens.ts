export type Tokens = {
  // meta
  __version: number;
  // base colors
  bg: string;
  surface: string;
  card: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  // optional scales (future)
  spacing?: Record<'xs' | 'sm' | 'md' | 'lg', number>;
  radius?: Record<'sm' | 'md' | 'lg', number>;
};

export const THEME_VERSION = 1;

export const darkTokens: Tokens = {
  __version: THEME_VERSION,
  bg: '#0E1116',
  surface: '#151923',
  card: '#1C2230',
  textPrimary: '#E8EEF8',
  textMuted: '#A9B3C2',
  accent: '#6CCAFF',
  success: '#4CC38A',
  warning: '#E7B549',
  danger: '#E5484D',
};

export const lightTokens: Tokens = {
  __version: THEME_VERSION,
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  card: '#F1F3F8',
  textPrimary: '#0F172A',
  textMuted: '#475569',
  accent: '#2563EB',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
};
