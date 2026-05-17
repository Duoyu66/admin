import { useLayoutEffect, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { buildAntdTheme, getMessageGlassStyle, getPalette } from '@/config/buildTheme';
import { queryClient } from '@/lib/queryClient';
import { useThemeStore } from '@/stores/themeStore';

function ThemeConfigBridge({ children }: { children: React.ReactNode }) {
  const colorMode = useThemeStore((s) => s.colorMode);
  const preset = useThemeStore((s) => s.preset);
  const borderRadius = useThemeStore((s) => s.borderRadius);
  const applyTheme = useThemeStore((s) => s.applyTheme);

  const palette = useMemo(() => getPalette(preset, colorMode), [preset, colorMode]);

  const antdTheme = useMemo(
    () => buildAntdTheme(preset, colorMode, borderRadius),
    [preset, colorMode, borderRadius]
  );

  const messageStyle = useMemo(
    () => getMessageGlassStyle(colorMode, palette),
    [colorMode, palette]
  );

  useLayoutEffect(() => {
    applyTheme();
  }, [applyTheme, colorMode, preset, borderRadius]);

  return (
    <ConfigProvider theme={antdTheme} locale={zhCN} message={{ style: messageStyle }}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeConfigBridge>{children}</ThemeConfigBridge>
    </QueryClientProvider>
  );
}
