import { FormEvent, useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './auth-switch.module.less';

export interface RegisterPayload {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
}

export interface AuthSwitchProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (payload: RegisterPayload) => Promise<void>;
  error?: string;
  loading?: boolean;
}

/** 双栏切换登录 / 注册（纯 HTML + CSS） */
export function AuthSwitch({ onLogin, onRegister, error, loading }: AuthSwitchProps) {
  const [signUpMode, setSignUpMode] = useState(false);
  const [loginUser, setLoginUser] = useState('admin');
  const [loginPass, setLoginPass] = useState('admin123');
  const [regUser, setRegUser] = useState('');
  const [regNick, setRegNick] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPass2, setRegPass2] = useState('');
  const [localError, setLocalError] = useState('');

  const displayError = localError || error;

  const switchMode = (signup: boolean) => {
    setLocalError('');
    setSignUpMode(signup);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');
    await onLogin(loginUser.trim(), loginPass);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (regPass !== regPass2) {
      setLocalError('两次输入的密码不一致');
      return;
    }
    await onRegister({
      username: regUser.trim(),
      password: regPass,
      nickname: regNick.trim() || undefined,
      email: regEmail.trim() || undefined,
    });
  };

  const mobileTabs = (
    <div className={styles.mobileTabs}>
      <button
        type="button"
        className={styles.mobileTab}
        data-active={!signUpMode}
        onClick={() => switchMode(false)}
      >
        登录
      </button>
      <button
        type="button"
        className={styles.mobileTab}
        data-active={signUpMode}
        onClick={() => switchMode(true)}
      >
        注册
      </button>
    </div>
  );

  return (
    <div
      className={cn(styles.container, signUpMode && styles.containerActive)}
      data-mode={signUpMode ? 'signup' : 'signin'}
    >
      <div className={cn(styles.formContainer, styles.signIn)}>
        {mobileTabs}
        {displayError && !signUpMode && <div className={styles.error}>{displayError}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <h1 className={styles.formTitle}>登录</h1>
          <p className={styles.formSub}>使用账号密码进入木瓜后台</p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-username">
              用户名
            </label>
            <div className={styles.inputWrap}>
              <User size={18} strokeWidth={1.75} aria-hidden />
              <input
                id="login-username"
                className={styles.input}
                type="text"
                autoComplete="username"
                placeholder="请输入用户名"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              密码
            </label>
            <div className={styles.inputWrap}>
              <Lock size={18} strokeWidth={1.75} aria-hidden />
              <input
                id="login-password"
                className={styles.input}
                type="password"
                autoComplete="current-password"
                placeholder="请输入密码"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? '请稍候…' : '登 录'}
          </button>
        </form>

        <p className={styles.hint}>
          演示账号：admin / editor / guest，密码均为 admin123
        </p>
      </div>

      <div className={cn(styles.formContainer, styles.signUp)}>
        {mobileTabs}
        {displayError && signUpMode && <div className={styles.error}>{displayError}</div>}

        <form className={styles.form} onSubmit={handleRegister}>
          <h1 className={styles.formTitle}>注册</h1>
          <p className={styles.formSub}>创建账号后将自动分配游客角色并登录</p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-username">
              用户名
            </label>
            <div className={styles.inputWrap}>
              <User size={18} strokeWidth={1.75} aria-hidden />
              <input
                id="reg-username"
                className={styles.input}
                type="text"
                autoComplete="username"
                placeholder="3-32 个字符"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
                minLength={3}
                maxLength={32}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-nickname">
              昵称（选填）
            </label>
            <div className={styles.inputWrap}>
              <User size={18} strokeWidth={1.75} aria-hidden />
              <input
                id="reg-nickname"
                className={styles.input}
                type="text"
                placeholder="默认同用户名"
                value={regNick}
                onChange={(e) => setRegNick(e.target.value)}
                maxLength={64}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-email">
              邮箱（选填）
            </label>
            <div className={styles.inputWrap}>
              <Mail size={18} strokeWidth={1.75} aria-hidden />
              <input
                id="reg-email"
                className={styles.input}
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                maxLength={128}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-password">
              密码
            </label>
            <div className={styles.inputWrap}>
              <Lock size={18} strokeWidth={1.75} aria-hidden />
              <input
                id="reg-password"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                placeholder="至少 6 位"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                minLength={6}
                maxLength={32}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-password2">
              确认密码
            </label>
            <div className={styles.inputWrap}>
              <Lock size={18} strokeWidth={1.75} aria-hidden />
              <input
                id="reg-password2"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                placeholder="再次输入密码"
                value={regPass2}
                onChange={(e) => setRegPass2(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          <span className={styles.roleTag}>默认角色：游客（GUEST）</span>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? '请稍候…' : '注册并登录'}
          </button>
        </form>
      </div>

      <div className={styles.overlayWrap}>
        <div className={styles.overlay}>
          <div className={styles.overlayPanel}>
            <span className={styles.overlayLogo}>木</span>
            <h2 className={styles.overlayTitle}>欢迎回来</h2>
            <p className={styles.overlayText}>已有账号？登录后进入木瓜后台管理系统。</p>
            <button type="button" className={styles.ghostBtn} onClick={() => switchMode(false)}>
              去登录
            </button>
          </div>
          <div className={styles.overlayPanel}>
            <span className={styles.overlayLogo}>木</span>
            <h2 className={styles.overlayTitle}>创建账号</h2>
            <p className={styles.overlayText}>
              注册即获得游客权限，可访问工作台与个人中心等基础功能。
            </p>
            <button type="button" className={styles.ghostBtn} onClick={() => switchMode(true)}>
              去注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthSwitch;
