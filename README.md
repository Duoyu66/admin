# Admin 后台管理系统 — 前端

React 18 + TypeScript + Less/CSS Modules + Claude 浅色米黄暖调（默认主题）

## 环境

- Node 18+
- pnpm / npm

## 启动

1. 先启动后端（见 `/Users/libingle/Desktop/code/back/README.md`）
2. 安装依赖并启动前端：

```bash
cd /Users/libingle/Desktop/code/admin
pnpm install
pnpm dev
```

访问 http://localhost:5173 ，使用测试账号登录。

## 测试账号

| 用户 | 密码 | 可见菜单 |
|------|------|----------|
| admin | admin123 | 全部 |
| editor | admin123 | 工作台、用户管理、个人中心 |
| guest | admin123 | 工作台、用户管理（只读）、个人中心 |

## 代理

开发环境通过 Vite 将 `/api` 代理到 `http://localhost:8080`。

## 页面

- `/login` 登录
- `/` 工作台
- `/users` 用户管理
- `/roles` 角色管理与权限分配
- `/permissions` 权限树查看
- `/profile` 个人中心
