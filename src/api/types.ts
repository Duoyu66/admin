/** 统一响应 */
export interface ApiResult<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}

export interface MenuVO {
  id: number;
  parentId: number;
  permCode: string;
  permName: string;
  permType: number;
  path?: string;
  icon?: string;
  sortOrder?: number;
  children?: MenuVO[];
}

export interface UserInfoVO {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roleName?: string;
}

export interface UserPreferences {
  colorMode: 'light' | 'dark';
  preset: string;
  borderRadius: number;
}

export interface LoginVO {
  token: string;
  user: UserInfoVO;
  roles: string[];
  permissions: string[];
  menus: MenuVO[];
  preferences?: UserPreferences;
}

export interface SysUser extends Record<string, unknown> {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: number;
  createdAt?: string;
  deptId?: number;
  deptName?: string;
  roleIds?: number[];
  roleNames?: string[];
}

export interface SysRole extends Record<string, unknown> {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
  status: number;
  permissionIds?: number[];
}

export interface SysPermission {
  id: number;
  parentId: number;
  permCode: string;
  permName: string;
  permType: number;
  path?: string;
  icon?: string;
  sortOrder?: number;
  status?: number;
  children?: SysPermission[];
}

export interface SysDept {
  id: number;
  parentId: number;
  deptName: string;
  deptCode: string;
  leader?: string;
  phone?: string;
  sortOrder?: number;
  status: number;
  children?: SysDept[];
}
