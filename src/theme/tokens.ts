export type Tokens = {
  bg: string; surface: string; card: string;
  textPrimary: string; textMuted: string;
  accent: string; success: string; warning: string; danger: string;
};
export const lightTokens: Tokens = {
  bg: '#0E1116',       // main background (currently white by default RN)
  surface: '#151923',  // app bar / section bg
  card: '#1C2230',     // card background
  textPrimary: '#E8EEF8',
  textMuted: '#A9B3C2',
  accent: '#6CCAFF',
  success: '#4CC38A',
  warning: '#E7B549',
  danger: '#E5484D'
};