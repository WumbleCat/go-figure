export const colors = {
  ink: '#1F1C17',
  paper: '#F6F3EC',
  paperMuted: '#ECE7DB',
  rule: '#D8D2C4',
  gold: '#B8923E',
  goldDeep: '#8A6C25',
  inkMuted: '#6B6557',
} as const;

export const fonts = {
  serif: 'CormorantGaramond_500Medium',
  serifBold: 'CormorantGaramond_600SemiBold',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const motion = {
  fastMs: 220,
  baseMs: 360,
  slowMs: 640,
} as const;
