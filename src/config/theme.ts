import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import { APP_FONT_FAMILY } from '@/config/fonts';

/** 浅色绿主题配色（与 styles/variables.less 对齐） */
export const appColors = {
  primary: '#6BC77A',
  primaryHover: '#85D492',
  primaryActive: '#52B366',
  primarySoft: 'rgba(107, 199, 122, 0.14)',
  bgBase: '#F4F7F5',
  bgContainer: '#FFFFFF',
  bgElevated: '#FFFFFF',
  bgSurface: '#FAFCFB',
  bgHover: '#EDF5EF',
  bgSidebar: '#FFFFFF',
  text: '#1F2E24',
  textSecondary: '#5C6B62',
  textTertiary: '#8A9A90',
  textOnPrimary: '#FFFFFF',
  border: '#DCE8DF',
  borderSecondary: '#E8F0EA',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1677FF',
  overlay: 'rgba(0, 0, 0, 0.45)',
} as const;

/** Message 轻提示 — 半透明毛玻璃（低不透明度 + backdrop-filter 才能透出背后内容） */
export const messageGlassStyle = {
  background: 'rgba(255, 255, 255, 0.38)',
  backdropFilter: 'blur(20px) saturate(1.25)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.25)',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow: '0 8px 32px rgba(31, 46, 36, 0.1)',
} as const;

/** Ant Design 全局主题 — 浅色 + 浅绿主色 */
export const appTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: appColors.primary,
    colorPrimaryHover: appColors.primaryHover,
    colorPrimaryActive: appColors.primaryActive,
    colorSuccess: appColors.success,
    colorWarning: appColors.warning,
    colorError: appColors.error,
    colorInfo: appColors.info,

    colorText: appColors.text,
    colorTextSecondary: appColors.textSecondary,
    colorTextTertiary: appColors.textTertiary,
    colorTextBase: appColors.text,

    colorBgBase: appColors.bgBase,
    colorBgContainer: appColors.bgContainer,
    colorBgElevated: appColors.bgElevated,
    colorBgLayout: appColors.bgBase,
    colorFillAlter: appColors.bgHover,
    colorFillSecondary: appColors.bgHover,
    colorFillTertiary: appColors.bgSurface,

    colorBorder: appColors.border,
    colorBorderSecondary: appColors.borderSecondary,

    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.08)',

    fontFamily: APP_FONT_FAMILY,
    fontSize: 14,
    fontSizeLG: 15,
    fontSizeSM: 12,

    controlHeight: 36,
    lineHeight: 1.5715,
    motionDurationMid: '0.2s',

    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingLG: 20,
  },
  components: {
    Layout: {
      headerBg: appColors.bgContainer,
      siderBg: appColors.bgSidebar,
      bodyBg: appColors.bgBase,
      headerHeight: 56,
      triggerHeight: 56,
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: appColors.textSecondary,
      itemHoverBg: appColors.bgHover,
      itemHoverColor: appColors.text,
      itemSelectedBg: appColors.primarySoft,
      itemSelectedColor: appColors.primaryActive,
      subMenuItemBg: 'transparent',
      iconSize: 18,
      collapsedIconSize: 18,
    },
    Button: {
      primaryColor: appColors.textOnPrimary,
      primaryShadow: '0 2px 4px rgba(107, 199, 122, 0.25)',
    },
    Card: {
      colorBgContainer: appColors.bgContainer,
      paddingLG: 24,
    },
    Table: {
      colorBgContainer: appColors.bgContainer,
      headerBg: appColors.bgSurface,
      headerColor: appColors.textSecondary,
      rowHoverBg: appColors.bgHover,
      borderColor: appColors.borderSecondary,
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
    Input: {
      activeBorderColor: appColors.primary,
      hoverBorderColor: appColors.primaryHover,
      activeShadow: `0 0 0 2px ${appColors.primarySoft}`,
    },
    Select: {
      optionSelectedBg: appColors.primarySoft,
      optionActiveBg: appColors.bgHover,
    },
    Modal: {
      contentBg: appColors.bgContainer,
      headerBg: appColors.bgContainer,
      borderRadiusLG: 8,
    },
    Pagination: {
      itemActiveBg: appColors.primary,
      itemActiveColor: appColors.textOnPrimary,
    },
    Tabs: {
      itemSelectedColor: appColors.primaryActive,
      inkBarColor: appColors.primary,
    },
    Breadcrumb: {
      linkHoverColor: appColors.primary,
    },
    Tree: {
      nodeSelectedBg: appColors.primarySoft,
      nodeHoverBg: appColors.bgHover,
    },
    Checkbox: {
      colorPrimary: appColors.primary,
      colorPrimaryHover: appColors.primaryHover,
    },
    Switch: {
      colorPrimary: appColors.primary,
      colorPrimaryHover: appColors.primaryHover,
    },
    Spin: {
      colorPrimary: appColors.primary,
    },
    Message: {
      contentBg: 'transparent',
    },
  },
};
