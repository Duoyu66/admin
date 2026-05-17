import { request } from './request';
import type { LoginVO, UserPreferences } from './types';

export function login(username: string, password: string) {
  return request<LoginVO>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export interface RegisterParams {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
}

/** 注册并自动登录，默认分配游客角色 */
export function register(params: RegisterParams) {
  return request<LoginVO>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function fetchUserInfo() {
  return request<LoginVO>('/api/auth/info');
}

export function updateProfile(data: { nickname: string; email?: string; phone?: string }) {
  return request<void>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function updatePassword(data: { oldPassword?: string; newPassword: string }) {
  return request<void>('/api/auth/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function logout() {
  return request<void>('/api/auth/logout', { method: 'POST' });
}

export function fetchPreferences() {
  return request<UserPreferences>('/api/auth/preferences');
}

export function updatePreferences(data: UserPreferences) {
  return request<UserPreferences>('/api/auth/preferences', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function verifyPassword(password: string) {
  return request<void>('/api/auth/verify-password', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}
