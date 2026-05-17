import { useState } from 'react';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LockOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useThemeStore } from '@/stores/themeStore';
import { HeaderIconButton } from './HeaderIconButton';
import { ThemeModeToggle } from './ThemeModeToggle';
import { ThemeSettingsDrawer } from './ThemeSettingsDrawer';

/** 顶栏工具：明暗、全屏、锁屏、主题设置 */
export function HeaderToolbar() {
  const { fullscreen, toggle: toggleFullscreen } = useFullscreen();
  const setLocked = useThemeStore((s) => s.setLocked);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <ThemeModeToggle />

      <HeaderIconButton
        title={fullscreen ? '退出全屏' : '全屏'}
        ariaLabel={fullscreen ? '退出全屏' : '全屏'}
        onClick={() => void toggleFullscreen()}
      >
        {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </HeaderIconButton>

      <HeaderIconButton title="锁屏" ariaLabel="锁屏" onClick={() => setLocked(true)}>
        <LockOutlined />
      </HeaderIconButton>

      <HeaderIconButton
        title="主题设置"
        ariaLabel="主题设置"
        onClick={() => setSettingsOpen(true)}
      >
        <SettingOutlined />
      </HeaderIconButton>

      <ThemeSettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
