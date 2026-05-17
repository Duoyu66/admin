/** 主题色预设 — 与顶栏「内置主题」选择器对应 */

export type ColorMode = 'light' | 'dark';

export interface ThemePalette {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primarySoft: string;
  bgBase: string;
  bgContainer: string;
  bgElevated: string;
  bgSurface: string;
  bgHover: string;
  bgSidebar: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderSecondary: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  swatch: string;
  light: ThemePalette;
  dark: ThemePalette;
}

function soft(primary: string, alpha = 0.14) {
  const hex = primary.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function preset(
  id: string,
  name: string,
  swatch: string,
  primary: string,
  hover: string,
  active: string,
  lightBase: string,
  darkBase: string
): ThemePreset {
  return {
    id,
    name,
    swatch,
    light: {
      primary,
      primaryHover: hover,
      primaryActive: active,
      primarySoft: soft(primary),
      bgBase: lightBase,
      bgContainer: '#FFFFFF',
      bgElevated: '#FFFFFF',
      bgSurface: '#FAFCFB',
      bgHover: soft(primary, 0.08),
      bgSidebar: '#FFFFFF',
      text: '#1F2E24',
      textSecondary: '#5C6B62',
      textTertiary: '#8A9A90',
      border: '#DCE8DF',
      borderSecondary: '#E8F0EA',
    },
    dark: {
      primary: hover,
      primaryHover: hover,
      primaryActive: active,
      primarySoft: soft(primary, 0.22),
      bgBase: darkBase,
      bgContainer: '#1A211C',
      bgElevated: '#222B25',
      bgSurface: '#1E2621',
      bgHover: soft(primary, 0.12),
      bgSidebar: '#1A211C',
      text: '#E8F0EA',
      textSecondary: '#A8B5AD',
      textTertiary: '#7A8A80',
      border: '#2D3832',
      borderSecondary: '#252E29',
    },
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  preset('blue', '默认', '#1677FF', '#1677FF', '#4096FF', '#0958D9', '#F0F5FF', '#0D1117'),
  preset('violet', '紫罗兰', '#7C3AED', '#7C3AED', '#8B5CF6', '#6D28D9', '#F5F3FF', '#13111C'),
  preset('pink', '樱花粉', '#EC4899', '#EC4899', '#F472B6', '#DB2777', '#FDF2F8', '#1A0F14'),
  preset('yellow', '柠檬黄', '#EAB308', '#CA8A04', '#EAB308', '#A16207', '#FEFCE8', '#1A1708'),
  preset('sky', '天蓝色', '#0EA5E9', '#0EA5E9', '#38BDF8', '#0284C7', '#F0F9FF', '#0C1220'),
  preset('green', '浅绿色', '#6BC77A', '#6BC77A', '#85D492', '#52B366', '#F4F7F5', '#121A14'),
  preset('zinc', '锌色灰', '#71717A', '#71717A', '#A1A1AA', '#52525B', '#F4F4F5', '#18181B'),
  preset('teal', '深绿色', '#0D9488', '#0D9488', '#14B8A6', '#0F766E', '#F0FDFA', '#0F1715'),
  preset('navy', '深蓝色', '#1E3A8A', '#2563EB', '#3B82F6', '#1D4ED8', '#EFF6FF', '#0B1220'),
  preset('orange', '橙黄色', '#EA580C', '#F97316', '#FB923C', '#C2410C', '#FFF7ED', '#1A120C'),
  preset('rose', '玫瑰红', '#E11D48', '#F43F5E', '#FB7185', '#BE123C', '#FFF1F2', '#1A0A0E'),
  preset('neutral', '中性色', '#525252', '#525252', '#737373', '#404040', '#FAFAFA', '#171717'),
  preset('slate', '石板灰', '#475569', '#64748B', '#94A3B8', '#334155', '#F8FAFC', '#0F172A'),
  preset('gray', '中灰色', '#6B7280', '#6B7280', '#9CA3AF', '#4B5563', '#F3F4F6', '#111827'),
];

export const THEME_PRESET_MAP = Object.fromEntries(THEME_PRESETS.map((p) => [p.id, p])) as Record<
  string,
  ThemePreset
>;

export const BORDER_RADIUS_OPTIONS = [
  { value: 0, label: '0' },
  { value: 0.25, label: '0.25' },
  { value: 0.5, label: '0.5' },
  { value: 0.75, label: '0.75' },
  { value: 1, label: '1' },
] as const;

const BASE_RADIUS = 8;

export function radiusScaleToPx(scale: number): {
  sm: number;
  md: number;
  lg: number;
  xl: number;
} {
  const base = Math.round(BASE_RADIUS * scale);
  return {
    sm: Math.max(0, Math.round(base * 0.5)),
    md: Math.max(0, base),
    lg: Math.max(0, Math.round(base * 1.25)),
    xl: Math.max(0, Math.round(base * 1.5)),
  };
}
