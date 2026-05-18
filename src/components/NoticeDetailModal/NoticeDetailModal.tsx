import { useEffect, useState } from 'react';
import { Button, Modal, Space, Tag, Typography } from 'antd';
import {
  BellOutlined,
  CalendarOutlined,
  CloseOutlined,
  CompressOutlined,
  ExpandOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { RichTextView } from '@/components/RichTextView';
import type { NoticeInbox, SysNotice } from '@/api/notice';
import styles from './NoticeDetailModal.module.less';

const MODAL_WIDTH = 960;

const TYPE_META: Record<number, { label: string; icon: typeof BellOutlined; color: string }> = {
  1: { label: '通知', icon: BellOutlined, color: 'processing' },
  2: { label: '公告', icon: SoundOutlined, color: 'success' },
};

type NoticeDetail = Pick<
  SysNotice | NoticeInbox,
  'id' | 'title' | 'content' | 'noticeType' | 'publishTime'
> & { status?: number };

export interface NoticeDetailModalProps {
  open: boolean;
  notice: NoticeDetail | null;
  onClose: () => void;
}

/** 公告 / 通知详情 — 宽屏 + 真全屏（铺满视口） */
export function NoticeDetailModal({ open, notice, onClose }: NoticeDetailModalProps) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!open) setFullscreen(false);
  }, [open]);

  const type = notice?.noticeType ?? 2;
  const meta = TYPE_META[type] ?? TYPE_META[2];
  const Icon = meta.icon;

  const handleClose = () => {
    setFullscreen(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={fullscreen ? '100vw' : MODAL_WIDTH}
      centered={!fullscreen}
      destroyOnHidden
      mask={fullscreen ? false : { closable: true }}
      className={styles.modal}
      wrapClassName={fullscreen ? styles.fullscreenWrap : undefined}
      classNames={fullscreen ? { container: styles.fullscreenContent } : undefined}
      style={
        fullscreen
          ? {
              top: 0,
              margin: 0,
              padding: 0,
              maxWidth: '100vw',
            }
          : undefined
      }
      styles={
        fullscreen
          ? {
              wrapper: { overflow: 'hidden' },
              container: {
                height: '100vh',
                maxHeight: '100vh',
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
              },
              body: {
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
              },
            }
          : { body: { padding: 0 }, container: { padding: 0 } }
      }
      closable={false}
    >
      {notice && (
        <article className={`${styles.shell} ${fullscreen ? styles.shellFullscreen : ''}`}>
          <header className={styles.header}>
            <div className={styles.headerMain}>
              <div className={styles.iconBox} data-type={type}>
                <Icon />
              </div>
              <div className={styles.headerText}>
                <Typography.Title level={4} className={styles.title}>
                  {notice.title}
                </Typography.Title>
                <Space size={8} wrap className={styles.meta}>
                  <Tag icon={<Icon />} color={meta.color}>
                    {meta.label}
                  </Tag>
                  {notice.status != null && (
                    <Tag color={notice.status === 1 ? 'success' : 'default'}>
                      {notice.status === 1 ? '已发布' : '草稿'}
                    </Tag>
                  )}
                  {notice.publishTime && (
                    <Typography.Text type="secondary" className={styles.time}>
                      <CalendarOutlined />
                      <time dateTime={notice.publishTime}>{notice.publishTime}</time>
                    </Typography.Text>
                  )}
                </Space>
              </div>
            </div>

            <Space size={4} className={styles.headerActions}>
              <Button
                type="text"
                icon={fullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={() => setFullscreen((v) => !v)}
                aria-label={fullscreen ? '退出全屏' : '全屏'}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleClose}
                aria-label="关闭"
              />
            </Space>
          </header>

          <div className={styles.body}>
            <RichTextView html={notice.content} className={styles.richContent} />
          </div>

          <footer className={styles.footer}>
            <Button onClick={handleClose}>关闭</Button>
            <Button
              icon={fullscreen ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={() => setFullscreen((v) => !v)}
            >
              {fullscreen ? '退出全屏' : '全屏阅读'}
            </Button>
          </footer>
        </article>
      )}
    </Modal>
  );
}
