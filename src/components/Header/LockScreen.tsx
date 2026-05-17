import { useState } from 'react';
import { App, Button, Input, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { verifyPassword } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/stores/themeStore';
import styles from './LockScreen.module.less';

/** 锁屏遮罩 — 输入登录密码解锁 */
export function LockScreen() {
  const { message } = App.useApp();
  const locked = useThemeStore((s) => s.locked);
  const setLocked = useThemeStore((s) => s.setLocked);
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!locked) return null;

  const unlock = async () => {
    if (!password.trim()) {
      message.warning('请输入密码');
      return;
    }
    setLoading(true);
    try {
      await verifyPassword(password);
      setPassword('');
      setLocked(false);
      message.success('已解锁');
    } catch (e) {
      message.error(e instanceof Error ? e.message : '密码错误');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.avatar}>{user?.avatar ?? user?.nickname?.charAt(0) ?? 'A'}</div>
        <Typography.Title level={4} className={styles.name}>
          {user?.nickname ?? '用户'}
        </Typography.Title>
        <div className={styles.clock}>{time}</div>
        <Typography.Text type="secondary" className={styles.date}>
          {date}
        </Typography.Text>
        <Input.Password
          size="large"
          prefix={<LockOutlined />}
          placeholder="输入登录密码解锁"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={unlock}
          className={styles.input}
        />
        <Button type="primary" size="large" block loading={loading} onClick={unlock}>
          解锁
        </Button>
      </div>
    </div>
  );
}
