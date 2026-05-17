import { getToken } from '@/api/request';
import type { NoticeInbox } from '@/api/notice';

export type NoticeWsMessage =
  | { type: 'CONNECTED' }
  | { type: 'PONG' }
  | { type: 'NOTICE_PUBLISHED'; data: NoticeInbox };

export interface NoticeWebSocketOptions {
  onMessage: (message: NoticeWsMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const MAX_RECONNECT_DELAY = 30_000;

function buildWsUrl(token: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/notice?token=${encodeURIComponent(token)}`;
}

/** 公告 WebSocket 客户端（自动重连 + 心跳） */
export class NoticeWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectAttempts = 0;
  private closedByUser = false;

  constructor(private readonly options: NoticeWebSocketOptions) {}

  connect(): void {
    const token = getToken();
    if (!token) return;

    this.closedByUser = false;
    this.clearReconnect();

    const ws = new WebSocket(buildWsUrl(token));
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.options.onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as NoticeWsMessage;
        if (message.type === 'PONG') return;
        this.options.onMessage(message);
      } catch {
        // ignore malformed payload
      }
    };

    ws.onclose = () => {
      this.stopHeartbeat();
      this.ws = null;
      this.options.onClose?.();
      if (!this.closedByUser) {
        this.scheduleReconnect();
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }

  disconnect(): void {
    this.closedByUser = true;
    this.clearReconnect();
    this.stopHeartbeat();
    this.ws?.close();
    this.ws = null;
  }

  private scheduleReconnect(): void {
    if (this.closedByUser || !getToken()) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, MAX_RECONNECT_DELAY);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private clearReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, 30_000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

export const NOTICE_PUBLISHED_EVENT = 'admin:notice-published';

export function emitNoticePublished(data: NoticeInbox): void {
  window.dispatchEvent(new CustomEvent(NOTICE_PUBLISHED_EVENT, { detail: data }));
}
