export const queryKeys = {
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  auth: {
    all: ['auth'] as const,
    info: ['auth', 'info'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (page: number, keyword: string) =>
      [...queryKeys.users.lists(), { page, keyword }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  roles: {
    all: ['roles'] as const,
    lists: () => [...queryKeys.roles.all, 'list'] as const,
    list: (page: number, keyword: string) =>
      [...queryKeys.roles.lists(), { page, keyword }] as const,
    allRoles: () => [...queryKeys.roles.all, 'all'] as const,
    details: () => [...queryKeys.roles.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.roles.details(), id] as const,
  },
  permissions: {
    all: ['permissions'] as const,
    tree: () => [...queryKeys.permissions.all, 'tree'] as const,
    details: () => [...queryKeys.permissions.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.permissions.details(), id] as const,
  },
  notices: {
    all: ['notices'] as const,
    lists: () => [...queryKeys.notices.all, 'list'] as const,
    list: (page: number, keyword: string, status: number | undefined) =>
      [...queryKeys.notices.lists(), { page, keyword, status }] as const,
    inbox: () => [...queryKeys.notices.all, 'inbox'] as const,
    unread: () => [...queryKeys.notices.all, 'unread'] as const,
    details: () => [...queryKeys.notices.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.notices.details(), id] as const,
  },
  logs: {
    all: ['logs'] as const,
    oper: (page: number, keyword: string, status: number | undefined) =>
      [...queryKeys.logs.all, 'oper', { page, keyword, status }] as const,
    login: (page: number, keyword: string, status: number | undefined) =>
      [...queryKeys.logs.all, 'login', { page, keyword, status }] as const,
  },
  monitor: {
    all: ['monitor'] as const,
    online: (username: string, ip: string) =>
      [...queryKeys.monitor.all, 'online', { username, ip }] as const,
    server: () => [...queryKeys.monitor.all, 'server'] as const,
    datasource: () => [...queryKeys.monitor.all, 'datasource'] as const,
    cache: () => [...queryKeys.monitor.all, 'cache'] as const,
    jobs: () => [...queryKeys.monitor.all, 'jobs'] as const,
  },
  depts: {
    all: ['depts'] as const,
    tree: () => [...queryKeys.depts.all, 'tree'] as const,
    details: () => [...queryKeys.depts.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.depts.details(), id] as const,
  },
};
