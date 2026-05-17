import type { ApiResult } from './types';

const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const isAuthPublic =
    url.includes('/api/auth/login') || url.includes('/api/auth/register');
  const token = getToken();
  if (token && !isAuthPublic) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const json = (await res.json()) as ApiResult<T>;

  if (json.code === 401) {
    clearToken();
    // 登录接口的 401 由页面展示错误，避免整页刷新导致“点了没反应”
    if (!isAuthPublic) {
      window.location.href = '/login';
    }
    throw new ApiError(401, json.msg);
  }

  if (json.code !== 200) {
    throw new ApiError(json.code, json.msg || '请求失败');
  }

  return json.data;
}
