import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Empty, List, Popover, Space, Spin, Tag, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { useNoticeInbox } from '@/hooks/queries/useNotices';
import { NoticeDetailModal } from '@/components/NoticeDetailModal/NoticeDetailModal';
import { fetchPublishedNotice } from '@/api/notice';
import type { NoticeInbox, SysNotice } from '@/api/notice';
import { stripHtml } from '@/utils/html';
import { normalizeNoticeInbox } from '@/utils/notice';
import { NOTICE_PUBLISHED_EVENT } from '@/lib/noticeWebSocket';
import styles from './NoticeBell.module.less';

const TYPE_LABELS = ['', '通知', '公告'];

/** 顶栏消息 / 公告 */
export function NoticeBell() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [open, setOpen] = useState(false);
  const [viewNotice, setViewNotice] = useState<SysNotice | null>(null);
  const {
    inboxQuery,
    unreadQuery,
    markReadMutation,
    markAllReadMutation,
    refetchInbox,
  } = useNoticeInbox();

  const list = inboxQuery.data ?? [];
  const unread = unreadQuery.data?.count ?? 0;
  const inboxLoading = inboxQuery.isFetching && !inboxQuery.data;
  const inboxError = inboxQuery.isError;

  const handleOpenItem = useCallback(
    async (item: NoticeInbox) => {
      if (!item.read) {
        await markReadMutation.mutateAsync(item.id);
      }
      try {
        const detail = await fetchPublishedNotice(item.id);
        setViewNotice(detail);
      } catch {
        setViewNotice({
          id: item.id,
          title: item.title,
          content: item.content,
          noticeType: item.noticeType,
          status: 1,
          publishTime: item.publishTime,
        });
      }
      setOpen(false);
    },
    [markReadMutation]
  );

  useEffect(() => {
    const onPublished = (e: Event) => {
      const item = (e as CustomEvent<NoticeInbox>).detail;
      if (!item?.id) return;
      void handleOpenItem(normalizeNoticeInbox(item));
    };
    window.addEventListener(NOTICE_PUBLISHED_EVENT, onPublished);
    return () => window.removeEventListener(NOTICE_PUBLISHED_EVENT, onPublished);
  }, [handleOpenItem]);

  const handlePopoverOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      refetchInbox();
    }
  };

  const content = (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Typography.Text strong>消息中心</Typography.Text>
        {unread > 0 && (
          <Button
            type="link"
            size="small"
            loading={markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
          >
            全部已读
          </Button>
        )}
      </div>
      {inboxLoading ? (
        <div className={styles.state}>
          <Spin size="small" />
        </div>
      ) : inboxError ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="公告加载失败"
        >
          <Button type="link" size="small" onClick={() => refetchInbox()}>
            重试
          </Button>
        </Empty>
      ) : list.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无公告" />
      ) : (
        <List
          className={styles.list}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              className={`${styles.item} ${item.read ? styles.read : styles.unread}`}
              onClick={() => handleOpenItem(item)}
            >
              <List.Item.Meta
                title={
                  <Space size={6}>
                    {!item.read && <span className={styles.dot} />}
                    <span>{item.title}</span>
                    <Tag>{TYPE_LABELS[item.noticeType] ?? '通知'}</Tag>
                  </Space>
                }
                description={
                  <>
                    <Typography.Paragraph
                      type="secondary"
                      ellipsis={{ rows: 2 }}
                      style={{ marginBottom: 4 }}
                    >
                      {stripHtml(item.content)}
                    </Typography.Paragraph>
                    {item.publishTime && (
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {item.publishTime}
                      </Typography.Text>
                    )}
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
      {hasPermission('sys:notice:list') && (
        <div className={styles.footer}>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setOpen(false);
              navigate('/notices');
            }}
          >
            管理公告
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Popover
        content={content}
        title={null}
        trigger="click"
        open={open}
        onOpenChange={handlePopoverOpen}
        placement="bottomRight"
        overlayClassName={styles.popover}
      >
        <button type="button" className="admin-header-icon-btn" aria-label="消息通知">
          <Badge count={unread} size="small" offset={[-2, 2]}>
            <BellOutlined />
          </Badge>
        </button>
      </Popover>

      <NoticeDetailModal
        open={!!viewNotice}
        notice={viewNotice}
        onClose={() => setViewNotice(null)}
      />
    </>
  );
}
