import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthSwitch, type RegisterPayload } from '@/components/ui/auth-switch';
import { useAuth } from '@/hooks/useAuth';
import styles from './Login.module.less';

/** 登录页 — Auth Switch 双栏布局 */
export function Login() {
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (username: string, password: string) => {
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (payload: RegisterPayload) => {
    setError('');
    setSubmitting(true);
    try {
      await register(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden />
      <div className={styles.inner}>
        <AuthSwitch
          onLogin={handleLogin}
          onRegister={handleRegister}
          error={error}
          loading={submitting}
        />
      </div>
    </div>
  );
}
