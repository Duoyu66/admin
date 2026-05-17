import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useThemeStore } from '@/stores/themeStore';
import { HeaderIconButton } from './HeaderIconButton';

/** 明暗模式切换 */
export function ThemeModeToggle() {
  const colorMode = useThemeStore((s) => s.colorMode);
  const toggleColorMode = useThemeStore((s) => s.toggleColorMode);
  const isDark = colorMode === 'dark';

  return (
    <HeaderIconButton
      title={isDark ? '切换为亮色' : '切换为暗色'}
      ariaLabel={isDark ? '亮色模式' : '暗色模式'}
      onClick={toggleColorMode}
    >
      {isDark ? <MoonOutlined /> : <SunOutlined />}
    </HeaderIconButton>
  );
}
