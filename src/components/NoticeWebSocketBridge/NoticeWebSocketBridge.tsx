import { getToken } from '@/api/request';
import { useNoticeWebSocket } from '@/hooks/useNoticeWebSocket';

/** 在已登录布局内挂载公告 WebSocket（无 UI） */
export function NoticeWebSocketBridge() {
  useNoticeWebSocket(!!getToken());
  return null;
}
