import { App, Button, Drawer, Space, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import {
  BORDER_RADIUS_OPTIONS,
  THEME_PRESETS,
} from '@/config/theme-presets';
import { updatePreferences } from '@/api/auth';
import { useThemeStore } from '@/stores/themeStore';
import styles from './ThemeSettingsDrawer.module.less';

interface ThemeSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** 主题设置抽屉 — 内置主题色、圆角、保存为默认 */
export function ThemeSettingsDrawer({ open, onClose }: ThemeSettingsDrawerProps) {
  const { message } = App.useApp();
  const preset = useThemeStore((s) => s.preset);
  const borderRadius = useThemeStore((s) => s.borderRadius);
  const setPreset = useThemeStore((s) => s.setPreset);
  const setBorderRadius = useThemeStore((s) => s.setBorderRadius);
  const getSnapshot = useThemeStore((s) => s.getSnapshot);

  const saveAsDefault = async () => {
    try {
      await updatePreferences(getSnapshot());
      message.success('已保存为默认主题');
      onClose();
    } catch (e) {
      message.error(e instanceof Error ? e.message : '保存失败');
    }
  };

  return (
    <Drawer
      title="主题设置"
      placement="right"
      width={360}
      open={open}
      onClose={onClose}
      destroyOnHidden
      extra={
        <Button type="primary" size="small" onClick={saveAsDefault}>
          设为默认
        </Button>
      }
    >
      <Typography.Title level={5} className={styles.sectionTitle}>
        内置主题
      </Typography.Title>
      <div className={styles.presetGrid}>
        {THEME_PRESETS.map((item) => {
          const active = preset === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.presetCard} ${active ? styles.presetCardActive : ''}`}
              onClick={() => setPreset(item.id)}
            >
              <span className={styles.swatch} style={{ background: item.swatch }} />
              <span className={styles.presetName}>{item.name}</span>
              {active && <CheckOutlined className={styles.check} />}
            </button>
          );
        })}
      </div>

      <Typography.Title level={5} className={styles.sectionTitle}>
        圆角
      </Typography.Title>
      <Space wrap className={styles.radiusRow}>
        {BORDER_RADIUS_OPTIONS.map((opt) => (
          <Button
            key={opt.label}
            type={borderRadius === opt.value ? 'primary' : 'default'}
            onClick={() => setBorderRadius(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </Space>

      <Typography.Paragraph type="secondary" className={styles.hint}>
        点击「设为默认」后，当前主题色、明暗模式与圆角会保存到账号，下次登录自动应用。
      </Typography.Paragraph>
    </Drawer>
  );
}
