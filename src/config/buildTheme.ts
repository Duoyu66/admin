import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import { APP_FONT_FAMILY } from '@/config/fonts';
import {
  radiusScaleToPx,
  THEME_PRESET_MAP,
  type ColorMode,
  type ThemePalette,
} from '@/config/theme-presets';

export function getPalette(presetId: string, mode: ColorMode): ThemePalette {
  const preset = THEME_PRESET_MAP[presetId] ?? THEME_PRESET_MAP.green;
  return mode === 'dark' ? preset.dark : preset.light;
}

export function buildAntdTheme(
  presetId: string,
  mode: ColorMode,
  borderRadiusScale: number
): ThemeConfig {
  const c = getPalette(presetId, mode);
  const r = radiusScaleToPx(borderRadiusScale);

  return {
    cssVar: { key: 'admin' },
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: c.primary,
      colorPrimaryHover: c.primaryHover,
      colorPrimaryActive: c.primaryActive,
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      colorInfo: '#1677FF',
      colorText: c.text,
      colorTextSecondary: c.textSecondary,
      colorTextTertiary: c.textTertiary,
      colorTextBase: c.text,
      colorBgBase: c.bgBase,
      colorBgContainer: c.bgContainer,
      colorBgElevated: c.bgElevated,
      colorBgLayout: c.bgBase,
      colorFillAlter: c.bgHover,
      colorFillSecondary: c.bgHover,
      colorFillTertiary: c.bgSurface,
      colorBorder: c.border,
      colorBorderSecondary: c.borderSecondary,
      borderRadius: r.md,
      borderRadiusLG: r.lg,
      borderRadiusSM: r.sm,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
      boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.08)',
      fontFamily: APP_FONT_FAMILY,
      fontSize: 14,
      controlHeight: 36,
      motion: true,
      motionDurationMid: '0.28s',
      motionDurationSlow: '0.32s',
      motionDurationFast: '0.2s',
    },
    components: {
      Layout: {
        headerBg: c.bgContainer,
        siderBg: c.bgSidebar,
        bodyBg: c.bgBase,
        headerHeight: 56,
      },
      Menu: {
        itemBg: 'transparent',
        itemColor: c.textSecondary,
        itemHoverBg: c.bgHover,
        itemHoverColor: c.text,
        itemSelectedBg: c.primarySoft,
        itemSelectedColor: c.primaryActive,
        subMenuItemBg: 'transparent',
      },
      Card: { colorBgContainer: c.bgContainer, paddingLG: 24 },
      Table: {
        colorBgContainer: c.bgContainer,
        headerBg: c.bgSurface,
        headerColor: c.textSecondary,
        rowHoverBg: c.bgHover,
        borderColor: c.borderSecondary,
        cellPaddingBlock: 10,
        cellPaddingInline: 12,
        cellPaddingBlockMD: 8,
        cellPaddingInlineMD: 10,
        cellPaddingBlockSM: 6,
        cellPaddingInlineSM: 8,
        cellFontSize: 14,
        cellFontSizeMD: 14,
        cellFontSizeSM: 13,
      },
      Button: {
        primaryColor: '#FFFFFF',
        primaryShadow: `0 2px 4px ${c.primarySoft}`,
      },
      Input: {
        activeBorderColor: c.primary,
        hoverBorderColor: c.primaryHover,
        activeShadow: `0 0 0 2px ${c.primarySoft}`,
      },
      Select: {
        optionSelectedBg: c.primarySoft,
        optionActiveBg: c.bgHover,
      },
      Modal: {
        contentBg: c.bgContainer,
        headerBg: c.bgContainer,
        borderRadiusLG: r.lg,
      },
      Pagination: {
        itemActiveBg: c.primary,
        itemActiveColor: '#FFFFFF',
      },
      Tabs: {
        itemSelectedColor: c.primaryActive,
        inkBarColor: c.primary,
      },
      Message: {
        contentBg: 'transparent',
        zIndexPopup: 2010,
      },
      Notification: {
        zIndexPopup: 2010,
      },
      Breadcrumb: {
        lastItemColor: c.text,
        itemColor: c.textSecondary,
        linkColor: c.textSecondary,
        linkHoverColor: c.primary,
        separatorColor: c.textTertiary,
      },
      Drawer: {
        colorBgElevated: c.bgElevated,
      },
      Dropdown: {
        colorBgElevated: c.bgElevated,
      },
      Popover: {
        colorBgElevated: c.bgElevated,
      },
    },
  };
}

export function getMessageGlassStyle(mode: ColorMode, palette: ThemePalette) {
  const glassBg =
    mode === 'dark'
      ? 'color-mix(in srgb, var(--bg-container) 90%, transparent)'
      : 'color-mix(in srgb, var(--bg-container) 88%, transparent)';
  return {
    background: glassBg,
    border: `1px solid color-mix(in srgb, ${palette.border} 55%, transparent)`,
    boxShadow:
      mode === 'dark'
        ? '0 6px 20px rgba(0, 0, 0, 0.28)'
        : '0 6px 20px rgba(31, 46, 36, 0.08)',
  };
}

export function applyCssVariables(palette: ThemePalette, borderRadiusScale: number) {
  const r = radiusScaleToPx(borderRadiusScale);
  const root = document.documentElement;
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-primary-soft', palette.primarySoft);
  root.style.setProperty('--color-primary-hover', palette.primaryHover);
  root.style.setProperty('--color-primary-active', palette.primaryActive);
  root.style.setProperty('--bg-active', palette.primarySoft);
  root.style.setProperty('--bg-base', palette.bgBase);
  root.style.setProperty('--bg-sidebar', palette.bgSidebar);
  root.style.setProperty('--bg-elevated', palette.bgElevated);
  root.style.setProperty('--bg-container', palette.bgContainer);
  root.style.setProperty('--bg-surface', palette.bgSurface);
  root.style.setProperty('--bg-hover', palette.bgHover);
  root.style.setProperty('--text-primary', palette.text);
  root.style.setProperty('--text-secondary', palette.textSecondary);
  root.style.setProperty('--text-muted', palette.textTertiary);
  root.style.setProperty('--border-subtle', palette.borderSecondary);
  root.style.setProperty('--border-default', palette.border);
  root.style.setProperty('--radius-sm', `${r.sm}px`);
  root.style.setProperty('--radius-md', `${r.md}px`);
  root.style.setProperty('--radius-lg', `${r.lg}px`);
  root.style.setProperty('--radius-xl', `${r.xl}px`);
}
