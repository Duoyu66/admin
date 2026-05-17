import { useEffect, useRef } from 'react';
import { App } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import {
  NoticeWebSocketClient,
  emitNoticePublished,
  type NoticeWsMessage,
} from '@/lib/noticeWebSocket';
import { stripHtml } from '@/utils/html';

const TYPE_LABELS = ['', '通知', '公告'];

/** 登录后维持公告 WebSocket，收到发布事件时刷新收件箱并弹出提示 */
export function useNoticeWebSocket(enabled: boolean) {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const clientRef = useRef<NoticeWebSocketClient | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMessage = (message: NoticeWsMessage) => {
      if (message.type !== 'NOTICE_PUBLISHED') return;

      queryClient.invalidateQueries({ queryKey: queryKeys.notices.inbox() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.unread() });

      const label = TYPE_LABELS[message.data.noticeType] ?? '通知';
      const summary = stripHtml(message.data.content);

      notification.info({
        message: `新${label}`,
        description: summary ? `${message.data.title}：${summary}` : message.data.title,
        duration: 6,
        placement: 'topRight',
        onClick: () => emitNoticePublished(message.data),
      });
    };

    const client = new NoticeWebSocketClient({ onMessage: handleMessage });
    client.connect();
    clientRef.current = client;

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, [enabled, queryClient, notification]);
}
